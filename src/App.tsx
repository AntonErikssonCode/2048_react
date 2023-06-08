import React, { useEffect, useState, useRef } from "react";

import "./App.css";

function App() {
  const bottomSectionRef = useRef<HTMLDivElement>(null);

  // Scores
  const [best, setBest] = useState(0);
  const [score, setScore] = useState(0);
  const [prevScore, setPrevScore] = useState(0);

  // Tiles
  const [tilesXY, setTilesXY] = useState(4);
  const [tileWidthHeight, setTileWidthHeight] = useState<number | undefined>();
  const [moveDistance, setMoveDistance] = useState(0);
  const [width, setWidth] = useState(104);

  // Board
  const [tilesArray, setTilesArray] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [prevTilesArray, setPrevTilesArray] = useState<number[]>([]);
  const [boardBackground, setBoardBackground] = useState<number[]>([]);
  const [tilesElements, setTilesElements] = useState<(JSX.Element | null)[]>(
    []
  );

  // Game State
  const [gameReady, setGameReady] = useState(false);

  // Handlers
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTilesXY(parseInt(event.target.value));
  };

  useEffect(() => {
    // Arrow keys event listener
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        spawnTile();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  

  useEffect(() => {
    setGameReady(false);
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
    if (gameReady) {
      spawnTile();
      spawnTile();
    }
    
  }, [gameReady]);

  useEffect(() => {
    console.dir(tilesArray);
  }, [tilesArray]);

  // Functions
  function resetScore() {
    setScore(0);
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
    setGameReady(true);
   
  }

  function getRandomNumber(): number {
    const random = Math.random();
    const number = random < 0.5 ? 2 : 4;
    return number;
  }

  function spawnTile() {
    console.dir(tilesArray.length);
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
  }

  // Init
  function initBoard() {
    const newBoardBackground = Array(tilesXY * tilesXY).fill(0);
    setBoardBackground(newBoardBackground);
    generateArray();
    resetScore();
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
            </div>
            <button className="button">New</button>
          </div>
          <div className="topSection-3">
            <div className="topSection-display">
              <h2 className="scoreAndBestName">BEST</h2>
              <h3 className="scoreAndBestNum">{best}</h3>
            </div>
            <button className="button">UNDO</button>
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
          {/*   <div className="bottomBoard">{tilesElements}</div> */}
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
    </div>
  );
}

export default App;
