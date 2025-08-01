import { Link } from "react-router-dom";
function Header() {
  return (
    <>
      <h1>KEY-VAULT</h1>
      <div
        style={{
          float: "center",
          margin: "50px",
          padding: "20px",
          backgroundcolor: "lavender-blush",
        }}
      >
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/encrypt">Encrypt</Link>
              </li>
              <li>
                <Link to="/decrypt">Decrypt</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </>
  );
}
export default Header;
<div
  style={{
    float: "left",
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    height: "5px",
  }}
>
  Key-Vault
</div>;
