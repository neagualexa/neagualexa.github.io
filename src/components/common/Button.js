import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseClasses = "btn";
  const variantClasses = variant === "secondary" ? "btn-secondary" : "";
  const fullClassName = `${baseClasses} ${variantClasses} ${className}`.trim();

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
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
};

export default Button;
