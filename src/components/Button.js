import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size,
  className = "",
  ...props
}) => {
  // Variants and sizes map to the .btn primitives in theme.css
  const fullClassName = [
    "btn",
    `btn--${variant}`,
    size && `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // External link
  if (href) {
    return (
      <a
        href={href}
        className={fullClassName}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal link (assuming you'll use React Router Link)
  if (to) {
    const { Link } = require("react-router-dom");
    return (
      <Link to={to} className={fullClassName} {...props}>
        {children}
      </Link>
    );
  }

  // Regular button
  return (
    <button className={fullClassName} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "neutral", "soft", "link"]),
  size: PropTypes.oneOf(["sm", "icon"]),
  className: PropTypes.string,
};

export default Button;
