import React from "react";
import "./tile.css";
interface Props{
  value: number,
  tileWidthHeight: number,
  tilesXY: number,
  moveDistance: number,
  x: number, 
  y: number,
}
function Tile(props: Props) {
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
      <div className="boardInnerTile">
        <p className="value">{props.value}</p>
      </div>
    </div>
  );
}

export default Tile;
