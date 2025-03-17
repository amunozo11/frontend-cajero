import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // Determinamos si estamos en Bancolombia o Nequi (tanto en auth como en dashboard)
  const isBancolombia =
    location.pathname === "/auth/bancolombia" ||
    location.pathname === "/bancolombia-dashboard";
  const isNequi =
    location.pathname === "/auth/nequi" ||
    location.pathname === "/nequi-dashboard";

  // Definimos las clases dinámicas
  const bgClass = isBancolombia ? "bg-bancolombia_amarillo" : "bg-nequi_claro";
  const textClass = isBancolombia ? "text-bancolombia_oscuro" : "text-nequi_oscuro";

  return (
    <header className={`fixed top-0 left-0 w-full h-8 flex items-center justify-center px-6 z-50 ${bgClass}`}>
      <nav className="flex items-center space-x-6">
        {/* Enlace Izquierdo */}
        <Link 
          to="/" 
          className={`font-semibold px-2 py-1 hover:bg-white hover:text-black transition ${textClass}`}>
          Inicio
        </Link>
        <Link 
          to="/cajero" 
          className={`font-semibold px-2 py-1 hover:bg-white hover:text-black transition ${textClass}`}>
          Cajero
        </Link>
        {/* Título Central */}
        <h1 className={`text-lg font-bold px-4 ${textClass}`}>
          Sistema Bancario X UPC
        </h1>
        {/* Enlaces a la derecha */}
        <Link 
          to={isBancolombia ? "/auth/nequi" : "/auth/bancolombia"} 
          className={`font-semibold px-2 py-1 hover:bg-white hover:text-black transition ${textClass}`}>
          {isBancolombia ? "Nequi" : "Bancolombia"}
        </Link>
        <Link 
          to="/auth/tarjeta" 
          className={`font-semibold px-2 py-1 hover:bg-white hover:text-black transition ${textClass}`}>
          Tarjeta
        </Link>
      </nav>
    </header>
  );
}
