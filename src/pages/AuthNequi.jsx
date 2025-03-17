import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/card";
import Input from "../components/ui/Input";
import nequiLogo from "../assets/nequi-logo.png";
import Header from "../components/Header";
import { 
  FaMoneyBillWave, 
  FaMobileAlt, 
  FaLock, 
  FaCreditCard, 
  FaFingerprint, 
  FaArrowRight, 
  FaTimes 
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

export default function AuthNequi() {
  // Modo del formulario: "login" o "register"
  const [formType, setFormType] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [fullName, setFullName] = useState("");
  const [documentOrAccount, setDocumentOrAccount] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [monto, setMonto] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generar partículas para el fondo
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Floating features (opcional)
  const floatingFeatures = [
    {
      icon: <FaMoneyBillWave size={28} className="text-white" />,
      text: "Envía dinero fácil y sin costo",
      position: "left-[5%] top-[40%]",
      delay: 0.2,
    },
    {
      icon: <FaMobileAlt size={28} className="text-white" />,
      text: "Recarga tu saldo en segundos",
      position: "right-[15%] top-[25%]",
      delay: 0.4,
    },
    {
      icon: <FaLock size={28} className="text-white" />,
      text: "Seguridad biométrica avanzada",
      position: "left-[8%] bottom-[15%]",
      delay: 0.6,
    },
    {
      icon: <FaCreditCard size={28} className="text-white" />,
      text: "Tarjeta virtual sin comisiones",
      position: "right-[12%] bottom-[30%]",
      delay: 0.8,
    },
    {
      icon: <FaFingerprint size={28} className="text-white" />,
      text: "Autenticación instantánea",
      position: "left-[15%] top-[15%]",
      delay: 1.0,
    },
  ];

  // Resetea los campos al cambiar entre modos
  useEffect(() => {
    setFullName("");
    setDocumentOrAccount("");
    setFechaNacimiento("");
    setTelefono("");
    setMonto("");
    setPassword("");
    setError("");
  }, [formType]);

  const handleCloseForm = () => {
    setFormType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Endpoint según acción: login o registro
    const endpoint =
      formType === "login"
        ? "http://localhost:5000/api/cuentas/login"
        : "http://localhost:5000/api/cuentas/";

    // Para Nequi:
    // - En login se envía: { telefono, clave, tipo: "nequi" } 
    //   (El backend antepone "1" o "0" según se decida; en este ejemplo, para Nequi usaremos "0")
    // - En registro se envían todos los campos, con tipo "nequi" y el número de cuenta se forma concatenando "0" al teléfono.
    const payload =
      formType === "login"
        ? {
            telefono,
            clave: password,
            tipo: "nequi",
          }
        : {
            nombre: fullName,
            cedula: documentOrAccount,
            fechaNacimiento,
            telefono,
            monto: Number(monto),
            clave: password,
            tipo: "nequi",
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error en la autenticación");
        setLoading(false);
        return;
      }

      if (formType === "login") {
        localStorage.setItem("token", data.token || "dummy-token");
        navigate("/nequi-dashboard");
      } else {
        // Registro exitoso: cambia a modo login y limpia campos sensibles
        setTelefono("");
        setPassword("");
        setFormType("login");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión con el servidor");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6a11cb] via-[#8e44ad] to-[#2c3e50] z-0"></div>

      {/* Partículas animadas */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-20 z-0"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            scale: 0,
          }}
          animate={{
            x: `${particle.x + (Math.random() * 10 - 5)}vw`,
            y: `${particle.y + (Math.random() * 10 - 5)}vh`,
            scale: [0, 1, 0],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            repeat: Infinity,
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 flex flex-col items-center">
        {/* Header global */}
        <Header />

        {/* Sección del logo con efecto de glow */}
        <motion.div
          className="relative mt-8 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 rounded-full bg-nequi_claro blur-xl opacity-30 animate-pulse"></div>
          <motion.div
            className="relative bg-gradient-to-br from-nequi_claro to-nequi_claro-400 p-6 hover:bg-nequi_claro rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={nequiLogo || "/placeholder.svg"} alt="Nequi" className="w-32 h-32 object-contain" />
          </motion.div>
        </motion.div>

        {/* Floating features */}
        {floatingFeatures.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} z-10`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: item.delay, duration: 0.5, type: "spring" }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-lg cursor-pointer backdrop-blur-sm border border-purple-400/30"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)" }}
              animate={{ y: [0, 8, 0] }}
              transition={{
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 400, damping: 10 },
              }}
              onMouseEnter={() => setTooltip(item.text)}
              onMouseLeave={() => setTooltip(null)}
            >
              {item.icon}
              <AnimatePresence>
                {tooltip === item.text && (
                  <motion.div
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-purple-900 text-sm p-2 rounded-lg shadow-xl whitespace-nowrap z-20"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}

        {/* Main Content */}
        <motion.div
          className="text-center flex flex-col items-center mb-16 max-w-2xl mx-auto z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <h2 className="text-4xl font-bold mb-4 text-white">
              <span className="inline-block">
                La nueva era{" "}
                <motion.span
                  className="inline-block ml-2 text-yellow-300"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                  <HiOutlineSparkles className="inline mb-1" />
                </motion.span>
              </span>
              <span className="block mt-1">de las finanzas digitales</span>
            </h2>
          </motion.div>
          
          <motion.p
            className="text-xl text-purple-100 mb-12 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Envía, guarda y retira con Nequi. Tu dinero siempre disponible, cuando y donde lo necesites.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button
              onClick={() => setFormType("login")}
              className="relative overflow-hidden bg-gradient-to-r from-purple-400 to-purple-600 hover:bg-nequi_claro hover:text-nequi_claro text-white font-semibold px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-nequi_claro hover:border-nequi_button"
              variant="nequi"
            >
              <span className="relative z-10 flex items-center justify-center">
                Iniciar Sesión
                <FaArrowRight className="ml-2" />
              </span>
              <motion.span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button
              onClick={() => setFormType("register")}
              className="relative overflow-hidden bg-white text-purple-700 hover:text-purple-900 font-semibold px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-purple-300 hover:border-nequi_button"
              variant="nequi"
            >
              <span className="relative z-10 flex items-center justify-center">
                Crear Cuenta
                <FaArrowRight className="ml-2" />
              </span>
              <motion.span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Form Modal */}
        <AnimatePresence>
          {formType && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseForm}
            >
              <motion.div
                className="w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 relative">
                    <button
                      onClick={handleCloseForm}
                      className="absolute right-4 top-4 text-white hover:text-purple-200 transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                    <div className="flex items-center mb-2">
                      <img src={nequiLogo || "/placeholder.svg"} alt="Nequi" className="w-12 h-12 mr-3" />
                      <h2 className="text-2xl font-bold text-white">
                        {formType === "login" ? "Bienvenido de nuevo" : "Únete a Nequi"}
                      </h2>
                    </div>
                    <p className="text-purple-200 text-sm">
                      {formType === "login"
                        ? "Ingresa tus datos para acceder a tu cuenta"
                        : "Crea tu cuenta en segundos y comienza a disfrutar"}
                    </p>
                  </div>
                  <CardContent className="p-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      {formType === "register" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Nombre Completo</label>
                            <Input
                              type="text"
                              placeholder="Ingresa tu nombre completo"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full rounded-xl border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Número de documento</label>
                            <Input
                              type="text"
                              placeholder="Ej: 1234567890"
                              value={documentOrAccount}
                              onChange={(e) => setDocumentOrAccount(e.target.value)}
                              className="w-full rounded-xl border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Fecha de nacimiento</label>
                            <Input
                              type="date"
                              value={fechaNacimiento}
                              onChange={(e) => setFechaNacimiento(e.target.value)}
                              className="w-full rounded-xl border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Monto inicial</label>
                            <Input
                              type="number"
                              placeholder="Ingresa el monto inicial"
                              value={monto}
                              onChange={(e) => setMonto(e.target.value)}
                              className="w-full rounded-xl border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Número de Teléfono</label>
                        <Input
                          type="tel"
                          placeholder="Ej: 3001234567"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          className="w-full rounded-xl border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium text-gray-700 block">Clave</label>
                          {formType === "login" && (
                            <a href="#" className="text-sm text-purple-600 hover:text-purple-800">
                              ¿Olvidaste tu clave?
                            </a>
                          )}
                        </div>
                        <Input
                          type="password"
                          placeholder="Ingresa tu clave"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                        />
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                        {formType === "login" ? "Ingresar" : "Crear Cuenta"}
                      </Button>

                      {formType === "login" ? (
                        <p className="text-center text-sm text-gray-600">
                          ¿No tienes cuenta?{" "}
                          <button
                            type="button"
                            onClick={() => setFormType("register")}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Regístrate
                          </button>
                        </p>
                      ) : (
                        <p className="text-center text-sm text-gray-600">
                          ¿Ya tienes cuenta?{" "}
                          <button
                            type="button"
                            onClick={() => setFormType("login")}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Inicia sesión
                          </button>
                        </p>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="rounded-3xl left-0 right-0 bg-nequi_claro backdrop-blur-md text-nequi_oscuro text-center text-sm z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="container mx-auto">
            <p>&copy; Nequi 2025 | Universidad Popular del César | Alexander Muñoz Olivo</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
