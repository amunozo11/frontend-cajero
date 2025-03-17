"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { FaUser, FaLock, FaCreditCard, FaExclamationTriangle, FaSpinner, FaCheck } from "react-icons/fa"

const LoginTarjeta = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    numero: "",
    clave: "",
    tipo: "tarjeta",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    // Validación específica para la clave (solo números y máximo 4 dígitos)
    if (name === "clave" && !/^\d*$/.test(value)) {
      return
    }

    if (name === "clave" && value.length > 4) {
      return
    }

    // Validación para número de tarjeta (solo números)
    if (name === "numero" && !/^\d*$/.test(value)) {
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.numero) {
      setError("El número de tarjeta es obligatorio")
      return
    }

    if (!formData.clave || formData.clave.length !== 4) {
      setError("La clave debe ser un número de 4 dígitos")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://backend-cajero.onrender.com/api/cuentas/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión")
      }

      // Guardar token en localStorage
      localStorage.setItem("token", data.token)

      // Mostrar mensaje de éxito
      setSuccess(true)

      // Redirigir al dashboard después de un breve retraso
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Error:", error)
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value) => {
    if (!value) return ""
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Encabezado */}
        <motion.div
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-t-2xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <FaCreditCard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Acceso a Tarjeta</h2>
              <p className="text-sm text-gray-200">Ingrese sus credenciales para acceder</p>
            </div>
          </div>
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          className="bg-white p-6 rounded-b-2xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Mensajes de error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="p-4 rounded-lg mb-6 flex items-start bg-red-50 text-red-800 border border-red-200"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-3 mt-0.5">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensaje de éxito */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="p-4 rounded-lg mb-6 flex items-start bg-green-50 text-green-800 border border-green-200"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-3 mt-0.5">
                  <FaCheck className="text-green-500" />
                </div>
                <p>Inicio de sesión exitoso. Redirigiendo...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCreditCard className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder="Ingrese su número de tarjeta"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clave (4 dígitos)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="clave"
                    value={formData.clave}
                    onChange={handleChange}
                    placeholder="Ingrese su clave de 4 dígitos"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    required
                    maxLength={4}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full p-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white rounded-lg shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || success}
              >
                {loading ? (
                  <div className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Procesando...</span>
                  </div>
                ) : success ? (
                  <div className="flex items-center">
                    <FaCheck className="mr-2" />
                    <span>Acceso Exitoso</span>
                  </div>
                ) : (
                  <>
                    <FaUser className="mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </motion.button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tiene una tarjeta?{" "}
                <motion.button
                  type="button"
                  onClick={() => navigate("/auth/tarjeta")}
                  className="text-gray-800 font-medium hover:underline"
                  whileHover={{ scale: 1.05 }}
                >
                  Crear una nueva
                </motion.button>
              </p>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginTarjeta

