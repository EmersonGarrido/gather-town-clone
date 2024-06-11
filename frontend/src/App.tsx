/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [myCharacter, setMyCharacter] = useState({ id: 1, x: 50, y: 60 });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("characters", (data) => {
      console.log("Received characters:", data);
      setCharacters(data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      let dx = 0,
        dy = 0;
      switch (event.key) {
        case "ArrowUp":
          dy = -10;
          break;
        case "ArrowDown":
          dy = 10;
          break;
        case "ArrowLeft":
          dx = -10;
          break;
        case "ArrowRight":
          dx = 10;
          break;
        default:
          break;
      }
      if (dx !== 0 || dy !== 0) {
        setMyCharacter((prev) => {
          const updated = { ...prev, x: prev.x + dx, y: prev.y + dy };
          socket.emit("moveCharacter", { id: prev.id, dx, dy });
          return updated;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      socket.off("connect");
      socket.off("characters");
      socket.off("disconnect");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      <h1>Gather Town Clone</h1>
      <div className="map">
        {characters.map((char, index) => (
          <div
            key={index}
            className="character"
            style={{
              top: char.y,
              left: char.x,
              position: "absolute",
              width: "50px",
              height: "50px",
              backgroundColor: char.id === myCharacter.id ? "blue" : "red",
            }}
          >
            {char.id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
