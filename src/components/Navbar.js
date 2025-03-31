import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">
        Bảo tàng Tranh Đông Dương
      </Link>
      <div>
      <Link className="nav-link" to="/artifact-edit">
        Artifact Manager
        </Link>
        
        <Link className="nav-link" to="/artifact-search">
        Search
        </Link>
        

      </div>
     
    </nav>
  );
};

export default Navbar;