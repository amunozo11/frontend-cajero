import React, { useState } from "react";

const Retirar = () => {
  const [numero, setNumero] = useState("");
  const [codigo, setCodigo] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRetiro = async () => {
    const res = await fetch("https://backend-cajero.onrender.com/api/cuentas/retirar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero, codigo, monto }),
    });

    const data = await res.json();
    setMensaje(data.message);

    if (res.ok) {
      alert("Retiro exitoso, nuevo saldo: " + data.nuevoSaldo);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Retirar Dinero</h2>
      <input
        type="text"
        placeholder="Número de cuenta"
        className="border p-2 w-full mb-2"
        onChange={(e) => setNumero(e.target.value)}
      />
      <input
        type="text"
        placeholder="Código de retiro"
        className="border p-2 w-full mb-2"
        onChange={(e) => setCodigo(e.target.value)}
      />
      <input
        type="number"
        placeholder="Monto a retirar"
        className="border p-2 w-full mb-2"
        onChange={(e) => setMonto(e.target.value)}
      />
      <button onClick={handleRetiro} className="bg-green-500 text-white py-2 px-4 rounded-md w-full">
        Retirar
      </button>
      {mensaje && <p className="mt-4">{mensaje}</p>}
    </div>
  );
};

export default Retirar;
