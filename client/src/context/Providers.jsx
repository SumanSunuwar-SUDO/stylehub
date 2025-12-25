import React from "react";
import { AuthContext } from "./AuthContext";

const Providers = ({ children }) => {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};

export default Providers;
