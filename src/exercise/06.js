// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [status, setStatus] = React.useState('idle')
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (pokemonName.length === 0) return
    //setPokemon(null) /// to enable the loading
    setStatus('loading')

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
        setStatus('success')
      })
      .catch(e => {
        setError(e)
        setStatus('failure')
      })
  }, [pokemonName])

  if (status === 'idle') {
    return <div className="totally-centered">'Submit a pokemon'</div>
  } else if (status === 'loading') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'success') {
    return <PokemonDataView pokemon={pokemon} />
  } else if (status === 'failure') {
    return (
      <div role="alert">
        There was an error:{' uuuuuuuuuuu'}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        <img
          src="https://sportshub.cbsistatic.com/i/2021/03/17/51a83182-1c70-4762-af32-73234d1a4c8b/pikachu-pokemon-1161138.jpg"
          alt="Sad Pikachu"
        />
      </div>
    )
  }

  throw error('This is not supposed to happen')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
