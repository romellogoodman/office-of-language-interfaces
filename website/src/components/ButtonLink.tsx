interface ButtonLinkProps {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
  className?: string;
}

export default function ButtonLink({ 
  children, 
  href, 
  target, 
  rel, 
  className = "" 
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