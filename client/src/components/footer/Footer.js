import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  who: [
    { label: "About Us", to: "/" },
    { label: "Careers", to: "/" },
    { label: "Press", to: "/" },
  ],
  help: [
    { label: "Shipping & Return Policy", to: "/" },
    { label: "Help Center", to: "/" },
    { label: "Terms & Conditions", to: "/" },
  ],
  quick: [
    { label: "Privacy Policy", to: "/" },
    { label: "Sell on Vixen Fashion", to: "/" },
    { label: "Offers", to: "/?cat=sale" },
    { label: "Sitemap", to: "/" },
  ],
};

const CATEGORY_DIRECTORY = {
  Women: [
    "Indianwear", "Westernwear", "Bags", "Footwear", "Jewellery",
    "Lingerie", "Sportswear", "Sleep & Lounge", "Watches", "Accessories",
  ],
  Men: [
    "Topwear", "Bottomwear", "Ethnicwear", "Footwear", "Accessories",
    "Innerwear & Sleepwear", "Watches", "Bags & Backpacks", "Athleisure",
  ],
  Kids: [
    "Indianwear", "Westernwear", "Footwear", "Jewellery", "Sportswear",
    "Sleepwear", "Accessories", "Toys & Games",
  ],
  Luxe: [
    "Ethnic Wear", "Westernwear", "Footwear", "Bags", "Accessories",
    "Watches", "Home", "Jewellery", "Dresses",
  ],
  "Top Brands": [
    "Puma", "Vero Moda", "Biba", "Forever New", "Skechers",
    "Calvin Klein", "Gucci", "Chanel", "H&M", "Accessorize",
  ],
  "House of Vixen": [
    "Twenty Dresses", "Vixen Studio", "RSVP", "Mixt", "Kica",
    "Pipa Bella", "Twig & Twine", "Likha", "Azai",
  ],
};

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__sustainable">
        <span>Sustainable labels worth checking out:</span>
        {["Vixen Studio", "Twenty Dresses", "Libas", "Forever New", "CIDER"].map(
          (brand) => (
            <Link key={brand} to="/" className="site-footer__sustainable-link">
              {brand}
            </Link>
          )
        )}
      </div>

      <div className="site-footer__help-band">
        <div className="site-footer__help-inner">
          <div>
            <p className="site-footer__band-label">DOWNLOAD OUR APP</p>
            <div className="site-footer__app-badges">
              <span className="site-footer__app-badge">Google Play</span>
              <span className="site-footer__app-badge">App Store</span>
            </div>
          </div>
          <div className="site-footer__help-text">
            <p className="site-footer__band-label">FOR ANY HELP, YOU MAY CALL US AT</p>
            <p className="site-footer__phone">1800-266-3333</p>
            <p className="site-footer__hours">
              (Monday to Saturday, 9AM – 9PM IST) · (Sunday, 10AM – 7PM IST)
            </p>
          </div>
        </div>
      </div>

      <div className="site-footer__links-band">
        <div className="site-footer__links-grid">
          <div>
            <h4>WHO ARE WE</h4>
            {FOOTER_LINKS.who.map((link) => (
              <Link key={link.label} to={link.to}>{link.label}</Link>
            ))}
          </div>
          <div>
            <h4>HELP</h4>
            {FOOTER_LINKS.help.map((link) => (
              <Link key={link.label} to={link.to}>{link.label}</Link>
            ))}
          </div>
          <div>
            <h4>QUICKLINKS</h4>
            {FOOTER_LINKS.quick.map((link) => (
              <Link key={link.label} to={link.to}>{link.label}</Link>
            ))}
          </div>
          <div>
            <h4>FOLLOW US</h4>
            <div className="site-footer__social">
              <Link to="/">Instagram</Link>
              <Link to="/">Facebook</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__directory">
        <div className="site-footer__directory-grid">
          {Object.entries(CATEGORY_DIRECTORY).map(([heading, items]) => (
            <div key={heading} className="site-footer__directory-col">
              <h4>{heading.toUpperCase()}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item}>
                    <Link to="/">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="site-footer__bottom">
        © 2026 Vixen Fashion India · All prices in ₹ INR
      </div>
    </footer>
  );
}

export default Footer;
