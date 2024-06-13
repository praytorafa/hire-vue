import React from "react";
import PropTypes from "prop-types";
const CopyIcon = ({ onClick, size = 20 }) => {
  return (
    <svg
      style={{ width: size, height: size }}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      id="copyData"
    >
      <path fill="#F15439" d="M45.321 16.538h13.217L45.321 3z"></path>
      <path
        fill="#399BB9"
        d="M33.308 11.923H7.923V61h38.923V25.462H33.308V11.923z"
      ></path>
      <path fill="#FFF" d="M33.308 25.462h13.538L33.308 11.923z"></path>
      <path d="M47.846 62H6.923V10.923h26.799l14.125 14.125V62zM8.923 60h36.923V25.876L32.894 12.923H8.923V60z"></path>
      <path d="M46.846 26.462H32.308V11.923h2v12.539h12.538zM12.154 29.538h30.461v2H12.154zM12.154 54.923h30.461v2H12.154zM12.154 49.846h30.461v2H12.154zM12.154 44.77h30.461v2H12.154zM12.154 39.692h30.461v2H12.154zM12.154 34.615h30.461v2H12.154zM12.154 19.385h15.231v2H12.154zM29.077 19.385h1.692v2h1.692zM12.154 24.462h15.231v2H12.154zM29.077 24.462h1.692v2h1.692zM12.154 14.308h15.231v2H12.154zM29.077 14.308h1.692v2h1.692z"></path>
      <path d="M59.527 53.065h9.588v1.976h7.611V16.94L44.905 3.988H21.527v4.589H19.55V2.012h26.187l13.79 14.124z"></path>
      <path d="M58.539 17.526H44.333V3h1.977v12.55h12.229z"></path>
    </svg>
  );
};
CopyIcon.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.number,
};
export default CopyIcon;
