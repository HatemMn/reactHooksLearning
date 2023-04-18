// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageSyncedValue} from './02'

const BOARD_KEY = 'board'
const HISTORY_KEY = 'history'
const DEFAULT = Array(9).fill(null)

function countPlayedMoves(historySquares) {
  return historySquares.filter(x => x !== null).length
}

function Board(props) {
  const {squares, setSquares, historySquares, setHistorySquares} = props
  const playedMoves = countPlayedMoves(historySquares)

  function selectSquare(square) {
    // TODO : ajouter le cas du retour au passé qui suppr l'historique
    const ind = square
    if (
      squares[ind] === 'X' ||
      squares[ind] === 'O' ||
      calculateWinner(squares) != null
    ) {
      return
    }

    let cop = [...squares]
    let hist_cop = [...historySquares]

    cop[ind] = calculateNextValue(squares)
    hist_cop[ind] = playedMoves + 1

    setSquares(cop)
    setHistorySquares(hist_cop)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setHistorySquares(Array(9).fill(null))
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Status(props) {
  const {squares, setSquares, historySquares, setHistorySquares} = props
  let {inThePast} = props

  function currentGameState() {
    if (squares.filter(x => x === null).length === 0)
      return `Scratch: Cat's game`
    const win = calculateWinner(squares)
    return win === null
      ? `Next player :${calculateNextValue(squares)}`
      : `Winner : ${win}`
  }

  const movesPlayed = countPlayedMoves(historySquares)

  function isCurrentStatusText(step) {
    return step === countPlayedMoves(squares) ? ' (current)' : '' // a modifier
  }

  function selectHistorySituation(situation) {
    /*     if (!inThePast && situation === countPlayedMoves(historySquares)) {
      throw Error(
        'This is not supposed to happen, an user played with the disable property',
      )
    } */

    inThePast = situation === countPlayedMoves(historySquares) ? false : true
    // go back to the main situation i.e. draw again the squares
    let cop = [...squares]

    console.log('situation', situation, historySquares)
    for (let i = 0; i < cop.length; i++) {
      if (historySquares[i] < situation || historySquares[i] !== null) {
        cop[i] = null
      } else {
        cop[i] = calculateNextValue(cop)
      }
    }

    setSquares(cop)
  }

  return (
    <div>
      <div className="status">{currentGameState()}</div>
      <ol>
        {Array.from({length: movesPlayed + 1}, (_, step) => (
          <li key={step}>
            <button
              disabled={isCurrentStatusText(step)}
              onClick={() => selectHistorySituation(step)}
            >
              Go to {step === 0 ? 'game start' : 'move #' + step}{' '}
              {isCurrentStatusText(step)}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Game() {
  const [squares, setSquares] = useLocalStorageSyncedValue(BOARD_KEY, DEFAULT)
  const [historySquares, setHistorySquares] = useLocalStorageSyncedValue(
    HISTORY_KEY,
    DEFAULT,
  )
  let inThePast = !(
    countPlayedMoves(historySquares) === countPlayedMoves(squares)
  )

  return (
    <div className="game">
      <div className="game-board">
        <Board
          inThePast={inThePast}
          squares={squares}
          setSquares={setSquares}
          historySquares={historySquares}
          setHistorySquares={setHistorySquares}
        />
      </div>
      <div className="game-info">
        <Status
          inThePast={inThePast}
          squares={squares}
          setSquares={setSquares}
          historySquares={historySquares}
          setHistorySquares={setHistorySquares}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
