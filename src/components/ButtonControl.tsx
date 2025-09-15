"use client";

interface ButtonControlProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function ButtonControl({
  children,
  onClick,
  className = "",
  icon,
  disabled = false,
}: ButtonControlProps) {
  return (
    <button 
      onClick={onClick} 
      className={`button-control ${className}`}
      disabled={disabled}
    >
      {children}
      {icon && <span className="button-icon">{icon}</span>}
    </button>
  );
}
