'use client';

interface ButtonControlProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function ButtonControl({ children, onClick, className = "", icon }: ButtonControlProps) {
  return (
    <button
      onClick={onClick}
      className={`button-control ${className}`}
    >
      {children}
      {icon && <span className="button-icon">{icon}</span>}
    </button>
  );
}