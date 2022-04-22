import React, { useEffect,useState,memo} from 'react';
import styled from 'styled-components'
import { motion,AnimatePresence } from 'framer-motion';
import {useQuery} from 'react-query'
import { getContentDetail } from '../api';
import {makeImgUrl,makeVideoUrl} from '../api'
import {useParams,useNavigate,useMatch,useLocation} from 'react-router-dom'
import ImgSliderTv from './ImgSliderTv';
import ReactLoading from 'react-loading'

interface Genre {
    id: number;
    name: string;
}
interface LastEpisodeToAir {
        air_date: string;
        episode_number: number;
        id: number;
        name: string;
        overview: string;
        production_code: string;
        season_number: number;
        still_path: string;
        vote_average: number;
        vote_count: number;
}
interface Network {
        name: string;
        id: number;
        logo_path: string;
        origin_country: string;
    }

interface ProductionCompany {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }


interface Season {
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string;
        season_number: number;
    }

interface Result {
        iso_639_1: string;
        iso_3166_1: string;
        name: string;
        key: string;
        site: string;
        size: number;
        type: string;
        official: boolean;
        published_at: Date;
        id: string;
    }

interface Videos {
        results: Result[];
    }

interface ITvDetail {
        adult: boolean;
        backdrop_path: string;
        episode_run_time: number[];
        first_air_date: string;
        genres: Genre[];
        homepage: string;
        id: number;
        in_production: boolean;
        languages: string[];
        last_air_date: string;
        last_episode_to_air: LastEpisodeToAir;
        name: string;
        next_episode_to_air?: any;
        networks: Network[];
        number_of_episodes: number;
        number_of_seasons: number;
        origin_country: string[];
        original_language: string;
        original_name: string;
        overview: string;
        popularity: number;
        poster_path: string;
        production_companies: ProductionCompany[];
        seasons: Season[];
        vote_average: number;
        vote_count: number;
        videos: Videos;
    }
const Container = styled(motion.div)<{bgphoto:string}>`
    height:100%;
    padding:5% 5%;
    padding-bottom: 0%;
    background-image: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.9)),url(${props => props.bgphoto});
    background-size: cover;
    background-position: center center;
`

const Title = styled(motion.div)`
    height:12%;
    padding-bottom:2%;
    border-bottom:1px solid rgba(0,0,0,0.08);
    h1{
        font-size:5em;
        letter-spacing: 0.1em;
    }
    h4{
        padding-left:1%;
        font-size:1.3em;
        letter-spacing: 0.1em;
        font-style: oblique;
    }
    @media screen and (max-width:1680px){
        height:10%;
        h1{
            font-size:3.5em;
        }
        h4{
            font-size:1.1em;
        }
    }
`

const ContentInfo = styled.div`
    display:flex;
    align-items: center;
    justify-content: flex-end;
    flex:1;
    margin-bottom: 5%;
    padding-top:1%;
    padding-left:1%;
    div{
        font-size:1.6em;
        color:rgba(255,255,255,0.7);
        font-weight: 500;
        height:15px;
        margin-right: 1%;
        &:first-child{
            font-weight: 900;
        }
        &:last-child{
            color:yellow;
            span{
                font-size:0.6em;
                color:rgba(255,255,255,0.7);
            }
        }
    }
    @media screen and (max-width:1680px){
        div{
            font-size:1.2em;
            margin-right:1.5%;
        }
    }
`
const TextContent = styled(motion.div)`
    display:grid;
    grid-template-rows: 1fr 3.2fr;
    height:88%;
`
const InfoWrap = styled.div`
`
const OverView = styled.div`
    color:white;
    font-size:1.3em;
    font-weight: 600;
    letter-spacing: 0.1em;
    padding-bottom: 1%;
    @media screen and (max-width:1680px){
        font-size:1.15em;
    }
`
const ContentInfoWrap = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    width:100%;
`
const Creator = styled.div`
    flex:1;
    display:flex;
    width:50px;
    height:50px;
    justify-content: flex-start;
    div{
        margin-right: 8%;
    }
    img{
        width:100px;
        height:50px;
        background-color:rgba(255,255,255,0.1);
    }
    @media screen and (max-width:1680px){
        img{
            width:80px;
            height:40px;
        }
    }
    /* 붕떠서보인다 반응형으로 어느시점에는 없애야할듯 */
`
const rowItemInfoClickVars={
    noneClick:{opacity:0},
    click:{opacity:1},
    exit:{opacity:0}
}
const ModalWrap = styled(motion.div)`
    width:100vw;
    min-height:100vh;
    position: fixed;
    top:0;
    background-color:rgba(0,0,0,0.5);
    opacity:0;
`
const RowItemClick = styled(motion.div)`
    position: fixed;
    width:90vw;
    height:90vh;
    top:5%;
    left:0;
    right:0;
    z-index:100;
    margin:0 auto;
`
const ContentVideo = styled(motion.div)`
    overflow: hidden;
    position: relative;
    iframe{
        width:100%;
        height:100%;
    }
`
const LoadingBox = styled(motion.div)`
    display:flex;
    align-items: center;
    justify-content: center;
    width:100%;
    height:100%;
`
const SimilerContent = styled.div`
    padding-top:10%;
    @media screen and (max-width:1680px){
        padding-top:5%;
    }
`
const Exit = styled.div`
    width:3%;
    height:5%;
    color:${props => props.theme.red};
    display:flex;
    justify-content: center;
    font-size:2.5em;
    align-items: center;
    position: absolute;
    cursor: pointer;
    left:97%;
`
interface IProps{
    content:string;
    movieId?:number
}
const TvModal = (props:IProps) => {
    const location = useLocation();
    const navigate = useNavigate()
    const movieId=new URLSearchParams(location.search).get('tvId') || new URLSearchParams(location.search).get('searchId')
    const state = new URLSearchParams(location.search).get('state')
    const getContent = 'tv'
    const [loading,setLoading] = useState(false)
    const {isLoading,data:movieDetail} = useQuery<ITvDetail>(['movieDetail',movieId],()=>getContentDetail(Number(movieId),getContent))
    const {site:platForm,key:videoKey} = movieDetail?.videos?.results.length ? movieDetail?.videos.results[0] : {site:"",key:""}
    useEffect(()=>{
        setTimeout(()=>setLoading(true),500)
    },[])
    return (
        <>
            <ModalWrap animate={{opacity:1}} exit={{opacity:0}} onClick={()=>navigate(-1)}>
            <RowItemClick
            variants={rowItemInfoClickVars}
            animate="click"
            layoutId={`${state}-${movieId}`}
            exit="exit"
            // 이벤트 버블링 방지. Wrap바깥부분을 클릭해야지 빠져나옴
            onClick={(e)=>{e.stopPropagation()}}
            >
                <Exit onClick={()=>navigate(-1)}>X</Exit>
            <AnimatePresence>
                <Container bgphoto={makeImgUrl(movieDetail?.backdrop_path||"",'w1280')}>
                    {
                        movieId ?
                        loading?
                        <>
                        <Title initial={{y:-100,opacity:0}} animate={{y:0,opacity:1}} transition={{type:"tween",duration:1}}>
                        <h1>{movieDetail?.name}</h1>
                        <h4>{`${movieDetail?.original_name}`}</h4>
                    </Title>
                    <TextContent initial={{y:-100,opacity:0}} animate={{y:0,opacity:1}} transition={{type:"tween",duration:1,delay:0.6}}>
                        <InfoWrap>
                            <ContentInfoWrap>
                                <Creator>
                                    {
                                        movieDetail?.production_companies.map((item,index) => (
                                            item.logo_path !== null && <div key={`logo-${index}`}><img src={makeImgUrl(item.logo_path)}/></div>
                                        ))
                                    }
                                </Creator>
                                <ContentInfo>
                                    <div>{movieDetail?.first_air_date.split('-')[0]}</div>
                                    {movieDetail?.adult ? <div style={{border:'1px solid red'}}>{"청불"}</div> : null}
                                    {movieDetail?.genres.map((item,index) => <div key={`genres-${index}`}>{item.name}</div>)}
                                    <div>{`★${movieDetail?.vote_average}`}<span>{`(${movieDetail?.vote_count})`}</span></div>
                                </ContentInfo>
                            </ContentInfoWrap>
                            <OverView>{movieDetail?.overview}</OverView>
                        </InfoWrap>
                        {
                            movieDetail?.videos.results.length !== 0 ?
                            <ContentVideo initial={{opacity:0,y:100}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:1,type:"tween"}}>
                                <iframe 
                                src={makeVideoUrl(platForm,videoKey)}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                ></iframe>
                            </ContentVideo>
                            :
                            <SimilerContent>
                                <ImgSliderTv movie={{state:'similer',movieId}} content={getContent} title={'비슷한 컨텐츠'}/>
                            </SimilerContent>
                        }
                    </TextContent>
                    </>
                    :<LoadingBox>
                        <ReactLoading type={'spin'} color={'gray'} width={'30%'} height={'30%'}/>
                    </LoadingBox>
                    :null
                    }
                </Container>
            </AnimatePresence>
            </RowItemClick>
        </ModalWrap>
        </>
    );
};

export default TvModal;

/*
                {movieDetail?.production_companies.map((item,index) => 
                <span>
                    <img key={`${movieDetail?.title}-logo${index}`} src={makeImgUrl(item.logo_path)} />
                </span>)}
*/