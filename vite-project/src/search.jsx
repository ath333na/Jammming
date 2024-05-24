import searchFunction from "./searchFunction";
import React, { useState } from 'react';


function Search() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [combinedData, setCombinedData] = useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    
  };

  const handleSubmit = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const data = await searchFunction(search, filter);
      const combinedData = data.tracks.items.map((item) => ({
        image: item.album.images[0].url,
        result: item.name,
        artist: item.artists[0].name,
      }));
      setCombinedData(combinedData);
    }
  };

  //Create toggle function
  // sets which filter
  function toggle(filter) {
    setFilter(filter)
  }


  return (
    <>
      <h2>Search Results</h2>
      <input
        id="searchbar"
        type="text"
        placeholder="Search"
        onChange={handleChange}
        onKeyDown={handleSubmit}
        value={search}
      />
      <div id="filterby">
        <button >Artists</button>
        <button >Albums</button>
        <button >Songs</button>
      </div>
      <div id="SearchResults">
        {combinedData.map((item, index) => (
          <div className="Result" key={index}>
            <img src={item.image} alt={item.result} />
            <h5>{item.result}</h5>
            <h5>{item.artist}</h5>
            <button>+</button>
          </div>
        ))}
      </div>
    </>
  );
}


export default Search;