import React from "react";

export function PlaylistSong({ uri, title, artist, id, handleRemove }) {
  return (
            <div className='playlistSong' key={uri}>
              
            <div className="titles">
              <p>{title}</p>
              <p>{artist}</p>
            </div>
              
              <button onClick={() => handleRemove(id)} className="RemoveSong">
              <svg width='15px' height='20px'>
                  <image width='15' height='20px' href='../Resources/Remove_Icon.svg'/>
                </svg>
              </button>
            </div>        
    )
}

export function SearchResult({ image, title, artist, id, index, handleAdd }){
  return(
    <div className='Result' key={id}>
      <img src={image}
      alt={title}/>

      <div className='titles'>
        <p>{title}</p>
        <p>{artist}</p>
      </div>

      <button 
        onClick={() => {handleAdd(index)}} className='Add'>
        <svg width='15px' height='15px'>
          <image width='15px' height='15px' href='../Resources/Add_Icon.svg'/>
        </svg>
      </button>

  </div>
  )
}

export function Spinner() {
  return (
    <div className="Spinner"></div>
  )
}

export function SaveResult(){
  {success ? <h3>Your new playlist was created 😎 </h3>
    : <h3>Sorry, something went wrong❗ </h3>
  }
}