interface ButtonLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
}

export default function ButtonLink({ 
  children, 
  href, 
  className = "",
  target,
  rel
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`button-control ${className}`}
    >
      {children}
    </a>
  );
}