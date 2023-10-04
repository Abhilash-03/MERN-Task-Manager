import { Link } from "react-router-dom"

function Navbar({handleLogout}) {
  return (
    <div className="navlist">
      <ul className="nav nav-tabs bg-dark nav-dark">
  <li className="nav-item">
    <Link className="nav-link" aria-current="page" to="/">Home</Link>
  </li>
  {
    !localStorage.getItem('token') ?
    <form className="d-flex">
    <li className="nav-item">
    <Link className="nav-link" to="/register">Sing-up</Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link" to="/login">Login</Link>
  </li> 
  </form>
  : <button onClick={handleLogout} className="btn btn-primary logoutBtn">Logout</button>
  }
  


</ul>
    </div>
  )
}

export default Navbar
