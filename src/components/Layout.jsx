import React, { useState } from "react";
import Header from "./Header";
import FloatingWithdrawalCode from "./FloatingWithdrawalCode";

const Layout = ({ children }) => {
  const [showWithdrawalCode, setShowWithdrawalCode] = useState(false);

  return (
    <div>
      <Header />
      <main>{children}</main>
      <FloatingWithdrawalCode 
        visible={showWithdrawalCode} 
        onClose={() => setShowWithdrawalCode(false)} 
      />
    </div>
  );
};

export default Layout;
