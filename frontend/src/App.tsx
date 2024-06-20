/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Grid from "./components/Grid";
import Character from "./components/Character";
import "./App.css";

const socket = io("http://localhost:3000");

const App: React.FC = () => {
  const [, setCharacters] = useState<any[]>([]);
  const [myCharacter, setMyCharacter] = useState({
    id: 1,
    x: 250,
    y: 250,
    direction: "idle",
  });
  const [grid, setGrid] = useState<number[][]>([]);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  const gridWidth = 1000;
  const gridHeight = 600;
  const gridSize = 50;

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("characters", (data) => {
      console.log("Received characters:", data);
      setCharacters(data);
    });

    socket.on("grid", (data) => {
      console.log("Received grid:", data);
      setGrid(data);

      const initialX = myCharacter.x;
      const initialY = myCharacter.y;
      const gridX = Math.floor(initialX / gridSize);
      const gridY = Math.floor(initialY / gridSize);

      if (
        gridY < 0 ||
        gridY >= data.length ||
        gridX < 0 ||
        gridX >= data[0].length
      ) {
        setMyCharacter({ id: myCharacter.id, x: 50, y: 50, direction: "idle" });
        socket.emit("moveCharacter", { id: myCharacter.id, x: 50, y: 50 });
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isMoving) return;
      setIsMoving(true);
      let dx = 0,
        dy = 0;
      let newDirection = "idle";
      switch (event.key) {
        case "ArrowUp":
          dy = -gridSize;
          newDirection = "up";
          break;
        case "ArrowDown":
          dy = gridSize;
          newDirection = "down";
          break;
        case "ArrowLeft":
          dx = -gridSize;
          newDirection = "left";
          break;
        case "ArrowRight":
          dx = gridSize;
          newDirection = "right";
          break;
        default:
          setIsMoving(false);
          return;
      }

      setMyCharacter((prev) => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;

        const gridX = Math.floor(newX / gridSize);
        const gridY = Math.floor(newY / gridSize);

        if (
          newX >= 0 &&
          newX < gridWidth &&
          newY >= 0 &&
          newY < gridHeight &&
          grid[gridY] &&
          grid[gridY][gridX] === 0
        ) {
          socket.emit("moveCharacter", { id: prev.id, dx, dy });
          return { ...prev, x: newX, y: newY, direction: newDirection };
        } else {
          console.log(
            `Move out of bounds or into obstacle: x: ${newX}, y: ${newY}`
          );
        }
        return prev;
      });

      setTimeout(() => setIsMoving(false), 100);
    };

    const handleKeyUp = () => {
      setMyCharacter((prev) => ({ ...prev, direction: "idle" }));
      setIsMoving(false);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) {
        setScale((prevScale) => Math.min(prevScale + 0.1, 2));
      } else {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel);

    return () => {
      socket.off("connect");
      socket.off("characters");
      socket.off("grid");
      socket.off("disconnect");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [grid, myCharacter, isMoving]);

  return (
    <div className="App">
      <div
        className="map"
        style={{
          transform: `scale(${scale}) translate(${
            (gridWidth / 2 - myCharacter.x) * scale
          }px, ${(gridHeight / 2 - myCharacter.y) * scale}px)`,
          transformOrigin: "center center",
        }}
      >
        <Grid grid={grid} />
        <Character myCharacter={myCharacter} />
      </div>
    </div>
  );
};

export default App;
