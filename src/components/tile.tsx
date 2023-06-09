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
  8: "rgb(242, 177, 121)",
  16: "rgb(245, 149, 99)",
  32: "rgb(246, 124, 95)",
  64: "rgb(246, 94, 59)",
  128: "rgb(237, 207, 114)",
  256: "rgb(237, 204, 97)",
  512: "rgb(237, 200, 80)",
  1024: "rgb(237, 197, 63)",
  2048: "rgb(237, 194, 46)",
  COLOR_OTHER: "rgb(0, 0, 0)",
  COLOR_GAME_OVER: "rgba(238, 228, 218, 0.73)",
};

function Tile(props: Props) {

  if (props.value != 0) {
    return (
      <div
        className="boardTile"
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
          <p className="value">{props.value}</p>
        </div>
      </div>
    );
  }
  return null;
}

export default Tile;
