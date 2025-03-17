import React, { useState } from "react";

const GenerarCodigoRetiro = () => {
  const [numero, setNumero] = useState("");
  const [clave, setClave] = useState("");
  const [codigo, setCodigo] = useState(null);

  const handleGenerarCodigo = async () => {
    const res = await fetch("http://localhost:5000/api/cuentas/generar-codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero, clave }),
    });

    const data = await res.json();
    if (res.ok) {
      setCodigo(data.codigo);
      alert("Código generado con éxito: " + data.codigo);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Generar Código de Retiro</h2>
      <input
        type="text"
        placeholder="Número de cuenta"
        className="border p-2 w-full mb-2"
        onChange={(e) => setNumero(e.target.value)}
      />
      <input
        type="password"
        placeholder="Clave (4 dígitos)"
        className="border p-2 w-full mb-2"
        maxLength="4"
        onChange={(e) => setClave(e.target.value)}
      />
      <button onClick={handleGenerarCodigo} className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">
        Generar Código
      </button>
      {codigo && <p className="mt-4 text-green-500">Código: {codigo}</p>}
    </div>
  );
};

export default GenerarCodigoRetiro;
