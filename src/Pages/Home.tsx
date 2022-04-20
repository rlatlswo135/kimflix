import React,{useState} from 'react';
import Nav from '../Components/Nav';
import styled from 'styled-components';
import { useQuery } from 'react-query'
import {getNowPlaying} from '../api'
import { IGetMovies } from '../api';
import { makeImgUrl } from '../api';
import { motion,AnimatePresence } from 'framer-motion';
import {useNavigate,useMatch,useParams} from 'react-router-dom'
import MovieModal from '../Components/MovieModal';
import { red } from 'colors';
import ImgSlider from '../Components/ImgSlider';

const Container = styled(motion.div)`
    height:100vh;
    transform-origin:center center;
`
const Loader = styled.div`
    height:20vh;
    display:flex;
    justify-content: center;
    align-items: center;
`
const Banner = styled.div<{bgPhoto:string}>`
    height:100vh;
    display:flex;
    flex-direction: column;
    justify-content: center;
    /* 오늘의 배움 백그라운드 이미지를 쌓을수있다는거 mdn공식문서에도 있음 이건 이미지 위에 검정색 투명이미지를 쌓아서 이미지를 어둡게하는느낌 */
    background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.6)),url(${props => props.bgPhoto});
    padding:0% 4%;
    background-size: cover;
`
const Title = styled.h2`
    font-size:5em;
    margin-bottom: 3%;
`
const OverView = styled.p`
    font-size:1.5em;
    width:60%;
    letter-spacing: 0.04em;
`
const Slider = styled.div`
    position: relative;
    width:100%;
    top:-25%;
`
const ModalWrap = styled(motion.div)`
    width:100vw;
    min-height:100vh;
    position: fixed;
    top:0;
    background-color:rgba(0,0,0,0.5);
    opacity:0;
`
const Row = styled(motion.div)<{bgPhoto?:string}>`
    display:grid;
    grid-template-columns: repeat(6,1fr);
    gap:10px;
    margin-bottom: 5px;
    position: absolute;
    width: 100%;
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
    width:100%;
`
const RowItemClick = styled(motion.div)`
    position: fixed;
    width:90vw;
    height:90vh;
    top:5%;
    left:0;
    right:0;
    margin:0 auto;
`
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
const rowItemInfoClickVars={
    noneClick:{opacity:0},
    click:{opacity:1},
    exit:{opacity:0}
}

const Home = () => {
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
    //현재 상영중인 영화를 최신순으로 정렬
    return (
        <Container initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{duration:2}}>
            {nowMvLoading ? 
            <Loader>Loading...</Loader> :
            <>
            <Banner bgPhoto={makeImgUrl(sortedRelease? sortedRelease[0].backdrop_path : "")}>
                <Title>{sortedRelease ? sortedRelease[0].title : null}</Title>
                <OverView>{sortedRelease ? sortedRelease[0].overview : null}</OverView>
            </Banner>
                {/* <Slider>
                <AnimatePresence initial={false} onExitComplete={()=>setLeavingSlide(prev => !prev)}>
                    <Row
                    key={sliderKey}
                    variants={sliderVars}
                    initial='stop'
                    animate='move'
                    transition={{duration:1,type:"tween"}}
                    exit='exit'
                    >  
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
                        >
                            <img src={makeImgUrl(item.poster_path)}/>

                            <RowItemInfo variants={rowItemInfoVars}/>
                        </RowItem>
                            )}
                    </Row>
                </AnimatePresence>
                </Slider> */}
                <ImgSlider movie={{state:'now_playing'}}/>
                <AnimatePresence>
                {
                    isMovieRoute?
                        <ModalWrap animate={{opacity:1}} exit={{opacity:0}} onClick={()=>navigate('/')}>
                            <RowItemClick
                            variants={rowItemInfoClickVars}
                            animate="click"
                            layoutId={layoutId}
                            exit="exit"
                            >
                                <MovieModal movieId={Number(layoutId)}/>
                            </RowItemClick>
                        </ModalWrap>
                    :null                    
                }
                </AnimatePresence>
            </>
            }
        </Container>
    );
};

export default Home;

                    {/* 실제로 재 렌더되는게 아니다. 애니메이션 효과를주는거다 key가 바뀌면 리액트에셔 해당 요소를 새로운 구성요소로 취급해서
                    전에 key를 갖던 컴포넌트가 마운트가 해제된다 그래서 해제될때 애니메이션이 발동하는거고
                    결국 key가 중요하다.  */}

                    {/* 반드시 해당 애니메이션효과를 주고싶은 바로 부모 컴포넌트에 AnimatePresence를 줘야 exit가 발동함. */}
                    {/* onExitComplete => exit가 끝나면 실행할 함수를 넣어주는 옵션 */}
                    {/* 슬라이더 컨트롤을 매번 클릭하면 애니메이션 충돌이일어나기때문에 방지하기위한 로직. 키를 증가시키면 exit애니메이션이 발동하니까
                    exit가 다종료된 후에 슬라이드가능상태(leavingState)스위치를 바꿔주고. 그다음 set key하는 형식 */}
                    {/* initial => 마운트될때 애니메이션 효과를 false즉 animatepresence는 마운트/언마운트간에 애니메이션을 주는 그런느낌의 기능이네 */}

                                                {/* 부모 RowItem에 whileHover등 props등이 자동으로 자식한테도 상속된다. => 그래서 자식도 똑같이 작동하는거
                            그러니까 자식단에도 부모단에서 준 애니메이션 키를 넣어서 새로운 variants를 만들어주면 hover시에 자식의 애니메이션은 또 다른
                            애니메이션으로 커스텀되는거지 */}

                                                        {/* 굳이 inital을 줄필요없다. 등장시에만 조절하고싶은거면 animate만 조절하면되겠지 
                            초기상태는 css 안에 넣어주면 되는거니까. 근데 초기에 어떻게 등장시키고싶은건지를 조절하려면
                            initial을 써야겠지. */}

                {/* 항상 AnimatePresence는 visible하게. */}
