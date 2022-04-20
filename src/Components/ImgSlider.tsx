import React,{useState} from 'react';
import {ISimilerMovie} from './MovieModal'
import styled from 'styled-components'
import {motion,AnimatePresence} from 'framer-motion'
import {useNavigate,useMatch} from 'react-router-dom'
import {useQuery} from 'react-query'
import {IGetMovies,getNowPlaying,makeImgUrl} from '../api'
interface IProps{
    movie?:{
        state:string;
        data?:ISimilerMovie
    }
}
const Row = styled(motion.div)<{bgPhoto?:string}>`
    display:grid;
    grid-template-columns: repeat(6,1fr);
    gap:10px;
    margin-bottom: 5px;
    position: absolute;
    width: 100%;
`
const Slider = styled.div`
    position: relative;
    width:100%;
    border:5px solid red;
    top:-25%;
`
const RowItem = styled(motion.div)`
    height: 200px;
    cursor:pointer;
    &:first-child{
        transform-origin: left center;
    }
    &:last-child{
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
    position: absolute;
    width:100%;
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
    stop:{
        // 화면끝에서 불러오면 퇴장고 ~ 불러올때 그 첫번째 박스가 붙어서 나오니까 약간의 gap을 준거 => 근데 연속클릭안되게 코드조절하니까 필요없을것같다
        x:window.innerWidth + 10,
        opacity:0.1
    },
    move:{
        x:0,
        opacity:1
    },
    exit:{
        x:-window.innerWidth,
        opacity:0.1
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
const ImgSlider = ({movie}:IProps) => {
    const navigate = useNavigate()
    const isMovieRoute = useMatch('/movie:id')
    //고유키,fetcher함수. 고유키가 배열. obj도 가능하며 좀더 상세한 고유키를 보여줄수있다
    const {isLoading:nowMvLoading,data:nowMvData} = useQuery<IGetMovies>(['movies','nowPlaying'],()=>getNowPlaying('now_playing'))
    const [sliderKey,setSliderKey] = useState(0)
    const [leavingSlider,setLeavingSlide] = useState(false)
    const [sliderIndex,setSliderIndex] = useState(0)
    const [layoutId,setLayoutId] = useState('')
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
        if(sortedRelease){
            setSliderIndex(prev => prev+6 > sortedRelease.length ? 0 : prev+6)
        }
    }
    function goMovieDetail(movieId:string){
        navigate(`/movie${movieId}`)
        setLayoutId(movieId)
    }
    console.log(movie)
    return (
        <Slider>
        {/* 반드시 해당 애니메이션효과를 주고싶은 바로 부모 컴포넌트에 AnimatePresence를 줘야 exit가 발동함. */}
        {/* onExitComplete => exit가 끝나면 실행할 함수를 넣어주는 옵션 */}
        {/* 슬라이더 컨트롤을 매번 클릭하면 애니메이션 충돌이일어나기때문에 방지하기위한 로직. 키를 증가시키면 exit애니메이션이 발동하니까
        exit가 다종료된 후에 슬라이드가능상태(leavingState)스위치를 바꿔주고. 그다음 set key하는 형식 */}
        {/* initial => 마운트될때 애니메이션 효과를 false즉 animatepresence는 마운트/언마운트간에 애니메이션을 주는 그런느낌의 기능이네 */}
             <AnimatePresence initial={false} onExitComplete={()=>setLeavingSlide(prev => !prev)}>
        {/* 실제로 재 렌더되는게 아니다. 애니메이션 효과를주는거다 key가 바뀌면 리액트에셔 해당 요소를 새로운 구성요소로 취급해서
        전에 key를 갖던 컴포넌트가 마운트가 해제된다 그래서 해제될때 애니메이션이 발동하는거고
        결국 key가 중요하다.  */}
        <Row
        key={sliderKey}
        variants={sliderVars}
        initial='stop'
        animate='move'
        transition={{duration:1,type:"tween"}}
        exit='exit'
        >  
        {/* 첫번째영화는 이미 배너에 있으니까 그다음꺼부터 6은 슬라이더 개수인데 나중에 변수로 해서 다뤄도 될듯*/}
            {sortedRelease?.slice(1)
            .slice(sliderIndex,sliderIndex+6)
            .map((item,index) => 
            <RowItem 
            key={item.id}
            initial='normal'
            whileHover='hover'
            variants={rowItemVars}
            transition={{duration:0.3}}
            onClick={()=>goMovieDetail(`${item.id}`)}
            layoutId={`${item.id}`}
            // 이 layId가 어떻길래 꼬였지;; => `layout${index}` 원하는대로 애니메이션 안됬음 layoutId가 어딘가에서 겹쳐서 그런가봄
            // => 아.. index가 같겠지 배열을 슬라이스해서 가져오니까 인덱스는 겹치지. 그래서 그런가보다. . !! 띠용 ! !!
            >
                <img src={makeImgUrl(item.poster_path)}/>
                {/* 부모 RowItem에 whileHover등 props등이 자동으로 자식한테도 상속된다. => 그래서 자식도 똑같이 작동하는거
                그러니까 자식단에도 부모단에서 준 애니메이션 키를 넣어서 새로운 variants를 만들어주면 hover시에 자식의 애니메이션은 또 다른
                애니메이션으로 커스텀되는거지 */}
                <RowItemInfo variants={rowItemInfoVars}/>
            </RowItem>
                )}
        </Row>
    </AnimatePresence>
    </Slider>
    );
};

export default ImgSlider;