import React from 'react';
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="nav-link" to="/buyer">Buyer</Link>
      <Link className="nav-link" to="/agent">Agent</Link>
    </nav>
  );
}
