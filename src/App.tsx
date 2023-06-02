import React, { useEffect, useState, useRef } from "react";

import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [tilesXY, setTilesXY] = useState(4);
  const [tileWidthHeight, setTileWidthHeight] = useState<number | undefined>();
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  const [boardBackground, setBoardBackground] = useState<number[]>([]);
  const [moveDistance, setMoveDistance] = useState(0);

  useEffect(() => {
    if (bottomSectionRef.current) {
      const width = bottomSectionRef.current.offsetWidth / tilesXY;

      setMoveDistance(width / tilesXY);

      setTileWidthHeight(width);
      initBoard();
    }
  }, [tilesXY]);

  function initBoard() {
    const newBoardBackground = Array(tilesXY * tilesXY).fill(0);
    setBoardBackground(newBoardBackground);
  }
  /* 104  = 4 */
  return (
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
        <div className="bottomBoard">
          <div
            className="boardTile"
            style={{
              width: tileWidthHeight,
              height: tileWidthHeight,
              top: moveDistance * tilesXY * 2,
              left: moveDistance * tilesXY * 2,
            }}
          >
            
            <div className="boardInnerTile">
              <p className="value">2</p>
            </div>
          </div>

          <div
            className="boardTile"
            style={{
              width: tileWidthHeight,
              height: tileWidthHeight,
              top: moveDistance * tilesXY * 1,
              left: moveDistance * tilesXY * 3,
            }}
          >
            
            <div className="boardInnerTile">
              <p className="value">2</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
