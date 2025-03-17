"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaMoneyBillWave,
  FaLock,
  FaUser,
  FaMobileAlt,
  FaCreditCard,
  FaReceipt,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFingerprint,
  FaShieldAlt,
  FaUniversity,
  FaMoneyCheck,
  FaCopy,
  FaHistory,
} from "react-icons/fa"
import { HiOutlineSparkles } from "react-icons/hi"
import bancolombiaLogo from "../assets/bancolombiaXupcXnequi.png"
import nequiLogo from "../assets/bancolombiaXupcXnequi.png"

const Cajero = () => {
  // Estados para el formulario y el proceso
  const [numero, setNumero] = useState("");
  const [clave, setClave] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "success", "error", "info"
  const [billetesEntregados, setBilletesEntregados] = useState(null);
  const [metodoRetiro, setMetodoRetiro] = useState("bancolombia"); // bancolombia, nequi, tarjeta
  const [step, setStep] = useState(1); // 1: Generar código, 2: Realizar retiro, 3: Recibo
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [datosRetiro, setDatosRetiro] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transacciones, setTransacciones] = useState([]);
  const [copiado, setCopiado] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Generar partículas para el fondo
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Función para copiar el código al portapapeles
  const copiarCodigo = () => {
    if (codigoGenerado) {
      navigator.clipboard.writeText(codigoGenerado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const censorNumber = (num) => {
    const str = String(num);
    if (str.length <= 4) return str;
    return "*".repeat(str.length - 4) + str.slice(-4);
  };

  // Función para generar código (o pasar al paso 2 directamente si es tarjeta)
  const generarCodigo = async () => {
    if (!numero || !clave) {
      setMensaje("Por favor ingresa el número de cuenta y la clave");
      setTipoMensaje("error");
      return;
    }

    setLoading(true);
    setMensaje("");

    if (metodoRetiro === "tarjeta") {
      try {
        // Llamamos al endpoint para obtener los datos de la cuenta usando el número (para tarjetas, sin prefijo)
        const resCuenta = await fetch(`http://localhost:5000/api/cuentas/${numero}`);

        // Si la respuesta no es exitosa, mostramos el error correspondiente
        if (!resCuenta.ok) {
          const errorData = await resCuenta.json();
          setMensaje(errorData.message || "Error al obtener datos de la cuenta");
          setTipoMensaje("error");
          setLoading(false);
          return;
        }

        const dataCuenta = await resCuenta.json();

        if (dataCuenta.cuenta) {
          setDatosPersonales(dataCuenta.cuenta);
          setTransacciones(dataCuenta.cuenta.transacciones || []);
          setMensaje("Datos de tarjeta verificados correctamente");
          setTipoMensaje("success");
          setStep(2);
        } else {
          setMensaje("No se encontraron datos para esa cuenta");
          setTipoMensaje("error");
        }
      } catch (error) {
        console.error("Error al obtener datos de la cuenta:", error);
        setMensaje("Error de conexión con el servidor");
        setTipoMensaje("error");
      } finally {
        setLoading(false);
      }
      return;
    }


    // Para Bancolombia y Nequi, generamos código
    try {
      const res = await fetch("http://localhost:5000/api/cuentas/generar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero, clave }),
      });
      const data = await res.json();
      if (data.codigo) {
        setCodigoGenerado(data.codigo);
        setMensaje(data.message || "Código generado exitosamente");
        setTipoMensaje("success");

        // Obtener los datos reales de la cuenta
        try {
          const resCuenta = await fetch(`http://localhost:5000/api/cuentas/${numero}`);
          const dataCuenta = await resCuenta.json();
          if (resCuenta.ok && dataCuenta.cuenta) {
            setDatosPersonales(dataCuenta.cuenta);
            setTransacciones(dataCuenta.cuenta.transacciones || []);
          }
        } catch (error) {
          console.error("Error al obtener datos de la cuenta:", error);
        }
      } else {
        setMensaje(data.message || "Error al generar código");
        setTipoMensaje("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión con el servidor");
      setTipoMensaje("error");
    } finally {
      setLoading(false);
    }
  };

  // Función para realizar retiro
  const realizarRetiro = async () => {
    // Validar según método de retiro
    if (metodoRetiro === "tarjeta") {
      if (!monto) {
        setMensaje("Por favor ingresa el monto a retirar");
        setTipoMensaje("error");
        return;
      }
    } else {
      if (!codigoIngresado || !monto) {
        setMensaje("Por favor ingresa el código y el monto");
        setTipoMensaje("error");
        return;
      }
    }

    if (isNaN(monto) || Number(monto) <= 0) {
      setMensaje("Por favor ingresa un monto válido");
      setTipoMensaje("error");
      return;
    }

    // Validar que el monto sea un múltiplo de 10,000
    if (Number(monto) < 10000 || Number(monto) % 10000 !== 0) {
      setMensaje("El monto a retirar debe ser un múltiplo de 10.000");
      setTipoMensaje("error");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      // Usamos el mismo endpoint para todos, pero modificamos el payload según el método
      const body =
        metodoRetiro === "tarjeta"
          ? { numero, clave, monto: Number(monto) }
          : { numero, codigo: codigoIngresado, monto: Number(monto) };

      const res = await fetch("http://localhost:5000/api/retiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.message === "Retiro exitoso") {
        setMensaje(data.message);
        setTipoMensaje("success");
        setBilletesEntregados(data.billetesEntregados?.billetes || null);

        // Guardar datos del retiro
        setDatosRetiro({
          numero: data.numero,
          nuevoSaldo: data.nuevoSaldo,
          montoRetirado: Number(monto),
          fecha: new Date().toISOString(),
          billetesEntregados: data.billetesEntregados?.billetes || null,
        });

        // Actualizar datos personales con el nuevo saldo
        if (datosPersonales) {
          setDatosPersonales({
            ...datosPersonales,
            monto: data.nuevoSaldo,
          });
        }

        // Mostrar recibo después de 1 segundo
        setTimeout(() => {
          setShowReceipt(true);
        }, 1000);
      } else {
        setMensaje(data.message || "Error al realizar el retiro");
        setTipoMensaje("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión con el servidor");
      setTipoMensaje("error");
    } finally {
      setLoading(false);
    }
  };

  // Función para ir al siguiente paso
  const nextStep = () => {
    if (step === 1 && metodoRetiro !== "tarjeta" && !codigoGenerado) {
      setMensaje("Primero debes generar un código");
      setTipoMensaje("error");
      return;
    }
    setStep(step + 1);
    setMensaje("");
  };

  // Función para ir al paso anterior
  const prevStep = () => {
    setStep(step - 1);
    setMensaje("");
  };

  // Función para reiniciar el proceso
  const resetProcess = () => {
    setStep(1);
    setCodigoGenerado(null);
    setCodigoIngresado("");
    setMonto("");
    setMensaje("");
    setBilletesEntregados(null);
    setShowReceipt(false);
    setDatosRetiro(null);
  };

  // Función para formatear montos en pesos colombianos
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Función para obtener el logo según el método de retiro
  const getLogoByMethod = () => {
    switch (metodoRetiro) {
      case "bancolombia":
        return bancolombiaLogo;
      case "nequi":
        return nequiLogo;
      default:
        return bancolombiaLogo;
    }
  };

  // Función para obtener el color según el método de retiro
  const getColorByMethod = () => {
    switch (metodoRetiro) {
      case "bancolombia":
        return {
          primary: "from-blue-800 to-blue-900",
          secondary: "bg-yellow-400",
          accent: "text-yellow-400",
          button: "from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950",
          light: "bg-blue-50 border-blue-200 text-blue-800",
        };
      case "nequi":
        return {
          primary: "from-purple-700 to-purple-900",
          secondary: "bg-purple-400",
          accent: "text-purple-400",
          button: "from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900",
          light: "bg-purple-50 border-purple-200 text-purple-800",
        };
      default:
        return {
          primary: "from-gray-700 to-gray-900",
          secondary: "bg-gray-400",
          accent: "text-gray-400",
          button: "from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900",
          light: "bg-gray-50 border-gray-200 text-gray-800",
        };
    }
  };

  const colors = getColorByMethod();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 relative overflow-hidden">
      {/* Partículas animadas */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500 opacity-10 z-0"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            scale: 0,
          }}
          animate={{
            x: `${particle.x + (Math.random() * 10 - 5)}vw`,
            y: `${particle.y + (Math.random() * 10 - 5)}vh`,
            scale: [0, 1, 0],
            opacity: [0, 0.1, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}

      {/* Contenedor principal */}
      <motion.div
        className="max-w-2xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Encabezado */}
        <motion.div
          className={`bg-gradient-to-r ${colors.primary} text-white p-6 rounded-t-2xl shadow-lg flex items-center justify-between`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Cajero Automático</h2>
              <p className="text-sm text-gray-200">Retira dinero de forma rápida y segura</p>
            </div>
          </div>
          {getLogoByMethod() && (
            <motion.img
              src={getLogoByMethod()}
              alt={metodoRetiro}
              className="h-12 object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          )}
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          className="bg-white p-6 rounded-b-2xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Pasos */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

            {[1, 2, 3].map((stepNumber) => (
              <motion.div
                key={stepNumber}
                className="flex flex-col items-center relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * stepNumber, duration: 0.5 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? `${colors.secondary} text-white` : "bg-gray-200 text-gray-500"
                    }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {stepNumber === 1 ? (
                    <FaLock size={16} />
                  ) : stepNumber === 2 ? (
                    <FaMoneyBillWave size={16} />
                  ) : (
                    <FaReceipt size={16} />
                  )}
                </motion.div>
                <p className={`text-xs mt-2 font-medium ${step >= stepNumber ? "text-gray-800" : "text-gray-500"}`}>
                  {stepNumber === 1
                    ? metodoRetiro === "tarjeta"
                      ? "Datos de Tarjeta"
                      : "Generar Código"
                    : stepNumber === 2
                      ? "Realizar Retiro"
                      : "Recibo"}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mensajes */}
          <AnimatePresence>
            {mensaje && (
              <motion.div
                className={`p-4 rounded-lg mb-6 flex items-start ${tipoMensaje === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : tipoMensaje === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-3 mt-0.5">
                  {tipoMensaje === "success" ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : tipoMensaje === "error" ? (
                    <FaExclamationTriangle className="text-red-500" />
                  ) : (
                    <FaShieldAlt className="text-blue-500" />
                  )}
                </div>
                <p>{mensaje}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paso 1: Generar Código o Datos de Tarjeta */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaFingerprint className="mr-2 text-blue-600" />
                  {metodoRetiro === "tarjeta" ? "Datos de Tarjeta" : "Generar Código de Retiro"}
                </h3>

                {/* Selección de método de retiro */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Método de Retiro</label>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center ${metodoRetiro === "bancolombia"
                        ? "bg-blue-50 border-blue-300"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                      onClick={() => setMetodoRetiro("bancolombia")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaUniversity className={metodoRetiro === "bancolombia" ? "text-blue-600" : "text-gray-400"} />
                      <span className="text-sm mt-1">Bancolombia</span>
                    </motion.button>

                    <motion.button
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center ${metodoRetiro === "nequi" ? "bg-purple-50 border-purple-300" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      onClick={() => setMetodoRetiro("nequi")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaMobileAlt className={metodoRetiro === "nequi" ? "text-purple-600" : "text-gray-400"} />
                      <span className="text-sm mt-1">Nequi</span>
                    </motion.button>

                    <motion.button
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center ${metodoRetiro === "tarjeta" ? "bg-gray-50 border-gray-300" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      onClick={() => setMetodoRetiro("tarjeta")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaCreditCard className={metodoRetiro === "tarjeta" ? "text-gray-600" : "text-gray-400"} />
                      <span className="text-sm mt-1">Tarjeta</span>
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {metodoRetiro === "tarjeta" ? "Número de tarjeta" : "Número de cuenta"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {metodoRetiro === "tarjeta" ? (
                          <FaCreditCard className="text-gray-400" />
                        ) : (
                          <FaUser className="text-gray-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        placeholder={
                          metodoRetiro === "tarjeta"
                            ? "Ingresa tu número de tarjeta"
                            : "Ingresa tu número de cuenta"
                        }
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={numero}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          // Solo actualizar si es vacío o contiene solo dígitos
                          if (rawValue === "" || /^[0-9]+$/.test(rawValue)) {
                            if (metodoRetiro === "bancolombia") {
                              // Si ya tiene el prefijo "1", quitarlo para evitar duplicados
                              const sinPrefijo = rawValue.startsWith("1") ? rawValue.slice(1) : rawValue;
                              setNumero("1" + sinPrefijo);
                            } else if (metodoRetiro === "nequi") {
                              const sinPrefijo = rawValue.startsWith("0") ? rawValue.slice(1) : rawValue;
                              setNumero("0" + sinPrefijo);
                            } else if (metodoRetiro === "tarjeta") {
                              setNumero(rawValue);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {metodoRetiro === "tarjeta" ? "PIN (4 dígitos)" : "Clave (4 dígitos)"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="\d*"
                        placeholder={metodoRetiro === "tarjeta" ? "Ingresa tu PIN" : "Ingresa tu clave"}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={clave}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          // Permitir solo dígitos
                          if (newValue === "" || /^[0-9]+$/.test(newValue)) {
                            setClave(newValue);
                          }
                        }}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={generarCodigo}
                    className={`w-full p-3 bg-gradient-to-r ${colors.button} text-white rounded-lg shadow-md flex items-center justify-center`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <>
                        <FaFingerprint className="mr-2" />
                        {metodoRetiro === "tarjeta" ? "Verificar Datos" : "Generar Código"}
                      </>
                    )}
                  </motion.button>
                </div>

                {codigoGenerado && metodoRetiro !== "tarjeta" && (
                  <motion.div
                    className={`mt-6 p-4 ${colors.light} rounded-lg border flex flex-col items-center`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-2">
                      <HiOutlineSparkles className="mr-2 text-yellow-500" />
                      <h4 className="font-semibold">Código Generado</h4>
                    </div>
                    <div className="flex items-center">
                      <motion.div
                        className="text-3xl font-bold tracking-wider my-2 mr-3"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {codigoGenerado}
                      </motion.div>
                      <motion.button
                        onClick={copiarCodigo}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copiado ? <FaCheckCircle className="text-green-500" /> : <FaCopy className="text-gray-500" />}
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Este código es válido por 30 minutos. No lo compartas con nadie.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end">
                <motion.button
                  onClick={nextStep}
                  className={`px-6 py-2 bg-gradient-to-r ${colors.button} text-white rounded-lg shadow-md flex items-center`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={metodoRetiro !== "tarjeta" && !codigoGenerado}
                >
                  Siguiente
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Paso 2: Realizar Retiro */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-600" />
                  Realizar Retiro
                </h3>

                <div className="space-y-4">
                  {metodoRetiro !== "tarjeta" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código de retiro</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaFingerprint className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          placeholder="Ingresa el código de retiro"
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={codigoIngresado}
                          onChange={(e) => {
                            // Solo permitir dígitos y hasta 6 caracteres
                            const value = e.target.value;
                            if (value === "" || /^[0-9]+$/.test(value)) {
                              if (value.length <= 6) {
                                setCodigoIngresado(value);
                              }
                            }
                          }}
                          maxLength={6}
                        />

                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto a retirar</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMoneyBillWave className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        placeholder="Ingresa el monto a retirar"
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={realizarRetiro}
                    className="w-full p-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white rounded-lg shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <>
                        <FaMoneyCheck className="mr-2" />
                        Realizar Retiro
                      </>
                    )}
                  </motion.button>
                </div>

                {billetesEntregados && (
                  <motion.div
                    className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <FaCheckCircle className="mr-2" />
                      Retiro Exitoso
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">Se han entregado los siguientes billetes:</p>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(billetesEntregados).map(([denominacion, cantidad]) => (
                          <motion.div
                            key={denominacion}
                            className="flex justify-between items-center p-2 border-b border-gray-100"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: Number.parseInt(denominacion) / 100000 }}
                          >
                            <div className="flex items-center">
                              <FaMoneyBillWave className="mr-2 text-green-500" />
                              <span className="font-medium">{denominacion}k</span>
                            </div>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">{cantidad}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between">
                <motion.button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-2" />
                  Anterior
                </motion.button>

                <motion.button
                  onClick={nextStep}
                  className={`px-6 py-2 bg-gradient-to-r ${colors.button} text-white rounded-lg shadow-md flex items-center`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!billetesEntregados}
                >
                  Siguiente
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Paso 3: Recibo */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaReceipt className="mr-2 text-blue-600" />
                  Recibo de Transacción
                </h3>

                <AnimatePresence>
                  {showReceipt && datosRetiro && datosPersonales && (
                    <motion.div
                      className="border rounded-lg overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Encabezado del recibo */}
                      <div className={`bg-gradient-to-r ${colors.primary} text-white p-4`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-lg">Comprobante de Retiro</h4>
                            <p className="text-sm text-gray-200">
                              {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                          {getLogoByMethod() && (
                            <img
                              src={getLogoByMethod() || "/placeholder.svg"}
                              alt={metodoRetiro}
                              className="h-10 object-contain"
                            />
                          )}
                        </div>
                      </div>

                      {/* Datos personales */}
                      <div className="p-4 border-b">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <FaUser className="mr-2 text-gray-500" />
                          Datos Personales
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-medium">{datosPersonales.nombre}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Cédula</p>
                            <p className="font-medium">{datosPersonales.cedula}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">{datosPersonales.telefono}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tipo de Cuenta</p>
                            <p className="font-medium capitalize">{datosPersonales.tipo}</p>
                          </div>
                        </div>
                      </div>

                      {/* Detalles del retiro */}
                      <div className="p-4 border-b">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <FaMoneyBillWave className="mr-2 text-gray-500" />
                          Detalles del Retiro
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Número de Cuenta:</span>
                            <span className="font-medium">{censorNumber(datosRetiro.numero)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monto Retirado:</span>
                            <span className="font-medium text-red-600">
                              -{formatCurrency(datosRetiro.montoRetirado)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nuevo Saldo:</span>
                            <span className="font-medium">{formatCurrency(datosRetiro.nuevoSaldo)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fecha y Hora:</span>
                            <span className="font-medium">{new Date(datosRetiro.fecha).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Billetes entregados */}
                      {datosRetiro.billetesEntregados && (
                        <div className="p-4">
                          <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                            <FaMoneyCheck className="mr-2 text-gray-500" />
                            Billetes Entregados
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(datosRetiro.billetesEntregados).map(([denominacion, cantidad]) => (
                              <motion.div
                                key={denominacion}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: Number.parseInt(denominacion) / 100000 }}
                              >
                                <div className="flex items-center">
                                  <FaMoneyBillWave className={`mr-2 ${colors.accent}`} />
                                  <span className="font-medium">{denominacion}k</span>
                                </div>
                                <span className={`${colors.light} px-2 py-1 rounded-md text-sm`}>{cantidad}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pie del recibo */}
                      <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                        <p>Gracias por utilizar nuestro servicio</p>
                        <p className="mt-1">
                          ID de Transacción: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showReceipt && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <motion.div
                      className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                    <p className="text-gray-600">Generando recibo...</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <motion.button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-2" />
                  Anterior
                </motion.button>

                <motion.button
                  onClick={resetProcess}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white rounded-lg shadow-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Nueva Transacción
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Cajero

