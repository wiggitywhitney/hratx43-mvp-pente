import React from 'react';
import PairSquare from './PairSquare.jsx';

const Pairs = (props) => {
  console.log(props)
  const redChart = props.redPairs.map((row, x) => {
    return (
      <tr key={"row_" + x}>
        {row.map((col, y) => {
          const squareLook = props.redPairs[x][y] === '0' ? 'empty' : props.redPairs[x][y] === 'red' ? 'red':'gold';

          return (
            <PairSquare squareLook={squareLook} key={x + ' ' + y} />
          )
        })}
      </tr>
    )
  })

  const goldChart = props.goldPairs.map((row, x) => {
    return (
      <tr key={"row_" + x}>
        {row.map((col, y) => {
          const squareLook = props.goldPairs[x][y] === '0' ? 'empty' : props.goldPairs[x][y] === 'red' ? 'red':'gold';

          return (
            <PairSquare squareLook={squareLook} key={x + ' ' + y} />
          )
        })}
      </tr>
    )
  })

  return (
  <span className="pairsTables">
  <span className="redPairs">
    <table cellSpacing="0" className="pairsTable">
      <caption className="text">Red Pairs Captured</caption>
      <tbody>
        {redChart}
      </tbody>
    </table>
  </span>
  <span className="goldPairs">
    <table cellSpacing="0" className="pairsTable">
      <caption className="text">Gold Pairs Captured</caption>
      <tbody>
        {goldChart}
      </tbody>
    </table>
  </span>
  </span>
  )
}

export default Pairs;