import React from "react";
import "./styles.css";

const ColorPicker = ({ bgColor, onColorChange }) => {
  return (
    <div className="color-picker-container">
      <a>Select a color to change the background:</a>
      <input
        type="color"
        value={bgColor}
        // update the background color when the color picker value changes
        onChange={(event) => onColorChange(event.target.value)}
        className="color-picker"
      />
    </div>
  );
};

export default ColorPicker;
