import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/card"
import Input from "../components/ui/Input"
import bancolombiaLogoWhite from "../assets/bancolombia-logo-white.png"
import Header from "../components/Header"
import {
  FaMoneyBillWave,
  FaLock,
  FaCreditCard,
  FaBuilding,
  FaChartLine,
  FaArrowRight,
  FaTimes,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa"

export default function AuthBancolombia() {
  const [formType, setFormType] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [particles, setParticles] = useState([])
  const navigate = useNavigate()

  // Estados para los campos del formulario
  const [fullName, setFullName] = useState("")
  const [documentOrAccount, setDocumentOrAccount] = useState("")
  const [password, setPassword] = useState("")
  // Teléfono: se debe ingresar 10 dígitos para registrarse y se usará para iniciar sesión
  const [telefono, setTelefono] = useState("")

  // Calculamos la fecha máxima permitida (hace 18 años)
  const today = new Date()
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
  const maxDateStr = maxDate.toISOString().split("T")[0]
  const [fechaNacimiento, setFechaNacimiento] = useState("")

  // Tipo de cuenta para registro
  const [tipo, setTipo] = useState("bancolombia")
  const [monto, setMonto] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Generar partículas de fondo
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 3,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  const floatingFeatures = [
    {
      icon: <FaMoneyBillWave size={28} className="text-bancolombia_oscuro" />,
      text: "Transferencias rápidas y seguras",
      position: "left-[5%] top-[30%]",
      delay: 0.2,
    },
    {
      icon: <FaLock size={28} className="text-bancolombia_oscuro" />,
      text: "Tu dinero siempre protegido",
      position: "right-[15%] top-[25%]",
      delay: 0.4,
    },
    {
      icon: <FaCreditCard size={28} className="text-bancolombia_oscuro" />,
      text: "Solicita tu tarjeta de débito",
      position: "left-[8%] bottom-[45%]",
      delay: 0.6,
    },
    {
      icon: <FaBuilding size={28} className="text-bancolombia_oscuro" />,
      text: "Accede a todos nuestros servicios",
      position: "right-[12%] bottom-[45%]",
      delay: 0.8,
    },
    {
      icon: <FaChartLine size={28} className="text-bancolombia_oscuro" />,
      text: "Inversiones inteligentes",
      position: "left-[15%] top-[15%]",
      delay: 1.0,
    },
  ]

  const handleCloseForm = () => {
    setFormType(null)
    setError("")
    setFullName("")
    setDocumentOrAccount("")
    setPassword("")
  }

  // Función para enviar el formulario de login o registro
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const endpoint =
      formType === "login"
        ? "http://localhost:5000/api/cuentas/login"
        : "http://localhost:5000/api/cuentas/"

    // En login se utiliza el teléfono ingresado y se le antepone "1"
    const payload =
      formType === "login"
        ? { telefono, clave: password, tipo: "bancolombia" }
        : {
            nombre: fullName,
            cedula: documentOrAccount,
            telefono, // se envía el teléfono sin prefijo
            monto: Number(monto),
            fechaNacimiento,
            clave: password,
            tipo: "bancolombia",
          }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Error en la autenticación")
        setLoading(false)
        return
      }

      if (formType === "login") {
        localStorage.setItem("token", data.token || "dummy-token")
        navigate("/bancolombia-dashboard")
      } else {
        // Registro exitoso: limpiamos campos para que el formulario de login aparezca vacío
        setTelefono("")
        setPassword("")
        setFormType("login")
      }
    } catch (err) {
      console.error(err)
      setError("Error en la conexión con el servidor")
    }
    setLoading(false)
  }

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-100 z-0"></div>

      {/* Partículas animadas */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-bancolombia_oscuro opacity-10 z-0"
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header */}
        <Header />

        {/* Sección del logo con efecto de resplandor */}
        <motion.div
          className="relative mt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 rounded-full bg-yellow-500 blur-xl opacity-30 animate-pulse"></div>
          <motion.div
            className="relative bg-white p-6 pb-8 px-10 rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img
              src={bancolombiaLogoWhite || "/placeholder.svg"}
              alt="Bancolombia"
              className="h-28 object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Características flotantes */}
        {floatingFeatures.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} z-10`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: item.delay,
              duration: 0.5,
              type: "spring",
            }}
          >
            <motion.div
              className="bg-white p-4 rounded-2xl shadow-lg cursor-pointer backdrop-blur-sm border border-yellow-400/30"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              animate={{ y: [0, 8, 0] }}
              transition={{
                y: { repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 400, damping: 10 },
              }}
              onMouseEnter={() => setTooltip(item.text)}
              onMouseLeave={() => setTooltip(null)}
            >
              {item.icon}
              <AnimatePresence>
                {tooltip === item.text && (
                  <motion.div
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-bancolombia_oscuro text-sm p-2 rounded-lg shadow-xl whitespace-nowrap z-20"
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

        {/* Contenido principal */}
        <motion.div
          className="text-center flex flex-col items-center mt-8 mb-16 max-w-2xl mx-auto z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <h2 className="text-4xl font-bold mb-4 text-bancolombia_oscuro">
              <span className="inline-block">Más que un banco,</span>
              <motion.span
                className="block mt-1 text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
              >
                TU ALIADO FINANCIERO
              </motion.span>
            </h2>
          </motion.div>

          <motion.p
            className="text-xl text-bancolombia_oscuro/80 mb-12 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Maneja tu dinero con seguridad y confianza. Bancolombia te acompaña en cada paso de tu vida financiera.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button
              onClick={() => setFormType("login")}
              className="relative overflow-hidden bg-bancolombia_oscuro text-white font-semibold px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center">
                Iniciar Sesión
                <FaArrowRight className="ml-2" />
              </span>
              <motion.span className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button
              onClick={() => setFormType("register")}
              className="relative overflow-hidden bg-yellow-400 text-bancolombia_oscuro font-semibold px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-yellow-500"
            >
              <span className="relative z-10 flex items-center justify-center">
                Crear Cuenta
                <FaArrowRight className="ml-2" />
              </span>
              <motion.span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Modal del formulario */}
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
                <Card className="bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
                  <div className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 p-4 relative">
                    <button
                      onClick={handleCloseForm}
                      className="absolute right-4 top-4 text-white hover:text-yellow-200 transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                    <div className="flex items-center mb-2">
                      <img
                        src={bancolombiaLogoWhite || "/placeholder.svg"}
                        alt="Bancolombia"
                        className="h-12 mr-3"
                      />
                      <h2 className="text-2xl font-bold text-white">
                        {formType === "login" ? "Bienvenido de nuevo" : "Únete a Bancolombia"}
                      </h2>
                    </div>
                    <p className="text-yellow-100 text-sm">
                      {formType === "login"
                        ? "Ingresa tus datos para acceder a tu cuenta"
                        : "Crea tu cuenta en segundos y comienza a disfrutar"}
                    </p>
                  </div>
                  <CardContent className="p-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      {formType === "register" ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* Columna 1 */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 block">
                                Nombre Completo
                              </label>
                              <Input
                                type="text"
                                placeholder="Nombre Completo"
                                className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 block">
                                Número de documento
                              </label>
                              <Input
                                type="text"
                                placeholder="Ej: 1234567890"
                                className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                                value={documentOrAccount}
                                onChange={(e) => setDocumentOrAccount(e.target.value)}
                              />
                            </div>
                            {/* Columna 2 */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 block">
                                Teléfono
                              </label>
                              <Input
                                type="text"
                                placeholder="Ingresa tu teléfono (10 dígitos)"
                                className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 block">
                                Monto Inicial
                              </label>
                              <Input
                                type="number"
                                placeholder="Ingresa el monto inicial"
                                className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 block">
                                Fecha de Nacimiento
                              </label>
                              <Input
                                type="date"
                                className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                max={maxDateStr}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 block">
                                Tipo de Cuenta
                              </label>
                              <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all p-2"
                              >
                                <option value="bancolombia">Bancolombia</option>
                              </select>
                            </div>
                          </div>
                          {/* Campo de Clave, ocupando toda la fila */}
                          <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-gray-700 block">
                              Clave
                            </label>
                            <Input
                              type="password"
                              placeholder="Ingresa tu clave"
                              className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </>
                      ) : (
                        /* Formulario de Login: Utilizamos el teléfono */
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block mt-4">
                              Teléfono
                            </label>
                            <Input
                              type="text"
                              placeholder="Ej: 3011234567"
                              className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                              value={telefono}
                              onChange={(e) => setTelefono(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">
                              Clave
                            </label>
                            <Input
                              type="password"
                              placeholder="Ingresa tu clave"
                              className="w-full rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      {error && <p className="text-red-500 text-sm">{error}</p>}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-bancolombia_oscuro to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        {loading ? "Procesando..." : formType === "login" ? "Ingresar" : "Crear Cuenta"}
                      </Button>

                      {formType === "login" ? (
                        <p className="text-center text-sm text-gray-600">
                          ¿No tienes cuenta?{" "}
                          <button
                            type="button"
                            onClick={() => setFormType("register")}
                            className="text-blue-600 hover:text-blue-800 font-medium"
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
                            className="text-blue-600 hover:text-blue-800 font-medium"
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
          className="rounded-3xl left-0 right-0 bg-gradient-to-r from-bancolombia_oscuro/90 to-blue-800/90 backdrop-blur-md text-white text-center text-sm z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="container mx-auto">
            <p>&copy; Bancolombia 2025 | Universidad Popular del César | Alexander Muñoz Olivo</p>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
