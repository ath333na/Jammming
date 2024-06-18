import './App.css'
import { useState, useEffect } from 'react'
import {PlaylistSong, SearchResult, Spinner} from './Songs_Component'
import ErrorBoundary from './Error_Component'
import placeholderCarousel from './PlaceholderCarousel'

function App() {
  //Setting up authorization request
  const clientId = "006e5671959446b89529c7ad4e1e095c"
  const redirect_uri = 'http://localhost:5173/'
  const auth_endpoint = 'https://accounts.spotify.com/authorize'
  const response_type = 'token'

  //Setting up token, user, etc
  const [token, setToken] = useState('')
  const [user, setUser] = useState('')
  const [playlistSongs, setPlaylistSongs] = useState([])
  const [term, setTerm] = useState('')
  const [searchresults, setSearchresults] = useState([])
  const [playlistName, setPlaylistName] = useState('My New Playlist')
  const [success, setSuccess] = useState(false)
  const [highlight, setHighlight] = useState('ABBA')

  //Setting the token item at login
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1]

      window.location.hash = ''
      window.localStorage.setItem('token', token) 
    }
    setToken(token)
  }, [user])

  if(token && !user) {
    fetchProfile()
  }


  //Logout
  function logOut(){
    setToken('')
    window.localStorage.removeItem('token')

  }

  //Fetching the profile
  async function fetchProfile() {
    const profileUrl = `https://api.spotify.com/v1/me`
    const parameters = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    let response = await fetch(profileUrl, parameters)
    const user = await response.json()
    setUser(user)
  }  

  //Creating a search function
  async function Search(term) {  
    const search_endpoint = `https://api.spotify.com/v1/search?`
    const search_query = `q=${term.replace(' ', '+')}&type=album%2Ctrack%2Cartist&limit=5`
    const search_parameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  
    let response = await fetch(`${search_endpoint}${search_query}`, search_parameters)
    const searchresponse = await response.json()
    return searchresponse
  }

  //Handling the search
  const handleChange = async (e) => {
    setTerm(e.target.value);
    e.preventDefault();
    
    if (term) {
      const results = await Search(term);
      console.log(results)
      const searchresults = results.tracks.items.map((item) => ({
        image: item.album.images[1].url,
        title: item.name,
        artist: item.artists[0].name,
        uri: item.uri,
        id: item.id
      }));
      setSearchresults(searchresults)
    }
  }

  //Adding songs to playlist
  const handleAdd = (index) => {
    let songToAdd = searchresults[index]
    setPlaylistSongs([...playlistSongs, songToAdd])

    console.log(`Added ${songToAdd.title} to playlist!`)
  }

  //Removing songs from playlist
  const handleRemove = (id) => {
    setPlaylistSongs(playlistSongs.filter(a => a.id !== id))
  }

  //Creating and saving new playlist
  async function createPlaylist() {
    try {
    const playlist_endpoint = `https://api.spotify.com/v1/users/${user.id}/playlists`
    const playlist_parameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        'name': playlistName
      })
    }

    let playlist_response = await fetch(playlist_endpoint, playlist_parameters)
    let newPlaylist = await playlist_response.json()
    return newPlaylist.id
    }
    catch (error) {
      console.log(error)
    }
  }
  
  //Creating a 'Suggestion Carousel' 
  useEffect(() => {
    if (!term) {
    const interval = setInterval(() => 
      placeholderCarousel(), 5000);

    return () => clearInterval(interval);

    }
    return () => {}
  }, [term]);

  async function savePlaylist() {
    try {
    let playlist_id = await createPlaylist()
    
    let allUris = playlistSongs.map(item => item.uri)
    const save_endpoint = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
    const save_parameters= {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uris: allUris})
    }

    let save_response = await fetch(save_endpoint, save_parameters)
    let result = await save_response.json()
    console.log(result)
    
    if (result.snapshot_id) {
      setSuccess(true)
      window.localStorage.removeItem('playlist_id')
      setPlaylistSongs([])
      setPlaylistName('My New Playlist')
      setTimeout(() => setSuccess(false), 5000)
    }
    }
    catch (error) {
      console.log(error)
    }
  }

  
  function placeholderCarousel() {
    const artistArray = ['ABBA', 'Taylor Swift', 'In flames', 'Megan Thee Stallion', 'Solange', 
                        'Kendrick Lamar','Sabaton', 'Crystal Castles', 'Rammstein', 'Robin Sparkles', 'Robyn',
                        'Your favorite artist']
    
    let newHighlight = artistArray[Math.floor(Math.random() * artistArray.length)]
    console.log(newHighlight)
    setHighlight(newHighlight)
  }




  return (
    <>
      {!token ?
      <a href={`${auth_endpoint}?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=playlist-modify-private%20playlist-modify-public`}>
      Login with Spotify</a>
      :
      <div className='MainContent'>
        <>
          <h2>{`Welcome ${user.display_name}!`}</h2>
          <button id="logout" onClick={logOut}>Logout</button>
        </>
        <div className='SearchContainer'>
          <h1 className='Slogan'>I am <span>Jammming</span> to</h1>
            <input
            id='searchbar'
            type='text'
            placeholder={highlight}
            onChange={handleChange}
            value={term}
            autoComplete='off'
            spellCheck='false'
            autoFocus/>
          </div>


          <div className='Content'>

          <div className='SearchResults'>
            {searchresults.map((item, index) => (
              <SearchResult image={item.image} title={item.title} artist={item.artist} 
              key={item.uri} id={item.id} index={index} handleAdd={handleAdd} />
            ))}
          </div>

          <div className="PlaylistContainer">

          {playlistSongs.length >= 1 &&
          <ErrorBoundary>
            <div className='newPlaylist'>
              <div>
              <input id='PlaylistName' 
              type='text' 
              value={playlistName} 
              onChange={(e) => {setPlaylistName(e.target.value)}}
              placeholder='My New Playlist'
              maxLength='100'
              spellCheck='false'
              autoComplete='off'/>
            
              {playlistSongs.map((item) => (
                
                <PlaylistSong title={item.title} artist={item.artist} 
                              key={item.uri} id={item.id} handleRemove={handleRemove} />

              ))}
              </div>
              <button className='SavePlaylist'
                      onClick={() => {savePlaylist()}} >
                <svg width='20px' height='20px'>
                  <image width='20px' height='20px' href='../Resources/Save_Icon.svg'/>
                </svg>
              </button>
            </div>
          </ErrorBoundary>
          }   
          
          {success && playlistSongs.length < 1 &&
            <h3 className='SaveResult'>Your playlist was saved! 😎 </h3>
          }
          </div>
          </div>
          </div>}
      </>
    )
}

export default App
