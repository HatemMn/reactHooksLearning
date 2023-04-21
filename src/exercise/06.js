// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {PokemonForm} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'
//;('use client')

// eslint-disable-next-line no-unused-vars
class ErrorBoundaryHatem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true}
  }

  componentDidCatch(error, info) {
    console.log(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return ErrorCryingPikachu(this.state.hasError)
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (pokemonName.length === 0) return
    setState({status: 'loading', pokemon: null})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: 'success', pokemon: pokemonData})
      })
      .catch(e => {
        setState({status: 'failure', error: e})
      })
  }, [pokemonName])

  if (state.status === 'idle') {
    return <div className="totally-centered">'Submit a pokemon'</div>
  } else if (state.status === 'loading') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (state.status === 'success') {
    return <PokemonDataView pokemon={state.pokemon} />
  } else if (state.status === 'failure') {
    throw new Error('kgcdfddjhfgdjhfgdjhfgjdfjhdgfjh')
  }

  throw new Error('This should be impossible')
}

function ErrorCryingPikachu(errText, onClickCallback) {
  return (
    <div role="alert" className="center">
      There was an error:{' uuuuuuuuuuu'}
      <pre style={{whiteSpace: 'normal'}}>{'errText'}</pre>
      <img
        src="https://sportshub.cbsistatic.com/i/2021/03/17/51a83182-1c70-4762-af32-73234d1a4c8b/pikachu-pokemon-1161138.jpg"
        alt="Sad Pikachu"
      />
      <button onClick={onClickCallback}>Try Again</button>
    </div>
  )
}

function fallbackRender({error, resetErrorBoundary, setPokemonName}) {
  function handleReset() {
    setPokemonName('')
    resetErrorBoundary()
  }

  return ErrorCryingPikachu(error, handleReset)
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
        <ErrorBoundary
          key={pokemonName}
          resetKeys={pokemonName}
          fallbackRender={'lol'}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
/* 

function fallbackRender({error, resetErrorBoundary}) {
  const [pokemonName, setPokemonName] = React.useState('')
  
  function handleReset() {
    setPokemonName('')
    resetErrorBoundary()
  }

  return ErrorCryingPikachu(error, handleReset)
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
        <ErrorBoundary
          key={pokemonName}
          resetKeys={pokemonName}
          fallbackRender={fallbackRender({error, resetErrorBoundary}, setPokemonName)}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
 */
export default App
