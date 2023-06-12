import React, { useEffect, useState, useRef } from "react";

import "./App.css";
import Tile from "./components/tile";
import Bonus from "./components/bonus";
function App() {
  // Refs
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isKeyPressedRef = useRef(false);

  // Scores
  const [score, setScore] = useState(0);
  const [bonus, setBonus] = useState(0);

  // Tiles
  const [tilesXY, setTilesXY] = useState(4);
  const [tileWidthHeight, setTileWidthHeight] = useState<number | undefined>();
  const [moveDistance, setMoveDistance] = useState(0);
  const [width, setWidth] = useState(104);
  const [move, setMove] = useState("none");
  const [animationArray, setAimationArray] = useState([]);
  // Board
  const [tilesArray, setTilesArray] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [prevTilesArray, setPrevTilesArray] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [boardBackground, setBoardBackground] = useState<number[]>([]);
  const [tilesElements, setTilesElements] = useState<(JSX.Element | null)[]>(
    []
  );

  // Game State
  const [gameReady, setGameReady] = useState(false);
  const [undoAvailable, setUndoAvailable] = useState(true);

  // Handlers

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTilesXY(parseInt(event.target.value));
  };

  const handleNewGame = () => {
    if (tilesXY == 4) {
      setTilesXY(5);
    } else {
      setTilesXY(4);
    }
  };

  const undoMove = () => {
    if (undoAvailable) {
      setTilesArray(prevTilesArray);
      let prevScore = score - bonus;
      setScore(prevScore);
      setUndoAvailable(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    if (isKeyPressedRef.current) {
      return;
    }

    isKeyPressedRef.current = true;

    switch (event.key) {
      case "ArrowUp":
        moveUp();
        spawnTile();
        break;
      case "ArrowDown":
        moveDown();
        spawnTile();
        break;
      case "ArrowLeft":
        moveLeft();
        spawnTile();
        break;
      case "ArrowRight":
        moveRight();
        spawnTile();
        break;
      default:
        // Handle other cases if needed
        break;
    }
    setUndoAvailable(true);
  };

  const handleKeyUp = () => {
    isKeyPressedRef.current = false;
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [tilesArray]);
  /* 
  function moveLeft() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy
    let bonus = 0;
    let animateArray:any = [];
    for (let index = 0; index < tilesXY - 1; index++) {
      for (let row = 0; row < newTilesArray.length; row++) {
        for (let column = 0; column < newTilesArray[row].length; column++) {
          let value = newTilesArray[row][column];
          let valueToTheLeft = newTilesArray[row][column - 1];
          const key = row + ":" + column;
          let numberOfMoves = 0;
          if (column > 0) {
            if (valueToTheLeft == value && value != 0) {
              newTilesArray[row][column - 1] = value + value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
              newScore += value + value;
              bonus += value + value;
            } else if (valueToTheLeft == 0 && value != 0) {
              newTilesArray[row][column - 1] = value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
            }
          }
          animateArray.push({[key]:numberOfMoves })

        }
      }
    }
    setMove("left");
    console.dir(animateArray)
    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);
    setBonus(bonus);
    setScore(newScore);
  } */
  function moveLeft() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy
    let bonus = 0;
    let animateArray: any = [];

    for (let row = 0; row < newTilesArray.length; row++) {
      let numberOfMoves = 0;
      let zerosArray = [];

      for (let column = 1; column < newTilesArray[row].length; column++) {
        let value = newTilesArray[row][column];
        let valueToTheLeft = newTilesArray[row][column - 1];
        const pos = { row: row, column: column };
        const key = row + ":" + column;
        let addedNum= false;
        if (value != 0) {
          let moveSteps = 0;
          let tempColumn = column - 1;

          while (tempColumn >= 0 && newTilesArray[row][tempColumn] == 0) {
            moveSteps++;
            tempColumn--;
          }

          if (valueToTheLeft == value) {
            newTilesArray[row][column - moveSteps - 1] = value + value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
            newScore += value + value;
            bonus += value + value;
            addedNum = true;
          } else if (moveSteps > 0) {
            newTilesArray[row][column - moveSteps] = value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
          }

          if (moveSteps > 0 || addedNum) {
            if(addedNum){
              zerosArray.push({ key: key, moveSteps: 1, pos: pos });
            }
            else{
              zerosArray.push({ key: key, moveSteps: moveSteps, pos: pos });

            }
          }
        }
      }

      animateArray = animateArray.concat(zerosArray);
    }

    setMove("left");
    console.dir(animateArray);
    setAimationArray(animateArray);
    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);
    setBonus(bonus);
    setScore(newScore);
  }

  /* 

  function moveRight() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy

    let bonus = 0;
    // Loop through all tiles mutiple times
    for (let index = 0; index < tilesXY - 1; index++) {
      // Loop thorugh rows
      for (let row = 0; row < newTilesArray.length; row++) {
        // Loop thorugh columns
        for (let column = tilesXY; column >= 0; column--) {
          let value = newTilesArray[row][column];
          let valueToTheLeft = newTilesArray[row][column + 1];
          const key = row + ":" + column;
          let numberOfMoves = 0;

          if (column < tilesXY) {
            if (valueToTheLeft == value && value != 0) {
              newTilesArray[row][column + 1] = value + value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
              newScore += value + value;
              bonus += value + value;
            } else if (valueToTheLeft == 0  && value != 0) {
              newTilesArray[row][column + 1] = value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
            }
          }
        }
      }
    }
    setMove("right");
    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);

    setBonus(bonus);
    setScore(newScore);
  }
  function moveUp() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy
    let bonus = 0;
    for (let index = 0; index < tilesXY - 1; index++) {
      for (let column = 0; column < newTilesArray.length; column++) {
        for (let row = 1; row < newTilesArray[column].length; row++) {
          let value = newTilesArray[row][column];
          let valueAbove = newTilesArray[row - 1][column];
          const key = row + ":" + column;
          let numberOfMoves = 0;

          if (row > 0) {
            if (valueAbove === value && value !== 0) {
              newTilesArray[row - 1][column] = value + value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
              newScore += value + value;
              bonus += value + value;
            } else if (valueAbove === 0  && value != 0) {
              newTilesArray[row - 1][column] = value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
            }
          }
        }
      }
    }

    setMove("up");

    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);

    setBonus(bonus);
    setScore(newScore);
  }

  function moveDown() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy

    let bonus = 0;
    for (let index = 0; index < tilesXY - 1; index++) {
      for (let column = 0; column < newTilesArray.length; column++) {
        for (let row = tilesXY - 2; row >= 0; row--) {
          let value = newTilesArray[row][column];
          let valueBelow = newTilesArray[row + 1][column];
          const key = row + ":" + column;
          let numberOfMoves = 0;

          if (row < tilesXY - 1) {
            if (valueBelow === value && value !== 0) {
              newTilesArray[row + 1][column] = value + value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
              newScore += value + value;
              bonus += value + value;
            } else if (valueBelow === 0  && value != 0) {
              newTilesArray[row + 1][column] = value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
            }
          }
        }
      }
    }

    setMove("down");
    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);

    setBonus(bonus);
    setScore(newScore);
  }
 */
  function moveRight() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy

    let bonus = 0;
    let animateArray: any = [];

    for (let row = 0; row < newTilesArray.length; row++) {
      let numberOfMoves = 0;
      let zerosArray = [];

      for (let column = newTilesArray[row].length - 2; column >= 0; column--) {
        let value = newTilesArray[row][column];
        let valueToTheRight = newTilesArray[row][column + 1];
        const key = row + ":" + column;

        if (value != 0) {
          let moveSteps = 0;
          let tempColumn = column + 1;

          while (
            tempColumn < newTilesArray[row].length &&
            newTilesArray[row][tempColumn] == 0
          ) {
            moveSteps++;
            tempColumn++;
          }

          if (valueToTheRight == value) {
            newTilesArray[row][column + moveSteps + 1] = value + value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
            newScore += value + value;
            bonus += value + value;
          } else if (moveSteps > 0) {
            newTilesArray[row][column + moveSteps] = value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
          }

          if (moveSteps > 0) {
            zerosArray.push({ moveSteps: moveSteps });
          }
        }
      }

      animateArray = animateArray.concat(zerosArray);
    }

    setMove("right");
    console.dir(animateArray);
    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);
    setBonus(bonus);
    setScore(newScore);
  }

  function moveUp() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy
    let bonus = 0;
    let animateArray: any = [];

    for (let column = 0; column < newTilesArray.length; column++) {
      let numberOfMoves = 0;
      let zerosArray = [];

      for (let row = 1; row < newTilesArray[column].length; row++) {
        let value = newTilesArray[row][column];
        let valueAbove = newTilesArray[row - 1][column];
        const key = row + ":" + column;

        if (value != 0) {
          let moveSteps = 0;
          let tempRow = row - 1;

          while (tempRow >= 0 && newTilesArray[tempRow][column] == 0) {
            moveSteps++;
            tempRow--;
          }

          if (valueAbove === value) {
            newTilesArray[row - moveSteps - 1][column] = value + value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
            newScore += value + value;
            bonus += value + value;
          } else if (moveSteps > 0) {
            newTilesArray[row - moveSteps][column] = value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
          }

          if (moveSteps > 0) {
            zerosArray.push({ moveSteps: moveSteps });
          }
        }
      }

      animateArray = animateArray.concat(zerosArray);
    }

    setMove("up");
    console.dir(animateArray);
    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);
    setBonus(bonus);
    setScore(newScore);
  }

  function moveDown() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy
    let bonus = 0;
    let animateArray: any = [];

    for (let column = 0; column < newTilesArray.length; column++) {
      let numberOfMoves = 0;
      let zerosArray = [];

      for (let row = newTilesArray[column].length - 2; row >= 0; row--) {
        let value = newTilesArray[row][column];
        let valueBelow = newTilesArray[row + 1][column];
        const key = row + ":" + column;

        if (value != 0) {
          let moveSteps = 0;
          let tempRow = row + 1;

          while (
            tempRow < newTilesArray[column].length &&
            newTilesArray[tempRow][column] == 0
          ) {
            moveSteps++;
            tempRow++;
          }

          if (valueBelow === value) {
            newTilesArray[row + moveSteps + 1][column] = value + value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
            newScore += value + value;
            bonus += value + value;
          } else if (moveSteps > 0) {
            newTilesArray[row + moveSteps][column] = value;
            newTilesArray[row][column] = 0;
            numberOfMoves++;
          }

          if (moveSteps > 0) {
            zerosArray.push({ moveSteps: moveSteps });
          }
        }
      }

      animateArray = animateArray.concat(zerosArray);
    }

    setMove("down");
    console.dir(animateArray);
    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);
    setBonus(bonus);
    setScore(newScore);
  }

  let timeoutId: any;

  function debounce(func: any, delay: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  }

  function animateTiles() {
    const tiles: (JSX.Element | null)[] = [];

    // Iterate through the tilesArray
    for (let y = 0; y < prevTilesArray.length; y++) {
      for (let x = 0; x < prevTilesArray[y].length; x++) {
        const value = prevTilesArray[y][x];
        const key = y + ":" + x;
        let animationObject: any;
        let modifier = 0;
        let animationStyle = "none";

        
        // Check if the value is greater than 0
        if (value > 0) {
          if (animationArray.length > 0) {
            animationArray.forEach((element: { key?: string, moveSteps?: string }) => {
             /*  console.dir("elementKey: " + element.key)
              console.dir("key: " + key) */
              if (element.key == key) {
                animationObject = element;
                console.dir(animationObject)
                modifier = 104 *  animationObject.moveSteps ;
                animationStyle = `translateX(-${modifier}px)`;
                /* switch (move) {
                  case "left":
                    animationStyle = `translateX(-${modifier}px)`;
                    
                    
                    break;
                
                  default:
                    break;
                } */
              }
            });
          }
          const tile = (
            <div
              key={y + ":" + x}
              ref={(ref) => (tileRefs.current[y * tilesXY + x] = ref)}
            >
              <Tile
                value={value}
                tileWidthHeight={width}
                tilesXY={tilesXY}
                moveDistance={moveDistance}
                x={x}
                y={y}
                transform={animationStyle}
              />
            </div>
          );
          tiles.push(tile);
        }
      }
    }

    // Update the state with the generated elements
    setTilesElements(tiles);
/*     setTimeout(placeTiles, 1000); */
    debounce(placeTiles, 500);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tilesArray, tilesXY]);

  useEffect(() => {
    gameIsNotReady();
    if (bottomSectionRef.current) {
      setWidth(bottomSectionRef.current.offsetWidth / tilesXY);
    }
  }, [tilesXY]);

  useEffect(() => {
    setMoveDistance(width / tilesXY);
    setTileWidthHeight(width);
    initBoard();
  }, [width]);

  useEffect(() => {
    console.dir("game ready: " + gameReady);
    if (gameReady) {
      spawnTile();
      spawnTile();
    }
  }, [gameReady]);

  useEffect(() => {
    animateTiles();
/*     debounce(animateTiles, 500); */
  /*   debounce(placeTiles, 300) */
    /*     console.dir("tilesArray_______________________");
    console.table(tilesArray);
    console.dir("prevTilesArray_______________________");
    console.table(prevTilesArray); */
  }, [tilesArray, prevTilesArray]);

  // Functions
  function resetScore() {
    setScore(0);
  }
  function gameIsReady() {
    setGameReady(true);
  }
  function gameIsNotReady() {
    setGameReady(false);
  }

  function generateArray() {
    const nTile = tilesXY * tilesXY;
    const result = [];
    const innerSize = Math.sqrt(nTile);

    for (let i = 0; i < innerSize; i++) {
      const innerArray = [];

      for (let j = 0; j < innerSize; j++) {
        innerArray.push(0);
      }
      result.push(innerArray);
    }

    setTilesArray(result);
    setPrevTilesArray(result);
    console.dir("GENERATE BOARD");
  }

  function placeTiles() {
    const tiles: (JSX.Element | null)[] = [];

    // Iterate through the tilesArray
    for (let y = 0; y < tilesArray.length; y++) {
      for (let x = 0; x < tilesArray[y].length; x++) {
        const value = tilesArray[y][x];

        // Check if the value is greater than 0
        if (value > 0) {
          // Create an element for the tile and add it to the elements array
          const tile = (
            <div
              key={y + ":" + x}
              ref={(ref) => (tileRefs.current[y * tilesXY + x] = ref)}
            >
              <Tile
                value={value}
                tileWidthHeight={width}
                tilesXY={tilesXY}
                moveDistance={moveDistance}
                x={x}
                y={y}
                transform="none"
              />
            </div>
          );
          tiles.push(tile);
        }
      }
    }

    // Update the state with the generated elements
    setTilesElements(tiles);
  }

  function getRandomNumber(): number {
    const random = Math.random();
    const number = random < 0.5 ? 2 : 4;
    return number;
  }

  function spawnTile() {
    if (tilesArray && tilesArray.length == tilesXY) {
      const emptyPositions: { x: number; y: number }[] = [];

      // Find empty positions in the tilesArray
      for (let y = 0; y < tilesXY; y++) {
        for (let x = 0; x < tilesXY; x++) {
          if (tilesArray[y][x] === 0) {
            emptyPositions.push({ x, y });
          }
        }
      }

      // Find empty positions in the tilesArray
      for (let y = 0; y < tilesXY; y++) {
        for (let x = 0; x < tilesXY; x++) {
          if (tilesArray[y][x] === 0) {
            emptyPositions.push({ x, y });
          }
        }
      }

      if (emptyPositions.length === 0) {
        console.info("No unique positions available");
        return;
      }

      // Choose a random empty position
      const randomIndex = Math.floor(Math.random() * emptyPositions.length);
      const { x, y } = emptyPositions[randomIndex];

      // Generate a random number (2 or 4)
      const number = getRandomNumber();

      // Create a copy of the tilesArray and update the value at the chosen position
      const updatedTilesArray = [...tilesArray];
      updatedTilesArray[y][x] = number;

      // Update the state with the modified tilesArray
      setTilesArray(updatedTilesArray);
      console.log("Spawned tile");
    }
    /* animateTiles(); */
  }

  // Init
  function initBoard() {
    console.log("initboard game is ready: " + gameReady);
    const newBoardBackground = Array(tilesXY * tilesXY).fill(0);
    setBoardBackground(newBoardBackground);
    generateArray();
    resetScore();
    gameIsReady();
  }

  return (
    <div>
      <div className="App">
        <div className="topSection">
          <div className="topSection-1">
            <h1 className="title">2048</h1>
          </div>
          <div className="topSection-2">
            <div className="topSection-display">
              <h2 className="scoreAndBestName">SCORE</h2>
              <h3 className="scoreAndBestNum">{score}</h3>
              <Bonus bonusState={bonus} />
            </div>
            <button className="button" onClick={handleNewGame}>
              NEW
            </button>
          </div>
          <div className="topSection-3">
            <div className="topSection-display">
              <h2 className="scoreAndBestName">SIZE</h2>
              <h3 className="scoreAndBestNum">{tilesXY + "*" + tilesXY}</h3>
            </div>
            <button className="button" onClick={undoMove}>
              UNDO
            </button>
          </div>
        </div>
        <h4>Join the number and get to the 2048 tile!</h4>
        <div className="bottomSection" ref={bottomSectionRef}>
          {/* Spawn Background Tiles */}
          <div className="bottomBackground">
            {boardBackground.map((tile, index) => (
              <div
                key={index}
                className="backgroundTile"
                style={{ width: tileWidthHeight, height: tileWidthHeight }}
              >
                <div className="backgroundTileInner"></div>
              </div>
            ))}
          </div>
          {/*  Spawn Tiles */}
          <div className="bottomBoard">{tilesElements}</div>
        </div>
      </div>
      {/*  Input Slider For Size Change */}
      <input
        type="range"
        min="2"
        max="10"
        value={tilesXY}
        className="slider"
        onChange={handleSliderChange}
      />
      <p style={{ textAlign: "center" }}>
        Use the arrow keys to control the game. Have fun!
      </p>
      <p style={{ textAlign: "center" }}>
        You can also change the size of the board with the slider
      </p>
    </div>
  );
}

export default App;
