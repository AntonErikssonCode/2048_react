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

  function moveLeft() {
    let newScore = score;
    let newTilesArray = tilesArray.slice();
    let newPrevTilesArray = JSON.parse(JSON.stringify(tilesArray)); // Create a deep copy

    let bonus = 0;
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
            } else if (valueToTheLeft == 0) {
              newTilesArray[row][column - 1] = value;
              newTilesArray[row][column] = 0;
              numberOfMoves++;
            }
          }
        }
      }
    }
    setMove("left");

    setTilesArray(newTilesArray);
    setPrevTilesArray(newPrevTilesArray);
    setBonus(bonus);
    setScore(newScore);
  }

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
            } else if (valueToTheLeft == 0) {
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
            } else if (valueAbove === 0) {
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
            } else if (valueBelow === 0) {
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
    placeTiles();
    console.dir("tilesArray_______________________");
    console.table(tilesArray);
    console.dir("prevTilesArray_______________________");
    console.table(prevTilesArray);
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
    placeTiles();
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
