import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CrearCuenta from "./pages/CrearCuenta";
import Cajero from "./pages/Cajero";
import Nequi from "./pages/AuthNequi";
import Bancolombia from "./pages/AuthBancolombia";
import DashboardBancolombia from "./pages/DashboardBancolombia";
import { SecurityCodeProvider } from "./context/SecurityCodeContext";
import Layout from "./components/Layout"
import "./index.css";
import DashboardNequi from "./pages/DashboardNequi";
import AuthTarjeta from "./pages/AuthTarjeta";
import LoginTarjeta from "./pages/LoginTarjeta";


function App() {
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
             <Route path="/auth/tarjeta" element={<AuthTarjeta />} />
             <Route path="/login/tarjeta" element={<LoginTarjeta />} />
           </Routes>
         </Layout>
       </SecurityCodeProvider>
     </Router>
 )
}

export default App;
