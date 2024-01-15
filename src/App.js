
import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick, winnerCells}){
  let cls = 'square';
  if(winnerCells && winnerCells.includes(value)){
    cls = 'highlighted';
  }
  return <button className={cls} onClick={onSquareClick}>{value}</button>;
}

function MakeGrid({square, onClick, winnerCells}){
  let grid = []
  for(let i=0;i<3;i++){
    let row = []
      for(let j=0;j<3;j++){
        row.push(<Square value={square[i*3+j]} onSquareClick={() => onClick(i*3+j)} 
        winnerCells={winnerCells}></Square>)
    }
    grid.push(<div className='board-row'>{row}</div>)
  }
  return (
    <div>{grid}</div>
  );
}

function Board({xIsNext, squares, onPlay, currentmove, winner}){
  function handleClick(i){
    if (squares[i] || decideWinner(squares))
      return;

    const nextSquares = squares.slice();
    if (xIsNext)
      nextSquares[i] = 'X';
    else
      nextSquares[i] = 'O';
    onPlay(nextSquares);
  }

  let status;
  if(winner){
    status = winner[0] + " wins";
  }
  else if(!squares.includes(null)){
    status = "Game Draw";
  }
  else{
    status = (xIsNext ? "X" : "O") + "'s turn";
  }

  return (
    <div className='board'>
      <div className='status'>
        <div>{status}</div>
        <div>You are at move #{currentmove}</div>
      </div>
      <MakeGrid square={squares} onClick={handleClick} winnerCells={winner}></MakeGrid>
    </div>
  );
}

function decideWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i=0; i<lines.length;i++){
    const[a,b,c] = lines[i];
    if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
      return [squares[a], a, b, c];
    }
  }
  return null;
}

function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentmove, setCurrentMove] = useState(0);
  const xIsNext = currentmove % 2 === 0;
  const currentSquares = history[currentmove];
  const winnerCells = decideWinner(currentSquares)
  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentmove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move>0){
      description = "Go to move #" + move;
    }
    else{
      description = "Go to Start";
    }
    return (
      <li key={move}>
        <button className='historyButton' onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentmove={currentmove}
        winner={winnerCells}></Board>
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>TIC TAC TOE</h1>
      <Game></Game>
    </div>
  );
}

export default App;
