import { Navigate } from "react-router-dom";

const AuthGuardComponent = ({ children }) => {
  var currentUser = localStorage.getItem("userType");
  if (!currentUser) {
    return <Navigate to="/signIn" replace />;
  }
  return children;
};

export default AuthGuardComponent;