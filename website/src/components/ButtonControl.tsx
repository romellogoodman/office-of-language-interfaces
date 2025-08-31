'use client';

interface ButtonControlProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export default function ButtonControl({ children, onClick, className = "" }: ButtonControlProps) {
  return (
    <button
      onClick={onClick}
      className={`button-control ${className}`}
    >
      {children}
    </button>
  );
}