import { Button as BootstrapButton } from "react-bootstrap";
import React from "react";
import Link from "next/link";

const Button = ({ onClick, href, children, ...props }) => {
  if (onClick) {
    return (
      <BootstrapButton onClick={onClick} {...props}>
        {children}
      </BootstrapButton>
    );
  } else if (href) {
    return (
      <Link href={href}>
        <BootstrapButton as="div" {...props}>
          {children}
        </BootstrapButton>
      </Link>
    );
  } else
    return (
      <BootstrapButton as="div" {...props}>
        {children}
      </BootstrapButton>
    );
};

export default Button;
