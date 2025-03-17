import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CrearCuenta from "../pages/CrearCuenta";
import Cajero from "../pages/Cajero";
import Nequi from "../pages/AuthNequi";
import Bancolombia from "../pages/AuthBancolombia";
import DashboardBancolombia from "../pages/DashboardBancolombia";
import { SecurityCodeProvider } from "../context/SecurityCodeContext";
import Layout from "../components/Layout";
import DashboardNequi from "../pages/DashboardNequi";


const AppRouter = () => {
  return (
    <Router>
      <SecurityCodeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crear-cuenta" element={<CrearCuenta />} />
            <Route path="/cajero" element={<Cajero />} />
            <Route path="/auth/nequi" element={<Nequi />} />
            <Route path="/auth/bancolombia" element={<Bancolombia />} />
            <Route path="/bancolombia-dashboard" element={<DashboardBancolombia />} />
            <Route path="/nequi-dashboard" element={<DashboardNequi />} />
          </Routes>
        </Layout>
      </SecurityCodeProvider>
    </Router>
  );
};

export default AppRouter;
