import React,{useEffect, useState} from 'react';
import styled from 'styled-components'
import {Link,useLocation,useNavigate} from 'react-router-dom'
import {motion,useAnimation,useViewportScroll,useMotionValue, useTransform} from 'framer-motion'
import {useForm} from 'react-hook-form'
import {useMatch} from 'react-router-dom'
import {Helmet} from 'react-helmet'

interface IForm{
    keyword:string
}
const Header = styled(motion.nav)`
    display:flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    color:white;
    width:100%;
    top:0;
    height:4.5%;
    font-size:1.1em;
    z-index:1000;
    @media screen and (max-width:1680px){
        padding:0.5% 0%;
        font-size:0.9em;
    }
`
const Col = styled.div`
    display:flex;
    align-items: center;
    width:100%;
    height:100%;

`
const Logo = styled(motion.svg)`
    margin-right: 50px;
    width:100px;
    height:100px;
    fill:rgba(255,5,46,0.9);
    margin-left:10%;
    &:hover{
        cursor: pointer;
    }
    path{
        stroke: white;
        stroke-width: 0.7;
    }
`
const Items = styled.ul`
    display:flex;
    align-items: center;
    justify-content: space-around;
    width:30%;
`
const Item = styled.li`
    margin-right: 20px;
    position: relative;
    display:flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`
const Input = styled(motion.input)`
/* z-index을 -1을주는바람에 안눌렸다  */
    transform-origin: right center;
    /* 변형의 위치를 지정해줄수있다 scaleX같은 경우에는 중앙부터 좌우로 커지는데 
    변형의 위치를 정해주니 오른쪽 센터부터 늘어난다 . 중요해보임*/
    position:absolute;
    height:50%;
    border-radius: 5px;
    width:400px;
    cursor: pointer;
    border:none;
    font-size:1.2em;
    background-color: transparent;
    text-align: center;
    padding:0.5%;
    color:tomato;
    font-weight: 900;
    /* color:red; */
    /* 패딩을주고 zindex를 주니 돋보기가 안으로 들어왔다 */
    padding-left:6%;
    ::placeholder,
    ::-webkit-input-placeholder{
        color:rgba(255,255,255,0.5);
        font-weight: 900;
    }
    &:focus{
        outline: none;
        border:0.01px solid red;
    }
`
const ErrorMsg = styled(motion.div)`
    position: absolute;
    font-size:1.1em;
    padding:1%;
    color:rgba(255,0,0,0.9);
    left:25%;
    letter-spacing: 0.1em;
    font-weight: 600;
    @media screen and (max-width:1850px){
        left:15%;
    }
    @media screen and (max-width:1680px){
        left:5%;
    }
`
const Circle = styled(motion.div)`
    position: absolute;
    border-radius: 5px;
    bottom:-5px;
    width:100%;
    height:3px;
    left:0;
    right: 0;
    margin:0 auto;
    /* absolute를 가운데 정렬하는 팁 left,right 0 margin 0 auto */
    background-color: ${props => props.theme.red};
`
const SearchIcon = styled(motion.svg)<{open:boolean}>`
    width:17px;
    height:17px;
    fill:'rgba(0,0,0,0.5)';
    cursor: pointer;
    margin-right: ${props => props.open ? '140px' : null};
    z-index:100;
`
const Search = styled(motion.form)`
    display:flex;
    align-items: center;
    position: relative;
    width:100%;
    margin-right: 5%;
    height:100%;
    justify-content: flex-end;
    overflow: hidden;
    @media screen and (max-width:1680px){
        margin-right: 5%;
    }
`
const logoVars = {
    normal:{
        fillOpacity:1
    },
    active:{
        fillOpacity:0,
        transition:{
            repeat: Infinity,
            duration:0.5
        }
    }
}
const inputVars = { 
    close:{
        scaleX:0
    },
    open:{
        scaleX:1,
        transition:{
            duration:0.5,
            type:"linear"
            // linear => 일정한속도
        }
    }
}
const navVars ={
    start:{
        backgroundColor:'rgba(0,0,0,0)'
    },
    scroll:{
        backgroundColor:'rgba(0,0,0,1)'
    }
}
const Nav = () => {
    const navigate = useNavigate()
    const homeMatch = useLocation().pathname === '/movie'
    const tvMatch = useLocation().pathname === '/tv'
    const navAnimation = useAnimation()
    const bg = useMotionValue(0)
    // 해당 컴포넌트의 프롭스가 아니라 다른곳에서 실행 가능하게 해준다
    const {register,handleSubmit,formState:{errors},setError} = useForm<IForm>()
    const {scrollY} = useViewportScroll()
    const [searchOpen,setSearchOpen] = useState(false)
    function toggleSearch(){
        setSearchOpen(prev => !prev)
        setError('keyword',{message:''})
    }
    const isTv = useMatch('/tv')
    const success = (data:IForm) => {
        setSearchOpen(false)
        navigate(`/search?keyword=${data.keyword}&content=${isTv ? 'tv' : 'movie'}`)
    }
    useEffect(()=>{
        /*
        useAnimation Hook의 start,end를 이용해 애니메이션을 연결시킨 엘리먼트의 원하는 애니메이션을 실행해줄수있다.
        => 상황별 분기가 가능할거고. 해당 컴포넌트가 아닌 외부에서 애니메이션을 실행시킬수 있는 장점
        => variants와 묶어서도 연계가능하다. 왜 animate가 variant에 묶여있으니까
        */
        scrollY.onChange(()=>{
            if(scrollY.get() > 30){
                navAnimation.start('scroll')
            }else{
                navAnimation.start('start')
            }
        })
    },[])
    return (
        <Header variants={navVars} initial='start' animate={navAnimation}>
            <Helmet>
                <title>KimFlix | Tv</title>
            </Helmet>
            <Col>
            <Logo
            viewBox='0 0 111 30'
            variants={logoVars}
            initial={'normal'}
            whileHover={'active'}
            onClick={()=>navigate('/')}
            >
                <motion.path
                d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z">
                </motion.path>
            </Logo>
            <Items>
                <Link to="/movie">
                    <Item>MOVIE{homeMatch && <Circle layoutId='circle'/>} </Item> 
                </Link>
                <Link to="/tv">
                    <Item>TV Shows{tvMatch && <Circle layoutId='circle'/>}</Item>
                </Link>
            </Items>
            </Col>
            <Col>
            <Search onSubmit={handleSubmit(success)}>
                <ErrorMsg>{errors?.keyword?.message}</ErrorMsg>
                <SearchIcon
                // -285
                open={searchOpen}
                viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                initial={{x:285}}
                animate={{x:searchOpen? -285 : 0}} transition={{duration:0.5,type:"linear"}}
                onClick={toggleSearch}>
                <motion.path
                    d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8
                    87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6
                    91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7
                    119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3
                    443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42
                    128-128 128S79.1 278.6 79.1 208z"/>
                </SearchIcon>
                {searchOpen ? 
                <Input 
                {...register("keyword",{required:"1글자 이상 입력해주세요."})}
                variants={inputVars}
                initial="close"
                animate="open"
                type="text"
                placeholder={'Search for Content or person'}/> : null}
            </Search>
            </Col>
        </Header>
    );
};
export default Nav;


