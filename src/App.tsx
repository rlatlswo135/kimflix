import React from 'react';
import './App.css';
import {Routes,Route} from 'react-router-dom'
import Home from './Pages/Home';
import Tv from './Pages/Tv';
import Search from './Pages/Search';
import Nav from './Components/Nav';

function App() {
  return (
    <>
    <Nav />
    <Routes>
      {/* home, tvshow, search */}
      <Route path="/" element={<Home />} />
      <Route path="movie" element={<Home />} />
      {/* /와 /movie에 home컴포넌트를 띄우고싶다 => v5 = ['/','/movie'] path를 이렇게 했지만 v6은 이런식으로*/}
      <Route path="/tv" element={<Tv />} />
      <Route path="/search" element={<Search />} />
    </Routes>
    </>
  );
}

export default App;
