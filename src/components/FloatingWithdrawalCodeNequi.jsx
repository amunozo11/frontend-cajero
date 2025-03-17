import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaCopy, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt, FaClock, FaFingerprint } from "react-icons/fa"
import { HiOutlineSparkles } from "react-icons/hi"

const FloatingWithdrawalCodeNequi = ({ code, visible, onClose, amount }) => {
  const [isCodeVisible, setIsCodeVisible] = useState(true)
  const [codeCopied, setCodeCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [particles, setParticles] = useState([])

  // Generate particles for background effect
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  // Timer for code expiration
  useEffect(() => {
    if (!visible) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [visible])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate percentage of time remaining for progress bar
  const timePercentage = (timeLeft / (30 * 60)) * 100

  if (!visible) return null

  const toggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50 max-w-sm w-full"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="relative">
          {/* Glow effect behind the card */}
          <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-2xl"></div>

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-400/30"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 relative overflow-hidden">
              {/* Animated particles in header */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full bg-white opacity-20"
                  initial={{
                    x: `${particle.x}%`,
                    y: `${particle.y}%`,
                    scale: 0,
                  }}
                  animate={{
                    x: `${particle.x + (Math.random() * 10 - 5)}%`,
                    y: `${particle.y + (Math.random() * 10 - 5)}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 0.2, 0],
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

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center">
                  <FaFingerprint className="mr-2 h-5 w-5 text-purple-300" />
                  <h2 className="text-lg font-bold">Código de retiro</h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors rounded-full p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes size={20} />
                </motion.button>
              </div>

              {/* Timer bar */}
              <div className="mt-3 bg-white/20 h-1.5 rounded-full overflow-hidden relative z-10">
                <motion.div
                  className="h-full bg-purple-300"
                  initial={{ width: "100%" }}
                  animate={{ width: `${timePercentage}%` }}
                  transition={{ duration: 1 }}
                ></motion.div>
              </div>
            </div>

            <div className="p-5">
              {/* Amount */}
              {amount && (
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Monto a retirar</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(amount)}
                  </p>
                </div>
              )}

              {/* Code display */}
              <motion.div
                className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 mb-4"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center">
                  <motion.div
                    className="text-3xl font-mono tracking-[0.3em] text-purple-800 font-bold"
                    initial={false}
                    animate={isCodeVisible ? { opacity: 1 } : { opacity: 0.3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCodeVisible ? code : "••••••"}
                  </motion.div>
                  <motion.button
                    onClick={copyToClipboard}
                    className="bg-white p-2 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      {codeCopied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaCheckCircle className="h-5 w-5 text-green-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaCopy className="h-5 w-5 text-purple-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <div className="flex items-center justify-between mt-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-1 h-4 w-4" />
                    <span>Expira en: {formatTime(timeLeft)}</span>
                  </div>
                  <motion.button
                    onClick={toggleCodeVisibility}
                    className="text-purple-700 hover:text-purple-900 font-medium flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCodeVisible ? (
                      <>
                        <FaEyeSlash className="mr-1 h-4 w-4" />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <FaEye className="mr-1 h-4 w-4" />
                        <span>Mostrar</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2.5 px-4 rounded-lg shadow flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaCopy className="mr-2 h-4 w-4" />
                  Copiar código
                </motion.button>

                <motion.button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg shadow flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Cerrar
                </motion.button>
              </div>

              {/* Security note with sparkle animation */}
              <div className="mt-4 text-xs text-gray-500 flex items-start">
                <FaShieldAlt className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                <p className="flex items-center">
                  Este código es de un solo uso y es personal. No lo compartas con nadie.
                  <motion.span
                    className="inline-block ml-1 text-purple-500"
                    animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
                  >
                    <HiOutlineSparkles className="inline h-3 w-3" />
                  </motion.span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingWithdrawalCodeNequi

