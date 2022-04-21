import React from 'react';
import {useLocation} from 'react-router-dom'

const Search = () => {
    const location = useLocation()
    const keyword = new URLSearchParams(location.search).get('keyword')
    /*
    JavaScript에 내장되어있는 URLSearchParams. => query문을 깡그리 긁어와서 .get('key')해주면 해당 값을 뱉어준다. 엄청유용할듯
    */
    console.log(keyword)
    return (
        <div>
            Search
        </div>
    );
};

export default Search;