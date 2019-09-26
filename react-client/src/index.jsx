import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Board from './components/Board.jsx';
import Pairs from './components/Pairs.jsx';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: Array(13).fill().map(x => Array(13).fill("0")),
      redPairs: Array(5).fill().map(x => Array(2).fill("0")),
      goldPairs: Array(5).fill().map(x => Array(2).fill("0")),
      redIsNext: true,
      redCapturedPairs: 0,
      goldCapturedPairs: 0,
      history:[],
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.undoMove = this.undoMove.bind(this);
    this.capturePair = this.capturePair.bind(this);
    this.checkColumnForPair = this.checkColumnForPair.bind(this);
    this.checkforPairinHist = this.checkforPairinHist.bind(this);
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
      redPairs: Array(5).fill().map(x => Array(2).fill('0')),
      goldPairs: Array(5).fill().map(x => Array(2).fill('0')),
      redIsNext: true,
      redCapturedPairs: 0,
      goldCapturedPairs: 0,
      history: [],
    })
  }

  handleClick(x, y) {
    const hist = this.state.history.concat([[x, y]])
    if (this.state.grid[x][y] === '0') {
      if (this.state.redIsNext === true) {
        this.state.grid[x][y] = 'red';
        this.setState({
          grid: this.state.grid,
          redIsNext: false,
          history: hist,
        })
      } else {
        this.state.grid[x][y] = 'gold';
        this.setState({
          grid: this.state.grid,
          redIsNext: true,
          history: hist,
        })
      }
    }
    this.capturePair(x, y)
    this.calculateWin(x, y);
  }

  undoMove() {
    if (this.state.history.length <= 0) {
      return;
    }

    let currentMove = this.state.history.pop();

    this.state.grid[currentMove[0]][currentMove[1]] = '0';

    this.setState({
      grid: this.state.grid,
      history: this.state.history,
      redIsNext: !this.state.redIsNext,
    }, this.checkforPairinHist())

  }

  checkforPairinHist() {
    if (this.state.history.length <= 0) {
      return;
    }

    if (this.state.history[this.state.history.length - 1].length === 3) {
      let parArr = this.state.history.pop();
      if (parArr[2] === 'gold') {
        this.state.grid[parArr[0][0]][parArr[0][1]] = 'red';
        this.state.grid[parArr[1][0]][parArr[1][1]] = 'red';
        this.state.redPairs[this.state.goldCapturedPairs - 1][0] = '0';
        this.state.redPairs[this.state.goldCapturedPairs - 1][1] = '0';
        this.state.goldCapturedPairs = this.state.goldCapturedPairs - 1;
      } else {
        this.state.grid[parArr[0][0]][parArr[0][1]] = 'gold';
        this.state.grid[parArr[1][0]][parArr[1][1]] = 'gold';
        this.state.goldPairs[this.state.redCapturedPairs - 1][0] = '0';
        this.state.goldPairs[this.state.redCapturedPairs - 1][1] = '0';
        this.state.redCapturedPairs = this.state.redCapturedPairs - 1;
      }
      this.setState({
        grid: this.state.grid,
        history: this.state.history,
        redPairs: this.state.redPairs,
        goldPairs: this.state.goldPairs,
        redCapturedPairs: this.state.redCapturedPairs,
        goldCapturedPairs: this.state.goldCapturedPairs,
      })
    }
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
      setTimeout(()=>{this.handleReset()}, 200);
    }

    if (this.state.goldCapturedPairs === 5) {
      setTimeout(()=>{alert(`gold wins!`)}, 1);
      setTimeout(()=>{this.handleReset()}, 200);
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
            setTimeout(()=>{this.handleReset()}, 200);
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

    if (x - 3 >= 0) {
      if ((this.state.grid[x - 1][y] === opponent) && (this.state.grid[x - 2][y] === opponent) && (this.state.grid[x - 3][y] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x - 1][y] = "0";
        this.state.grid[x - 2][y] = "0";
        const removed = [[[x - 1, y], [x - 2, y], color], [x, y]]
        const histo = this.state.history.concat(removed)

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo,
        })
      }
    }

    if (x + 3 <= 12) {
      if ((this.state.grid[x + 1][y] === opponent) && (this.state.grid[x + 2][y] === opponent) && (this.state.grid[x + 3][y] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x + 1][y] = "0";
        this.state.grid[x + 2][y] = "0";
        const removed = [[[x + 1, y], [x + 2, y], color], [x, y]]
        const histo = this.state.history.concat(removed)

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo
        })
      }
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
            setTimeout(()=>{this.handleReset()}, 200);
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

    if (y - 3 >= 0) {
      if ((this.state.grid[x][y - 1] === opponent) && (this.state.grid[x][y - 2] === opponent) && (this.state.grid[x][y - 3] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x][y - 1] = "0";
        this.state.grid[x][y - 2] = "0";
        const removed = [[[x, y - 1], [x, y - 2], color], [x, y]];
        const histo = this.state.history.concat(removed);

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo
        })
      }
    }

    if (y + 3 <= 12) {
      if ((this.state.grid[x][y + 1] === opponent) && (this.state.grid[x][y + 2] === opponent) && (this.state.grid[x][y + 3] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x][y + 1] = "0";
        this.state.grid[x][y + 2] = "0";
        const removed = [[[x, y + 1], [x, y + 2], color], [x, y]];
        const histo = this.state.history.concat(removed);

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo
        })
      }
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
            setTimeout(()=>{this.handleReset()}, 200);
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

    if (x - 3 >= 0 && y - 3 >= 0) {
      if ((this.state.grid[x - 1][y - 1] === opponent) && (this.state.grid[x - 2][y - 2] === opponent) && (this.state.grid[x - 3][y - 3] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x - 1][y - 1] = "0";
        this.state.grid[x - 2][y - 2] = "0";
        const removed = [[[x - 1, y - 1], [x - 2, y - 2], color], [x, y]];
        const histo = this.state.history.concat(removed);

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo,
        })
      }
    }

    if (x + 3 <= 12 && y + 3 <= 12) {
      if ((this.state.grid[x + 1][y + 1] === opponent) && (this.state.grid[x + 2][y + 2] === opponent) && (this.state.grid[x + 3][y + 3] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x + 1][y + 1] = "0";
        this.state.grid[x + 2][y + 2] = "0";
        const removed = [[[x + 1, y + 1], [x + 2, y + 2], color], [x, y]];
        const histo = this.state.history.concat(removed);

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo,
        })
      }
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
            setTimeout(()=>{this.handleReset()}, 200);
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

    if (x + 3 <= 12 && y - 3 >= 0) {
      if ((this.state.grid[x + 1][y - 1] === opponent) && (this.state.grid[x + 2][y - 2] === opponent) && (this.state.grid[x + 3][y - 3] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x + 1][y - 1] = "0";
        this.state.grid[x + 2][y - 2] = "0";
        const removed = [[[x + 1, y - 1], [x + 2, y - 2], color], [x, y]];
        const histo = this.state.history.concat(removed);

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo,
        })
      }
    }

    if (x - 3 >= 0 && y + 3 <= 12) {
      if ((this.state.grid[x - 1][y + 1] === opponent) && (this.state.grid[x - 2][y + 2] === opponent) && (this.state.grid[x - 3][y + 3] === color)) {
        if (color === 'gold') {
          this.state.goldCapturedPairs = this.state.goldCapturedPairs + 1;
          this.state.redPairs[this.state.goldCapturedPairs - 1][0] = 'red';
          this.state.redPairs[this.state.goldCapturedPairs - 1][1] = 'red';
        } else {
          this.state.redCapturedPairs = this.state.redCapturedPairs + 1;
          this.state.goldPairs[this.state.redCapturedPairs - 1][0] = 'gold';
          this.state.goldPairs[this.state.redCapturedPairs - 1][1] = 'gold';
        }
        this.state.grid[x - 1][y + 1] = "0";
        this.state.grid[x - 2][y + 2] = "0";
        const removed = [[[x - 1, y + 1], [x - 2, y + 2], color], [x, y]];
        const histo = this.state.history.concat(removed);

        this.setState({
          goldCapturedPairs: this.state.goldCapturedPairs,
          redCapturedPairs: this.state.redCapturedPairs,
          goldPairs: this.state.goldPairs,
          redPairs: this.state.redPairs,
          grid: this.state.grid,
          history: histo
        })
      }
    }
  }


  render () {

    return (
    <div>
      <div>
        <h1 className="pente text">Pente</h1>
      </div>
      <div className="container">
        <span>
          <Board grid={this.state.grid} handleClick={this.handleClick} />
        </span>
        <span>
          <Pairs redPairs={this.state.redPairs} goldPairs={this.state.goldPairs} nextColor={this.state.redIsNext}/>
        </span>
      </div>

      <div className="buttons">
        <span>
          <button className="button reset text" onClick={this.handleReset}>reset game</button>
        </span>
        <span>
          <button className="button undo text" onClick={this.undoMove}>undo move</button>
        </span>
      </div>
    </div>
    )
  }
};


ReactDOM.render(<Game />, document.getElementById('app'));