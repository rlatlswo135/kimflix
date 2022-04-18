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
      <Route path="/tv" element={<Tv />} />
      <Route path="/search" element={<Search />} />
    </Routes>
    </>
  );
}

export default App;
