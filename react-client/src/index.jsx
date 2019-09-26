import React from 'react';
import ReactDOM from 'react-dom';
//import 'typeface-roboto';
import $ from 'jquery';
import Board from './components/Board.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: Array(13).fill().map(x => Array(13).fill("0")),
      redIsNext: true
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  // componentDidMount() {
  //   $.ajax({
  //     url: '/items',
  //     success: (data) => {
  //       this.setState({
  //         items: data
  //       })
  //     },
  //     error: (err) => {
  //       console.log('err', err);
  //     }
  //   });
  // }

  handleReset() {
    let newGrid = Array(13).fill().map(x => Array(13).fill('0'));
    this.setState({
      grid: newGrid,
    })
  }

  handleClick(x, y) {
    if (this.state.grid[x][y] === '0') {
      if (this.state.redIsNext === true) {
        this.state.grid[x][y] = 'red';
        this.setState({
          grid: this.state.grid,
          redIsNext: false,
          redCapturedPairs: 0,
          goldCapturedPairs: 0,
        })
      } else {
        this.state.grid[x][y] = 'gold';
        this.setState({
          grid: this.state.grid,
          redIsNext: true,
        })
      }
    }
    this.calculateWin(x, y);
    this.capturePair(x, y);
  }

  calculateWin(x,y) {
    this.checkColumns(x,y);
    this.checkRows(x,y);
    this.checkMajorDiagonal(x,y);
    this.checkMinorDiagonal(x,y);
  }

  capturePair(x,y) {
    this.checkColumnForPair(x, y);
    this.checkRowForPair(x, y);
    this.checkMajorDiagonalForPair(x, y);
    this.checkMinorDiagonalForPair(x, y);

    if (this.state.redCapturedPairs === 5) {
      setTimeout(()=>{alert(`red wins!`)}, 1);
      this.handleReset();
    }

    if (this.state.goldCapturedPairs === 5) {
      setTimeout(()=>{alert(`gold wins!`)}, 1);
      this.handleReset();
    }
  }

  checkColumns(x,y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';

    let startingPoint = x - 4;
    const finishingPoint = x + 4;
    let inARow = 0;

    while (startingPoint <= finishingPoint) {
      if (startingPoint >= 0 && finishingPoint <= 12) {
        if (this.state.grid[startingPoint][y] === color) {
          inARow++;
          if (inARow === 5) {
            setTimeout(()=>{alert(`${color} wins!`)}, 1);
            this.handleReset();
          }
        } else {
          inARow = 0;
        }
      }
      startingPoint++;
    }
  }

  checkColumnForPair(x,y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';
    let opponent = (this.state.redIsNext === true) ? 'gold' : 'red';

    if ((this.state.grid[x - 1][y] === opponent) && (this.state.grid[x - 2][y] === opponent) && (this.state.grid[x - 3][y] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x - 1][y] = "0";
      this.state.grid[x - 2][y] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }

    if ((this.state.grid[x + 1][y] === opponent) && (this.state.grid[x + 2][y] === opponent) && (this.state.grid[x + 3][y] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x + 1][y] = "0";
      this.state.grid[x + 2][y] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }
  }

  checkRows(x,y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';

    let startingPoint = y - 4;
    const finishingPoint = y + 4;
    let inARow = 0;

    while (startingPoint <= finishingPoint) {
      if (startingPoint >= 0 && finishingPoint <= 12) {
        if (this.state.grid[x][startingPoint] === color) {
          inARow++;
          if (inARow === 5) {
            setTimeout(()=>{alert(`${color} wins!`)}, 1);
            this.handleReset();
          }
        } else {
          inARow = 0;
        }
      }
      startingPoint++;
    }
  }

  checkRowForPair(x,y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';
    let opponent = (this.state.redIsNext === true) ? 'gold' : 'red';

    if ((this.state.grid[x][y - 1] === opponent) && (this.state.grid[x][y - 2] === opponent) && (this.state.grid[x][y - 3] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x][y - 1] = "0";
      this.state.grid[x][y - 2] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }

    if ((this.state.grid[x][y + 1] === opponent) && (this.state.grid[x][y + 2] === opponent) && (this.state.grid[x][y + 3] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x][y + 1] = "0";
      this.state.grid[x][y + 2] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }
  }

  checkMajorDiagonal(x,y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';

    let startingX = x - 4;
    const finishingX = x + 4;

    let startingY = y - 4;
    const finishingY = y + 4;

    let inARow = 0;

    while (startingX <= finishingX) {
      if (startingX >= 0 && startingX <= 12 && startingY >= 0 && startingY <= 12) {
        if (this.state.grid[startingX][startingY] === color) {
          inARow++;
          if (inARow === 5) {
            setTimeout(()=>{alert(`${color} wins!`)}, 1);
            this.handleReset();
          }
        } else {
          inARow = 0;
        }
      }
      startingX++;
      startingY++;
    }

  }

  checkMajorDiagonalForPair(x, y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';
    let opponent = (this.state.redIsNext === true) ? 'gold' : 'red';

    if ((this.state.grid[x - 1][y - 1] === opponent) && (this.state.grid[x - 2][y - 2] === opponent) && (this.state.grid[x - 3][y - 3] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x - 1][y - 1] = "0";
      this.state.grid[x - 1][y - 2] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }

    if ((this.state.grid[x + 1][y + 1] === opponent) && (this.state.grid[x + 2][y + 2] === opponent) && (this.state.grid[x + 3][y + 3] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x + 1][y + 1] = "0";
      this.state.grid[x + 2][y + 2] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }
  }

  checkMinorDiagonal(x,y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';

    let startingX = x + 4;
    const finishingX = x - 4;

    let startingY = y - 4;
    const finishingY = y + 4;

    let inARow = 0;

    while (startingX >= finishingX) {
      if (startingX >= 0 && startingX <= 12 && startingY >= 0 && startingY <= 12) {
        if (this.state.grid[startingX][startingY] === color) {
          inARow++;
          if (inARow === 5) {
            setTimeout(()=>{alert(`${color} wins!`)}, 1);
            this.handleReset();
          }
        } else {
          inARow = 0;
        }
      }
      startingX--;
      startingY++;
    }
  }

  checkMinorDiagonalForPair(x, y) {
    let color = (this.state.redIsNext === false) ? 'gold' : 'red';
    let opponent = (this.state.redIsNext === true) ? 'gold' : 'red';

    if ((this.state.grid[x + 1][y - 1] === opponent) && (this.state.grid[x + 2][y - 2] === opponent) && (this.state.grid[x + 3][y - 3] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x + 1][y - 1] = "0";
      this.state.grid[x + 2][y - 2] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }

    if ((this.state.grid[x + 1][y - 1] === opponent) && (this.state.grid[x + 2][y - 2] === opponent) && (this.state.grid[x + 3][y - 3] === color)) {
      if (color === 'gold') {
        this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
      } else {
        this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
      }
      this.state.grid[x + 1][y - 1] = "0";
      this.state.grid[x + 2][y - 2] = "0";
      this.setState({
        goldCapturedPairs: this.state.goldCapturedPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        grid: this.state.grid
      }, console.log(this.state))
    }
  }
}

  render () {
    return (
    <div>
      <h1>Pente</h1>
      <Board grid={this.state.grid} handleClick={this.handleClick} />
    </div>
    )
  }



ReactDOM.render(<Game />, document.getElementById('app'));