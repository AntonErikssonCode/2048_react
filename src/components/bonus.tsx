import React, { useState, useEffect } from "react";
import "./bonus.css";

type BonusProps = {
  bonusState: number;
};

function Bonus(props: BonusProps) {
  const [bonusClass, setBonusClass] = useState("bonus-animation-not-active");

  useEffect(() => {
    if (props.bonusState > 0) {
      setBonusClass("animate-bonus");
      const timeout = setTimeout(() => {
        setBonusClass("bonus-animation-not-active");
      }, 200); // Wait for the duration of the transition in milliseconds

      return () => clearTimeout(timeout);
    }
  }, [props.bonusState]);

  return (
    <div className="bonusContainer">
      <h4 className={`bonus ${bonusClass}`}>{"+" + props.bonusState}</h4>
    </div>
  );
}

export default Bonus;
