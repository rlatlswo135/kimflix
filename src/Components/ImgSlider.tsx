import React,{useState} from 'react';
import {ISimilerMovie} from './MovieModal'
import styled from 'styled-components'
import {motion,AnimatePresence} from 'framer-motion'
import {useNavigate,useMatch,useLocation} from 'react-router-dom'
import {useQuery} from 'react-query'
import {IGetMovies,getContents,makeImgUrl, getSimilarContents,IGetTvShows,ITv} from '../api'
interface IProps{
    movie:{
        state:string;
        movieId?:string;
        data?:any[]
    },
    title:string;
    content?:string;
}

const Slider = styled.div`
    width:100%;
    h1{
        letter-spacing: 0.1em;
        font-weight: 900;
        padding-left:2%;
        font-size:3em;
        margin-bottom: 1%;
    }
`
const Row = styled(motion.div)<{bgPhoto?:string}>`
    display:grid;
    grid-template-columns: repeat(6,1fr);
    gap:10px;
    margin-bottom: 5px;
    position: absolute;
    width: 100%;
`
const Next = styled(motion.span)<{state:string}>`
    position: absolute;
    display:flex;
    width:2.5%;
    height:100%;
    justify-content: center;
    align-items: center;
    font-size:1.8em;
    background-color: rgba(0,0,0,0.5);
    top:0%;
    /* similer때는 leftf를 1 늘려야 */
    left:${props => props.state ==='similer' ? '97.5%' : '96.5%'} ;
`
const Wrap = styled.div`
    position: relative;
    height:300px;
    padding: 0% 1%;
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
const RowItem = styled(motion.div)`
    height: 280px;
    cursor:pointer;
    &:first-child{
        transform-origin: left center;
    }
    &:nth-child(6){
        transform-origin: right center;
    }
    /* 맨처음에는 인덱스로 첫번째 끝번째가 맞냐를 props로 받아서 각각 분기해서 transform-origin을 넣었는데 그냥 이렇게하면 되는거였네생각해보니까 */
    img{
        width:100%;
        height:100%;
    }
    /* 이미지를 사이즈에 맞게 퍼센트로 비율을 조정하는듯 */
`
const RowItemInfo = styled(motion.div)`
    padding:20px;
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    display:flex;
    justify-content: space-between;
    width:100%;
    h4{
        span{
                font-size:0.6em;
                color:rgba(255,255,255,0.7);
            }
    }
    p{
        color:yellow;
        font-weight: 600;
            span{
                font-size:0.6em;
                color:rgba(255,255,255,0.7);
            }
    }
    @media screen and (max-width:1680px){
        padding:10px;
        h4{
            span{
                font-size:0.4em;
            }
        }
        p{
            color:yellow;
            font-weight: 600;
            span{
                font-size:0.4em;
                color:rgba(255,255,255,0.7);
            }
        }
    }
`

const sliderVars={
    stop:(prev:string) => ({
        // 화면끝에서 불러오면 퇴장고 ~ 불러올때 그 첫번째 박스가 붙어서 나오니까 약간의 gap을 준거 => 근데 연속클릭안되게 코드조절하니까 필요없을것같다
        x:prev==='prev'? -window.innerWidth :window.innerWidth + 10,
        opacity:0.1
    }),
    move:{
        x:0,
        opacity:1
    },
    exit:(prev:string) => ({
        x:prev==='prev'? window.innerWidth + 10 : -window.innerWidth,
        opacity:0.1
    })
}

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
    const getContent = 'movie'
    //고유키,fetcher함수. 고유키가 배열. obj도 가능하며 좀더 상세한 고유키를 보여줄수있다
    const {isLoading:nowMvLoading,data:nowMvData} 
    = useQuery<IGetMovies>([`movie-${movie.state}`,`${movie.movieId}`],
    movie.state==='similer' ? ()=>getSimilarContents(Number(movie.movieId),'movie') : ()=>getContents(movie.state,'movie'))
    const [sliderKey,setSliderKey] = useState(0)
    const [leavingSlider,setLeavingSlide] = useState(false)
    const [sliderIndex,setSliderIndex] = useState(0)
    const [prev,setPrev] = useState(false)
    const isHome = useMatch('/')
    // key가 0일때는 오른쪽에만 0이아닐때는 왼쪽에도
    const sortedRelease = movie.data ||(nowMvData?.results.sort((a,b) => {
        let x = a.release_date.toLowerCase()
        let y = b.release_date.toLowerCase()
        if(x < y) return -1
        if(x > y) return 1
        return 0
    }).reverse())
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
            if(movie.state.includes('search')){
                let keyword = movie.state.split('-')[1]
                navigate(`/search?keyword=${keyword}&content=movie&searchId=${movieId}`)
            }else{
                navigate(`/movie?movieId=${movieId}&state=${movie.state}`)
            }
    }
    return (
        <Slider>
            <h1>{title}</h1>
            <Wrap>
            <AnimatePresence initial={false} onExitComplete={()=>setLeavingSlide(prev => !prev)} custom={prev?'prev':'next'}>
                <Row
                key={sliderKey}
                variants={sliderVars}
                initial='stop'
                custom={prev?'prev':'next'}
                animate='move'
                transition={{duration:1,type:"tween"}}
                exit='exit'
                >  
                    {sortedRelease?.slice(sliderIndex,sliderIndex+6)
                    .map((item,index) => 
                        <RowItem 
                        key={item.id}
                        initial='normal'
                        whileHover='hover'
                        variants={rowItemVars}
                        transition={{duration:0.3}}
                        onClick={()=>goMovieDetail(`${item.id}`)}
                        layoutId={`${movie.state}-${item.id}`}
                        >
                            <img src={makeImgUrl(item.poster_path)}/>
                            <RowItemInfo variants={rowItemInfoVars}>
                                <h4>{item.title}<span>{`(${item.release_date.split('-')[0]}-${item.release_date.split('-')[1]})`}</span></h4>
                                <p>{`★${item.vote_average}`}<span>{`(${item.vote_count})`}</span></p>
                            </RowItemInfo>
                        </RowItem>
                    )}
                    {sliderIndex?<Prev onClick={sliderKeyDown} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.1}}>{'<'}</Prev>:null}
                    <Next state={isHome?'home':'similer'} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.1}} onClick={sliderKeyUp}>{'>'}</Next>
                </Row>
            </AnimatePresence>
            </Wrap>
        </Slider>
    );
};

export default ImgSlider;