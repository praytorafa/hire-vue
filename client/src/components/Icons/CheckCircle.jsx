import React from "react";
import PropTypes from "prop-types";
const CheckCircle = ({ onClick, size = 20, className }) => {
  return (
    <svg
      style={{ width: size, height: size }}
      onClick={onClick}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7604 4.08001C7.38595 4.08001 3.84039 7.62557 3.84039 12C3.84039 16.3736 7.38601 19.92 11.7604 19.92C16.1348 19.92 19.6804 16.3736 19.6804 12C19.6804 7.62557 16.1348 4.08001 11.7604 4.08001ZM2.40039 12C2.40039 6.83029 6.59067 2.64001 11.7604 2.64001C16.9301 2.64001 21.1204 6.83029 21.1204 12C21.1204 17.1687 16.9302 21.36 11.7604 21.36C6.59061 21.36 2.40039 17.1687 2.40039 12Z"
        fill="#9747FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5935 9.27461C15.8746 9.55578 15.8746 10.0117 15.5935 10.2928L11.1604 14.7259C10.8793 15.007 10.4235 15.0071 10.1423 14.726L7.92486 12.5094C7.64362 12.2284 7.64352 11.7725 7.92464 11.4913C8.20577 11.21 8.66164 11.2099 8.94287 11.491L10.6512 13.1986L14.5752 9.27461C14.8564 8.99342 15.3123 8.99342 15.5935 9.27461Z"
        fill="#9747FF"
      />
    </svg>
  );
};
CheckCircle.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.number,
};
export default CheckCircle;
