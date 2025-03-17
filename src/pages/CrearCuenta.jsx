import React, { useState } from "react";

const CrearCuenta = () => {
  const [tipoCuenta, setTipoCuenta] = useState("nequi");
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    monto: "",
    fechaNacimiento: "",
    clave: "",
  });
  const [tarjetaInfo, setTarjetaInfo] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTipoCuentaChange = (e) => {
    setTipoCuenta(e.target.value);
    setFormData({
      nombre: "",
      cedula: "",
      telefono: "",
      monto: "",
      fechaNacimiento: "",
      clave: "",
    });
    setTarjetaInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cuenta = {
      ...formData,
      tipo: tipoCuenta,
    };

    const res = await fetch("http://localhost:5000/api/cuentas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuenta),
    });

    const data = await res.json();
    alert(data.message);

    if (data.cuenta.tipo === "tarjeta") {
      setTarjetaInfo({
        numero: data.cuenta.numeroTarjeta,
        cvv: data.cuenta.cvv,
        vencimiento: data.cuenta.fechaVencimiento,
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Crear Cuenta</h2>
      <select className="border p-2 mb-4 w-full" value={tipoCuenta} onChange={handleTipoCuentaChange}>
        <option value="nequi">Nequi</option>
        <option value="bancolombia">Bancolombia</option>
        <option value="tarjeta">Tarjeta Débito</option>
      </select>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombre" placeholder="Nombre" required className="border p-2 w-full" onChange={handleChange} />
        <input type="text" name="cedula" placeholder="Cédula" required className="border p-2 w-full" onChange={handleChange} />
        <input type="date" name="fechaNacimiento" required className="border p-2 w-full" onChange={handleChange} />

        {tipoCuenta !== "tarjeta" && (
          <input type="tel" name="telefono" placeholder="Teléfono (10 dígitos)" required className="border p-2 w-full" onChange={handleChange} />
        )}

        <input type="number" name="monto" placeholder="Monto inicial" required className="border p-2 w-full" onChange={handleChange} />
        <input type="number" name="clave" placeholder="Clave (4 dígitos)" required className="border p-2 w-full" onChange={handleChange} />

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">Crear Cuenta</button>
      </form>

      {tarjetaInfo && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p><strong>Número de Tarjeta:</strong> {tarjetaInfo.numero}</p>
          <p><strong>CVV:</strong> {tarjetaInfo.cvv}</p>
          <p><strong>Fecha de Vencimiento:</strong> {tarjetaInfo.vencimiento}</p>
        </div>
      )}
    </div>
  );
};

export default CrearCuenta;
