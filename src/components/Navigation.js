import React from "react";
import { Link } from "react-router-dom";
import "styles/Navigation.css";

const Navigation = ({ userObj }) => {
  return (
    <div className="nav_bar">
      <div className="nav_icon">
        <Link to="/">Home</Link>
      </div>
      <div className="nav_icon">
        <Link to="/profile">My Profile</Link>
      </div>
    </div>
  );
};

export default Navigation;
