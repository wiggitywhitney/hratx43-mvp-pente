import React from 'react';
import Square from './Square.jsx';

const Board = (props) => {
  const board = props.grid.map((row, x) => {
    return (
      <tr key={"row_" + x}>
        {row.map((col, y) => {
          const squareLook = props.grid[x][y] === '0' ? 'empty' : props.grid[x][y] === 'red' ? 'red':'gold';

          return (
            <Square handleClick={() => props.handleClick(x,y)} squareLook={squareLook} key={x + ' ' + y} />
          )
        })}
      </tr>
    )
  })

  return (
  <div className="board">
    <table cellSpacing="0" id="table">
      <tbody>
        {board}
      </tbody>
    </table>
  </div>
  )
}

export default Board;