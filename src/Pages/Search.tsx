import React,{useState,memo} from 'react';
import Nav from '../Components/Nav';
import styled from 'styled-components';
import { useQuery } from 'react-query'
import {getSearchContents} from '../api'
import { makeImgUrl } from '../api';
import { motion,AnimatePresence } from 'framer-motion';
import {useNavigate,useMatch,useLocation} from 'react-router-dom'
import MovieModal from '../Components/MovieModal';
import { red } from 'colors';
import ImgSlider from '../Components/ImgSlider';
import ImgSliderTv from '../Components/ImgSliderTv';
import TvModal from '../Components/TvModal';
import {Helmet} from 'react-helmet'
interface IGetSearch{
    page:number;
    results:{
        adult?:boolean,
        backdrop_path:string,
        id:number,
        media_type:string,
        original_title?:string,
        original_name?:string
        overview:string
        poster_path:string
        release_date?:string
        title?:string
        vote_average:number,
        vote_count:number
        name?:string,
        first_air_date?:string
    }[]
}
const Container = styled(motion.div)`
    height:100vh;
`
const Loader = styled.div`
    height:20vh;
    display:flex;
    justify-content: center;
    align-items: center;
`
const Banner = styled.div<{bgphoto:string}>`
    height:100vh;
    display:flex;
    flex-direction: column;
    justify-content: center;
    /* 오늘의 배움 백그라운드 이미지를 쌓을수있다는거 mdn공식문서에도 있음 이건 이미지 위에 검정색 투명이미지를 쌓아서 이미지를 어둡게하는느낌 */
    background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.6)),url(${props => props.bgphoto});
    padding:0% 4%;
    background-size: cover;
`
const Title = styled.h2`
    font-size:10em;
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
    /*이부분에 postion rel을 준게 원인이었다. 하위컴포넌트가 다 rel이 먹었으니까 */
`
const Slider = styled.div`
    margin-bottom: 3%;
`
const Search = () => {
    const location = useLocation()
    const keyword = new URLSearchParams(location.search).get('keyword')
    const content = new URLSearchParams(location.search).get('content')
    const contentId = new URLSearchParams(location.search).get('searchId')
    const isSearchModal = keyword && content && contentId
    //고유키,fetcher함수. 고유키가 배열. obj도 가능하며 좀더 상세한 고유키를 보여줄수있다
    const {isLoading,data} = useQuery<IGetSearch>(['search',keyword],()=>getSearchContents(keyword||''))
    const movieArray = data ? data.results.filter(item => item.media_type === 'movie') : null
    const tvArray = data ? data.results.filter(item => item.media_type === 'tv') : null
    //현재 상영중인 영화를 최신순으로 정렬
    return (
        <AnimatePresence>
            <Container initial={{opacity:0,y:-window.innerHeight}} animate={{opacity:1,y:0}} exit={{opacity:0,x:window.innerWidth}} transition={{duration:0.5,type:"tween"}}>
            <Helmet>
                <title>KimFlix | Search</title>
            </Helmet>
                {isLoading? <Loader>Loading...</Loader>:
                <>
                    <Banner bgphoto={makeImgUrl(data?.results[0].backdrop_path||"")}>
                        <Title>{data?.results[0].title || data?.results[0].name}</Title>
                        <OverView>{data?.results[0].overview}</OverView>
                    </Banner>
                    <SliderBox>
                        <Slider>
                            <ImgSlider movie={{state:`search-${keyword}`,data:movieArray||[]}} title={`${keyword}로 검색한 영화`} />
                        </Slider>
                        <Slider>
                            <ImgSliderTv movie={{state:`search-${keyword}`,data:tvArray||[]}} title={`${keyword}로 검색한 TV컨텐츠`} />
                        </Slider>
                    </SliderBox>
                    <AnimatePresence>
                        {/* http://localhost:3000/search?keyword=master&content=tv */}
                    {
                        isSearchModal?(
                            content === 'tv' ? <TvModal content={'tv'}/> : <MovieModal content={'movie'} />
                        ):null
                    }
                    </AnimatePresence>
                </>}
            </Container>
        </AnimatePresence>
    );
};

export default Search;

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


