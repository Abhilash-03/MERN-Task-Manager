import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className="navlist">
      <ul className="nav nav-tabs bg-dark nav-dark">
  <li className="nav-item">
    <Link className="nav-link" aria-current="page" to="/">Home</Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link" to="/register">Register</Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link" to="/login">Login</Link>
  </li>

</ul>
    </div>
  )
}

export default Navbar
