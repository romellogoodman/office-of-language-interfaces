export default function Header() {
  return (
    <header>
      <div className="header-content">
        <p className="header-logo">
          <a href="/">Open Language Interfaces</a>
        </p>
        <div className="header-links">
          <p>
            <a
              href="https://chat.oli.software/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat
            </a>
          </p>
          <p>
            <a
              href="https://github.com/romellogoodman/oli/tree/main/blink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blink
            </a>
          </p>
        </div>
      </div>
    </header>
  );
}
