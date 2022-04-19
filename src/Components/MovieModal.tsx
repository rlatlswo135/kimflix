import React from 'react';
import styled from 'styled-components'
import { motion } from 'framer-motion';
import {useQuery} from 'react-query'
import { getMovieDetail } from '../api';
import {makeImgUrl,makeVideoUrl} from '../api'
import {useParams} from 'react-router-dom'
interface Genre {
        id: number;
        name: string;
    }
interface ProductionCompany {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }

interface Result {
        name: string;
        key: string;
        site: string;
        size: number;
        type: string;
        official: boolean;
        id: string;
    }

interface Videos {
    results: Result[];
}

interface IMovieDetail {
        adult: boolean;
        backdrop_path: string;
        genres: Genre[];
        id: number;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string;
        production_companies: ProductionCompany[];
        release_date: string;
        runtime: number;
        status: string;
        tagline: string;
        title?: string;
        vote_average: number;
        vote_count: number;
        videos: Videos;
    }

interface Iprops {
    movieId:number
}

const Container = styled.div<{bgPhoto:string}>`
    height:100%;
    padding:5% 5%;
    padding-bottom: 0%;
    background-image: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.9)),url(${props => props.bgPhoto});
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
    `

const ContentInfo = styled.div`
    display:flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 5%;
    padding-top:1%;
    padding-left:1%;
    div{
        font-size:1.4em;
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
`
const ContentVideo = styled(motion.div)`
    overflow: hidden;
    position: relative;
    iframe{
        width:100%;
        height:100%;
    }
`
const MovieModal = (props:Iprops) => {
    const movieId = useParams().id || props.movieId
    const {isLoading,data:movieDetail} = useQuery<IMovieDetail>(['movieDetail',movieId],()=>getMovieDetail(Number(movieId)))
    const {site:platForm,key:videoKey} = movieDetail?.videos?.results.length ? movieDetail?.videos.results[0] : {site:"",key:""}
    console.log(movieDetail)
    return (
        <Container bgPhoto={makeImgUrl(movieDetail?.backdrop_path||"",'w1280')}>
            <Title initial={{y:-100,opacity:0}} animate={{y:0,opacity:1}} transition={{type:"tween",duration:1}}>
                <h1>{movieDetail?.title}</h1>
                <h4>{`${movieDetail?.original_title}`}</h4>
            </Title>
            <TextContent initial={{y:-100,opacity:0}} animate={{y:0,opacity:1}} transition={{type:"tween",duration:1,delay:0.6}}>
                <InfoWrap>
                    <ContentInfo>
                        <div>{movieDetail?.release_date.split('-')[0]}</div>
                        {movieDetail?.adult ? <div style={{border:'1px solid red'}}>{"청불"}</div> : null}
                        {movieDetail?.genres.map((item,index) => <div key={`modal${index}`}>{item.name}</div>)}
                        <div>{`★${movieDetail?.vote_average}`}<span>{`(${movieDetail?.vote_count})`}</span></div>
                    </ContentInfo>
                    <OverView>{movieDetail?.overview}</OverView>
                </InfoWrap>
                <ContentVideo initial={{opacity:0,y:100}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:1,type:"tween"}}>
                    <iframe 
                    src={makeVideoUrl(platForm,videoKey)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </ContentVideo>
            </TextContent>
            {/* 괄호열고 영문이름 해야할듯 */}
        </Container>
    );
};

export default MovieModal;