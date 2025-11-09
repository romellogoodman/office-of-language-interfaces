import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header>
      <div className="header-content">
        <p className="header-logo">
          <a href="/">
            <Logo />
          </a>
        </p>
      </div>
    </header>
  );
}
