import React, { useEffect, useState } from "react";
import "./tile.css";

interface Props {
  value: number;
  tileWidthHeight: number;
  tilesXY: number;
  moveDistance: number;
  x: number;
  y: number;
}

const colors: { [key: string]: string } = {
  COLOR_EMPTY: "rgb(204, 192, 179)",
  2: "rgb(238, 228, 218)",
  4: "rgb(237, 224, 200)",
  8: "#f2b179", //"rgb(242, 177, 121)",
  16: "#f59563", //"rgb(245, 149, 99)",
  32: "#f67c60", //"rgb(246, 124, 95)",
  64: "#f65e3b", //"rgb(246, 94, 59)",
  128: "#edcf73", //"rgb(237, 207, 114)",
  256: "#edcc62", //"rgb(237, 204, 97)",
  512: "#edc850", //"//rgb(237, 200, 80)",
  1024: "#edc53f", //"rgb(237, 197, 63)",
  2048: "#edc22d", //rgb(237, 194, 46)",
  COLOR_OTHER: "rgb(0, 0, 0)",
  COLOR_GAME_OVER: "rgba(238, 228, 218, 0.73)",
};

const valueSize: Record<string, Record<number, number>> = {
  "2": { "1": 7, "2": 6, "3": 5, "4": 4.6 },
  "3": { "1": 6, "2": 5, "3": 4, "4": 3 },
  "4": { "1": 4, "2": 3.6, "3": 3, "4": 2.4 },
  "5": { "1": 3, "2": 2.8, "3": 2.4, "4": 2 },
  "6": { "1": 2.8, "2": 2.6, "3": 1.8, "4": 1.4 },
  "7": { "1": 2.6, "2": 2.4, "3": 1.4, "4": 1.2 },
  "8": { "1": 2.4, "2": 2.2, "3": 1.2, "4": 1 },
  "9": { "1": 2.2, "2": 2, "3": 1, "4": 0.8 },
  "10": { "1": 1.8, "2": 1.6, "3": 0.8, "4": 0.7 },
};

function Tile(props: Props) {
  let valueLength = props.value.toString().length;
  let fontSize = valueSize[props.tilesXY][valueLength];



  const [tileAnimation, setTileAnimation] = useState("tile-animation-not-active");

  useEffect(() => {
    if (props.value > 0) {
      setTileAnimation("animate-tile");
      const timeout = setTimeout(() => {
        setTileAnimation("tile-animation-not-active");
      }, 300); // Wait for the duration of the transition in milliseconds

      return () => clearTimeout(timeout);
    }
  }, [props.value]);


  if (props.value != 0) {
    return (
      <div
        className={`boardTile ${tileAnimation}`}
        style={{
          width: props.tileWidthHeight,
          height: props.tileWidthHeight,
          left: props.moveDistance * props.tilesXY * props.x,
          top: props.moveDistance * props.tilesXY * props.y,
        }}
      >
        <div
          className="boardInnerTile"
          style={{
            backgroundColor: colors[props.value],
          }}
        >
          <p style={{ fontSize: fontSize + "rem" }} className="value">
            {props.value}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export default Tile;
