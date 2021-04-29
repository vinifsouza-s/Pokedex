import React, {useState, useEffect} from 'react';
import NavBar from './components/Navbar';
import Card from './components/Card';
import './App.css'
import { getAllpokemon, getPokemon } from './services/pokemon';


function App(){
  const [pokemonData, setPokemonData] = useState( [] );
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const initialUrl = 'https://pokeapi.co/api/v2/pokemon/'

  useEffect(() =>{
    async function fetchData() {
      let response = await getAllpokemon(initialUrl);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadingPokemon(response.results);
      setLoading(false);
    }
    fetchData();

  }, [])

  const next = async () => {
    setLoading(true);
    let data = await getAllpokemon(nextUrl);
    await loadingPokemon(data.results)
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if(!prevUrl) return;
    setLoading(true);
    let data = await getAllpokemon(prevUrl);
    await loadingPokemon(data.results)
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon.url);
      return pokemonRecord
    }))

    setPokemonData(_pokemonData)
  }

  return ( 
    <>
    <NavBar />
  <div> 
    {loading ? <h1 style={{ textAlign: 'center' }}>Loading...</h1> : ( 
      <>
      <div className="btn">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
      <div className="grid-container">
      {pokemonData.map((pokemon, i) =>{
        return <Card key={i} pokemon={pokemon} />
      })}
      </div>
      <div className="btn">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
    </>
    )} 
  </div>
  </>
  );
}

export default App;
