import React, { createContext, useState } from "react";

export const SecurityCodeContext = createContext();

export const SecurityCodeProvider = ({ children }) => {
  const [securityCode, setSecurityCode] = useState("");

  return (
    <SecurityCodeContext.Provider value={{ securityCode, setSecurityCode }}>
      {children}
    </SecurityCodeContext.Provider>
  );
};
