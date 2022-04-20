import React,{useState} from 'react';
import Nav from '../Components/Nav';
import styled from 'styled-components';
import { useQuery } from 'react-query'
import {getMovies} from '../api'
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
const SliderBox = styled.div`
    position: relative;
    top:-25%;
    height:100vh;
    border:1px solid red;
    /*이부분에 postion rel을 준게 원인이었다. 하위컴포넌트가 다 rel이 먹었으니까 */
`
const Home = () => {
    const isMovieRoute = useMatch('/movie:id')
    //고유키,fetcher함수. 고유키가 배열. obj도 가능하며 좀더 상세한 고유키를 보여줄수있다
    const {isLoading:nowMvLoading,data:nowMvData} = useQuery<IGetMovies>(['movies','nowPlaying'],()=>getMovies('now_playing'))
    const sortedRelease = nowMvData?.results.sort((a,b) => {
        let x = a.release_date.toLowerCase()
        let y = b.release_date.toLowerCase()
        if(x < y) return -1
        if(x > y) return 1
        return 0
    }).reverse()

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
            <SliderBox>
                <div>
                    aa
                    <ImgSlider movie={{state:'now_playing'}} title={'현재 상영중'}/>
                </div>
                <div>
                    aa
                    {/* <ImgSlider movie={{state:'now_playing'}} title={'현재 상영중'}/> */}
                </div>
            </SliderBox>
                {/* <AnimatePresence>
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
                </AnimatePresence> */}
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

