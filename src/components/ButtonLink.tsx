interface ButtonLinkProps {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function ButtonLink({
  children,
  href,
  target,
  rel,
  className = "",
  icon,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`button-control ${className}`}
    >
      {children}
      {icon && <span className="button-icon">{icon}</span>}
    </a>
  );
}
