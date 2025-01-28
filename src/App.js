import React, { useState } from "react";
import "./App.css";
import DogGallery from "./components/DogGallery/DogGallery";
import ColorPicker from "./components/DogGallery/ColorPicker/ColorPicker";

function App() {
  // state to store the background color
  const [bgColor, setBgColor] = useState("#ffffff");
  return (
    <div className="App" style={{ backgroundColor: bgColor }}>
      <ColorPicker bgColor={bgColor} onColorChange={setBgColor} />
      <DogGallery />
    </div>
  );
}

export default App;
