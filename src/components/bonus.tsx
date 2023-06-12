import React, { useState, useEffect } from "react";
import "./bonus.css";
type BonusProps = {
  bonusState: number; // Replace 'string' with the actual type of your state
};

function Bonus(props: BonusProps) {
  useEffect(() => {
    console.dir("updateBonus");
  }, [props.bonusState]);

  return (
    <div>
      <h4 className="bonus">{props.bonusState}</h4>
    </div>
  );
}

export default Bonus;
