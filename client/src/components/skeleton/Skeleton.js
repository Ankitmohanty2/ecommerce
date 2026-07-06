import React from "react";

function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Skeleton;
