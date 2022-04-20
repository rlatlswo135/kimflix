import React,{useState} from 'react';
import {ISimilerMovie} from './MovieModal'
import styled from 'styled-components'
import {motion,AnimatePresence} from 'framer-motion'
import {useNavigate,useMatch} from 'react-router-dom'
import {useQuery} from 'react-query'
import {IGetMovies,getMovies,makeImgUrl} from '../api'
interface IProps{
    movie:{
        state:string;
        data?:ISimilerMovie
    },
    title:string
}

const Slider = styled.div`
    width:100%;
    top:-10%;
    margin-bottom:2%;
    border:3px solid gray;
    h1{
        padding-left:2%;
        padding-bottom:1%;
    }
    position: relative;
`
const ArrowWrap = styled.div`
    position: relative;
    border:3px solid brown;
    height:100%;
`
const RowItem = styled(motion.div)`
    height: 200px;
    cursor:pointer;
    position: absolute;
    top:0px;
    &:first-child{
        transform-origin: left center;
    }
    &:nth-child(6){
        transform-origin: right center;
    }
    img{
        width:100%;
        height:100%;
    }
`
const RowItemInfo = styled(motion.div)`
    padding:20px;
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    width:100%;
    border:3px solid red;
`
const Next = styled(motion.span)`
    position: absolute;
    border:1px solid green;
    display:flex;
    width:2.5%;
    height:100%;
    justify-content: center;
    align-items: center;
    font-size:1.8em;
    background-color: rgba(0,0,0,0.5);
    top:0%;
    left:97.5%; 
`
const Prev = styled(motion.span)`
    position: absolute;
    width:2.5%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    font-size:1.8em;
    background-color: rgba(0,0,0,0.5);
    top:0%;
    left:0%;
`
const Row = styled(motion.div)<{bgPhoto?:string}>`
    display:grid;
    grid-template-columns: repeat(6,1fr);
    gap:10px;
    position: absolute;
    top:0px;
    left:0px;
`
const rowItemVars={
    // 다시한번 기억. variants는 커스텀된 애니메이션의 집합체다. 그니까 어느 시점에 트랜지션을 주는것도 가능한거지 => rowitem에 hover시 애니메이션효과를 딜레이를 좀준거
    normal:{
        scale:1,
    },hover:{
        scale:1.5,
        y:-50,
        opacity:1,
        transition:{
            delay:0.3,
            type:"tween",
        }
    }
}
const sliderVars={
    stop:(keydown:boolean)=>({
        // 화면끝에서 불러오면 퇴장고 ~ 불러올때 그 첫번째 박스가 붙어서 나오니까 약간의 gap을 준거 => 근데 연속클릭안되게 코드조절하니까 필요없을것같다
        x:keydown ? -window.innerWidth : window.innerWidth + 10,
        opacity:0.1
    }),
    move:{
        x:0,
        opacity:1
    },
    exit:(keydown:boolean)=>({
        x: keydown ? window.innerWidth+10 : -window.innerWidth,
        opacity:0.1
    })
}
const rowItemInfoVars={
    hover:{
        opacity:1,
        transition:{
            delay:0.35,
            type:"tween"
        }
    }
}
const ImgSlider = ({movie,title}:IProps) => {
    const navigate = useNavigate()
    const isMovieRoute = useMatch('/movie:id')
    //고유키,fetcher함수. 고유키가 배열. obj도 가능하며 좀더 상세한 고유키를 보여줄수있다
    const {isLoading:nowMvLoading,data:nowMvData} = useQuery<IGetMovies>(['movies',movie.state],()=>getMovies(movie.state))
    const [sliderKey,setSliderKey] = useState(0)
    const [leavingSlider,setLeavingSlide] = useState(false)
    const [sliderIndex,setSliderIndex] = useState(0)
    const [layoutId,setLayoutId] = useState('')
    const [prev,setPrev] = useState(false)
    // key가 0일때는 오른쪽에만 0이아닐때는 왼쪽에도
    const sortedRelease = nowMvData?.results.sort((a,b) => {
        let x = a.release_date.toLowerCase()
        let y = b.release_date.toLowerCase()
        if(x < y) return -1
        if(x > y) return 1
        return 0
    }).reverse()
    function sliderKeyUp(){
        if(leavingSlider) return;
        setLeavingSlide(true)
        setSliderKey(prev => prev + 1)
        setPrev(false)
        if(sortedRelease){
            setSliderIndex(prev => prev+6 > sortedRelease.length ? 0 : prev+6)
        }
    }
    function sliderKeyDown(){
        if(leavingSlider) return;
        setLeavingSlide(true)
        setSliderKey(prev => prev - 1)
        setPrev(true)
        if(sortedRelease){
            setSliderIndex(prev => prev-6)
        }
    }
    function goMovieDetail(movieId:string){
        navigate(`/movie${movieId}`)
        setLayoutId(movieId)
    }
    return (
        <Slider>
            {/* <h1>{title}</h1> */}
            {/* <ArrowWrap> */}
             <AnimatePresence initial={false} onExitComplete={()=>setLeavingSlide(prev => !prev)} custom={prev}>
                <Row custom={prev} key={sliderKey} variants={sliderVars} initial='stop' animate='move' transition={{duration:1,type:"tween"}} exit='exit'>  
                    {sortedRelease?.slice(1).slice(sliderIndex,sliderIndex+6)
                    .map((item,index) => 
                    <RowItem key={item.id} initial='normal' whileHover='hover' variants={rowItemVars}
                    transition={{duration:0.3}} onClick={()=>goMovieDetail(`${item.id}`)} layoutId={`${item.id}`}>
                        <img src={makeImgUrl(item.poster_path)}/>
                        <RowItemInfo variants={rowItemInfoVars}/>
                    </RowItem>
                )}
                </Row>
                {sliderIndex?<Prev onClick={sliderKeyDown} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.1}}>{'<'}</Prev>:null}
                <Next initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.1}} onClick={sliderKeyUp}>{'>'}</Next>
            </AnimatePresence>
            {/* </ArrowWrap> */}
    </Slider>
    );
};

export default ImgSlider;