import React from "react";

interface GridProps {
  grid: number[][];
}

const Grid: React.FC<GridProps> = ({ grid }) => {
  return (
    <div className="map">
      {grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={`cell ${cell === 1 ? "obstacle" : "cell"}`}
            style={{
              top: rowIndex * 50,
              left: cellIndex * 50,
              width: "50px",
              height: "50px",
            }}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
