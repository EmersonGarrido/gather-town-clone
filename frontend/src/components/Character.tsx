/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface CharacterProps {
  myCharacter: any;
}

const Character: React.FC<CharacterProps> = ({ myCharacter }) => {
  const getClassName = (direction: string) => {
    switch (direction) {
      case "up":
        return "sprite walk-up walking";
      case "down":
        return "sprite walk-down walking";
      case "left":
        return "sprite walk-left walking";
      case "right":
        return "sprite walk-right walking";
      default:
        return "sprite idle";
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: myCharacter.x,
        top: myCharacter.y,
      }}
      className={getClassName(myCharacter.direction)}
    />
  );
};

export default Character;
