import React from 'react';

const PairSquare= (props) => {
  return (
  <td className={props.squareLook} id={props.squareLook} onClick={props.handleClick}>
    <div className="pairSquare">
    </div>
  </td>
  )
}

export default PairSquare;