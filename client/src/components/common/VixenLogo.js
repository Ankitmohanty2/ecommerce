import React from "react";

function VixenLogo({ className = "", compact = false, light = false }) {
  const textFill = light ? "#ffffff" : "#222222";
  const subFill = light ? "#ff6b76" : "#e50010";
  if (compact) {
    return (
      <svg
        className={`vixen-logo vixen-logo--compact ${className}`}
        viewBox="0 0 36 36"
        aria-label="Vixen Fashion"
        role="img"
      >
        <path
          d="M4 6 L18 30 L32 6"
          fill="none"
          stroke="#e50010"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 6 H25 L18 18 Z"
          fill="#ffffff"
          opacity="0.12"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`vixen-logo ${className}`}
      viewBox="0 0 168 38"
      aria-label="Vixen Fashion"
      role="img"
    >
      <path
        d="M0 4 L14 34 L28 4"
        fill="none"
        stroke="#e50010"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="34"
        y="24"
        fill={textFill}
        fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="3"
      >
        IXEN
      </text>
      <text
        x="34"
        y="36"
        fill={subFill}
        fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="4.2"
      >
        FASHION
      </text>
    </svg>
  );
}

export default VixenLogo;
