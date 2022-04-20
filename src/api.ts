const API_KEY = "63a1eea84b460423d5a4822139eb4def"

//애초에 getMovie할때 lang을 KR로 해서 한국 포스터가받아와지네 => 포스타,백드롭은 다른거
function makeUrl(content:string,category:string,lang:string){
    const BASE_URL = `https://api.themoviedb.org/3/<<content>>/<<category>>?api_key=${API_KEY}&language=<<lang>>&page=1`
    return BASE_URL.replace('<<content>>',content).replace('<<category>>',category).replace('<<lang>>',lang)
}

export interface IMovies {
        adult: boolean;
        backdrop_path: string;
        genre_ids: number[];
        id: number;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string;
        release_date: string;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
}
export interface IGetMovies {
        dates: {
            maximum: string;
            minimum: string;
        }
        page: number;
        results:IMovies[];
        total_pages: number;
        total_results: number;
}

// optional params. 좋은것같다.
export function makeImgUrl(imgId:string,size?:string){
    const IMAGE_URL = `https://image.tmdb.org/t/p/<<size>>/<<imgId>>`
    return IMAGE_URL.replace('<<imgId>>',imgId).replace('<<size>>',size?size:'original')
}
export function makeVideoUrl(platform:string,key:string){
    if(key.length === 0 && platform.length === 0) return;
    const VIDEO_URL = platform==='YouTube' ? `https://www.youtube.com/embed/<<key>>`:`https://vimeo.com/<<key>>`
    return VIDEO_URL.replace('<<key>>',key)
}
export async function getMovies(state:string){
    const url = makeUrl('movie',state,'ko-KR')
    return await(await fetch(url)).json()
}

export async function getMovieDetail(movieId:number){
    const GET_MOVIE_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos&language=ko-KR`
    return await(await fetch(GET_MOVIE_URL)).json()
}


export async function getSimilarMovie(movieId:number){
    const GET_MOVIE_URL = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=ko-KR&page=1`
    return await(await fetch(GET_MOVIE_URL)).json()
}


/*
youtube : https://www.youtube.com/watch?v=<<key>>
Vimeo: https://vimeo.com/<<key>>

이리로 하면 비디오 + 영화정보까지 나옴
https://api.themoviedb.org/3/movie/<<movie_id>>?api_key=<<api_key>>&append_to_response=videos&language=ko-KR
*/