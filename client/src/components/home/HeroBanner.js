import React from "react";
import { Link } from "react-router-dom";

function HeroBanner({ image, title, subtitle }) {
  return (
    <section className="hero">
      <img className="hero__image" src={image} alt={title} />
      <div className="hero__overlay">
        <p className="hero__label">{subtitle}</p>
        <h1 className="hero__title">{title}</h1>
        <Link to="/" className="hero__cta">
          Shop Now
        </Link>
      </div>
    </section>
  );
}

export default HeroBanner;
