import React from 'react';

const Square= (props) => {
  return (
  <td className={props.squareLook} id={props.squareLook} onClick={props.handleClick}>
    <div className="square">
    </div>
  </td>
  )
}

export default Square;