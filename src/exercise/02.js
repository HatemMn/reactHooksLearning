// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

export function serialiseMyValue(key, data) {
  if (
    typeof data !== 'string' &&
    typeof data !== 'number' &&
    typeof data !== 'boolean' &&
    typeof data !== 'object' &&
    !Array.isArray(data)
  ) {
    throw new Error('Data must be a valid JSON value')
  }
  try {
    return window.localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    throw new Error(`Error serializing data: ${error.message}`)
  }
}

export function desializeMyValue(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    throw new Error(`Error deserializing data: ${error.message}`)
  }
}

export const useLocalStorageSyncedValue = (key, defaultValue = '') => {
  const [value, setValue] = React.useState(
    () => desializeMyValue(key) ?? defaultValue,
  )
  React.useEffect(() => {
    serialiseMyValue(key, value)
  }, [key, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageSyncedValue('name', '')

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
