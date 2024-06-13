import React, { useState } from "react";
import PropTypes from "prop-types";
const Loader = ({
  fill,
  hoverColor,
  hoverScale,
  hoverRotate,
  onClick,
  size = 20,
}) => {
  const [filled, setFilled] = useState(fill);
  const [transform, setTransform] = useState("none");
  const handleMouseEnter = () => {
    hoverColor && setFilled(hoverColor);
    hoverScale && setTransform("scale(1.2)");
    hoverRotate && setTransform("rotate(360deg)");
  };
  const handleMouseLeave = (e) => {
    setFilled(fill);
    setTransform("none");
  };
  return (
    <svg
      style={{
        transition: "transform 1s, fill 0.4s ",
        fill: filled,
        transform: transform,
        cursor: "pointer",
        width: size,
        height: size,
        shapeRendering: "auto",
        display: "block",
        background: "none",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="200"
      height="200"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <circle
          style={{
            transition: "stroke 0.4s",
            stroke: filled,
            pointerEvents: "none",
          }}
          onMouseEnter={(e) => {
            if (hoverColor) setFilled(hoverColor);
          }}
          onMouseLeave={(e) => {
            setFilled(fill);
          }}
          strokeDasharray="164.93361431346415 56.97787143782138"
          r="35"
          strokeWidth="10"
          stroke="#ffffff"
          fill="none"
          cy="50"
          cx="50"
        >
          <animateTransform
            keyTimes="0;1"
            values="0 50 50;360 50 50"
            dur="1s"
            repeatCount="indefinite"
            type="rotate"
            attributeName="transform"
          ></animateTransform>
        </circle>
        <g></g>
      </g>
    </svg>
  );
};
Loader.propTypes = {
  fill: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverScale: PropTypes.bool,
  hoverRotate: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.number,
};
export default Loader;
