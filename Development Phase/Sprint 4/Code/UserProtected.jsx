import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const UserProtected = ({ children }) => {
  let activeUser = false;
  const token = sessionStorage.getItem("token");
  activeUser = token ? jwtDecode(token) : false;

  if (!activeUser) {
    console.log("Not logged In");
    return <Navigate to="/" replace={true} />;
  }
  if (activeUser.isAdmin) {
    console.log("Not a user");
    return <Navigate to="/" replace={true} />;
  }
  return children;
};

export default UserProtected;
