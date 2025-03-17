import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/card"
import Input from "../components/ui/Input"
import Header from "../components/Header"
import FloatingWithdrawalCode from "../components/FloatingWithdrawalCode";
import bancolombiaLogoWhite from "../assets/bancolombia-logo-white.png"
import {
    FaUser,
    FaMoneyBillWave,
    FaPhoneAlt,
    FaSignOutAlt,
    FaHistory,
    FaCreditCard,
    FaChartLine,
    FaShieldAlt,
    FaArrowRight,
    FaArrowLeft,
    FaTimes,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCopy,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa"

export default function Dashboard() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        nombre: "",
        telefono: "",
        monto: 0,
        tipo: "",
        numero: "",
    })

    // Estados para el modal de retiro (ahora solo se pide la contraseña)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawStep, setWithdrawStep] = useState(1);
    // Ya no se usa withdrawAmount, ya que el monto ya está en la cuenta
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [securityCode, setSecurityCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [codeCopied, setCodeCopied] = useState(false);

    // Estado para controlar la visibilidad del panel flotante
    const [showFloatingCode, setShowFloatingCode] = useState(false);

    // Formato de moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    // Fetch del perfil del usuario
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/")
                return
            }
            try {
                const res = await fetch("https://backend-cajero.onrender.com/api/cuentas/profile", {
                    headers: { "Authorization": "Bearer " + token },
                })
                const data = await res.json()
                if (res.ok) {
                    setUserData(data.cuenta)
                } else {
                    console.error("Error al obtener perfil:", data.message)
                }
            } catch (err) {
                console.error("Error en fetch profile:", err)
            }
        }
        fetchProfile()
    }, [navigate])

    // Agrega un useEffect para cargar las transacciones al montar el Dashboard
    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/")
                return;
            }
            try {
                const res = await fetch("https://backend-cajero.onrender.com/api/cuentas/transactions", {
                    headers: { "Authorization": "Bearer " + token },
                });
                const data = await res.json();
                if (res.ok) {
                    setRecentTransactions(data.transactions);
                } else {
                    console.error("Error al obtener transacciones:", data.message);
                }
            } catch (error) {
                console.error("Error en fetch de transacciones:", error);
            }
        };
        fetchTransactions();
    }, [navigate]);

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    // Función para iniciar el proceso de retiro
    const handleWithdraw = () => {
        setShowWithdrawModal(true)
        setWithdrawStep(1)
        setPassword("")
        setSecurityCode("")
        setError("")
        setSuccess(false)
    }

    // Función para cerrar el modal de retiro
    const handleCloseModal = () => {
        setShowWithdrawModal(false)
    }

    // En este flujo, solo se solicita la clave. Si es válida, se genera el código.
    const handleNextStep = () => {
        if (withdrawStep === 1) {
            if (!password) {
                setError("Por favor ingresa tu clave")
                return
            }
            // Generamos el código de seguridad
            generateSecurityCode()
        }
    }

    // Función para volver al paso anterior
    const handlePrevStep = () => {
        setWithdrawStep(withdrawStep - 1)
        setError("")
    }

    // Función para generar el código de seguridad (llamada al backend)
    const generateSecurityCode = async () => {
        setLoading(true)
        setError("")
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("https://backend-cajero.onrender.com/api/cuentas/generar-codigo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                // El backend espera { numero, clave }
                body: JSON.stringify({ numero: userData.numero, clave: password }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || "Error al generar el código de seguridad")
                setLoading(false)
                return
            }
            setSecurityCode(data.codigo)
            setWithdrawStep(2)
            setSuccess(true)
            // Aquí podrías agregar lógica adicional si el retiro afecta el saldo o genera una transacción
            setShowFloatingCode(true);
        } catch (err) {
            console.error(err)
            setError("Error al generar el código de seguridad")
        } finally {
            setLoading(false)
        }
    }



    // Función para copiar el código al portapapeles
    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(securityCode)
        setCodeCopied(true)
        setTimeout(() => setCodeCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />
            <FloatingWithdrawalCode
                code={securityCode}
                visible={showFloatingCode}
                onClose={() => setShowFloatingCode(false)}
            />
            {/* Header */}
            <header className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 pt-12 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={bancolombiaLogoWhite || "/placeholder.svg"} alt="Bancolombia" className="h-10 mr-3" />
                        <h1 className="text-xl font-bold hidden md:block">Bancolombia Virtual</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="text-right mr-4 hidden sm:block">
                            <p className="text-sm text-yellow-100">Bienvenido</p>
                            <p className="font-medium">{userData.nombre.split(" ")[0]}</p>
                        </div>
                        <Button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
                            <FaSignOutAlt className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - User Info */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-yellow-400">
                                <div className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 p-6 text-white">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-white/20 p-3 rounded-full mr-4">
                                            <FaUser className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{userData.nombre}</h2>
                                            <p className="text-sm text-yellow-100">Cliente Bancolombia</p>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-6 p-2">
                                        <div>
                                            <h3 className="text-sm text-gray-500">Número de cuenta</h3>
                                            <p className="text-lg font-medium text-bancolombia_oscuro flex items-center">
                                                {userData.numero}
                                                <button
                                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                                    onClick={() => navigator.clipboard.writeText(userData.numero)}
                                                >
                                                    <FaCopy size={14} />
                                                </button>
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-gray-500">Teléfono</h3>
                                            <p className="text-lg font-medium text-bancolombia_oscuro flex items-center">
                                                <FaPhoneAlt className="h-4 w-4 mr-2 text-gray-400" />
                                                {userData.telefono}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-gray-500">Tipo de cuenta</h3>
                                            <p className="text-lg font-medium text-bancolombia_oscuro capitalize">{userData.tipo}</p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100">
                                            <h3 className="text-sm text-gray-500">Saldo disponible</h3>
                                            <p className="text-3xl font-bold text-bancolombia_oscuro">{formatCurrency(userData.monto)}</p>
                                        </div>
                                        <Button
                                            onClick={handleWithdraw}
                                            className="w-full bg-gradient-to-r from-bancolombia_oscuro to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                                        >
                                            <FaMoneyBillWave className="mr-2" /> Realizar Retiro
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        {/* Security Tips */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6"
                        >
                        </motion.div>
                    </div>

                    {/* Right Column - Transactions and Quick Actions */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 text-white rounded-2xl shadow-lg overflow-hidden mb-4 p-2">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-medium text-yellow-100 mb-1">Saldo total</h3>
                                            <p className="text-4xl font-bold">{formatCurrency(userData.monto)}</p>
                                            <p className="text-sm text-yellow-100 mt-1">Actualizado: {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex space-x-3">
                                            <Button
                                                onClick={handleWithdraw}
                                                className="bg-bancolombia_amarillo text-bancolombia_azul hover:bg-yellow-50 font-medium px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                                            >
                                                <FaMoneyBillWave className="mr-2" /> Retirar
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-6"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer pt-4">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <div className="bg-blue-100 p-3 rounded-full mb-3">
                                            <FaCreditCard className="h-6 w-6 text-bancolombia_oscuro" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-800">Tarjetas</h3>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer pt-4">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <div className="bg-green-100 p-3 rounded-full mb-3">
                                            <FaMoneyBillWave className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-800">Transferir</h3>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer pt-4">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <div className="bg-purple-100 p-3 rounded-full mb-3">
                                            <FaChartLine className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-800">Inversiones</h3>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer pt-4">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <div className="bg-yellow-100 p-3 rounded-full mb-3">
                                            <FaShieldAlt className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-800">Seguridad</h3>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                        {/* Recent Transactions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800">Transacciones recientes</h3>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-gray-100">
                                        {recentTransactions.length > 0 ? (
                                            recentTransactions.map((transaction) => (
                                                <div key={transaction._id} className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <div
                                                                className={`p-2 rounded-full mr-3 ${transaction.type === "Depósito"
                                                                    ? "bg-green-100"
                                                                    : transaction.type === "Retiro"
                                                                        ? "bg-red-100"
                                                                        : "bg-blue-100"
                                                                    }`}
                                                            >
                                                                <FaMoneyBillWave
                                                                    className={`h-4 w-4 ${transaction.type === "Depósito"
                                                                        ? "text-green-600"
                                                                        : transaction.type === "Retiro"
                                                                            ? "text-red-600"
                                                                            : "text-blue-600"
                                                                        }`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800">{transaction.type}</p>
                                                                <p className="text-xs text-gray-500">{transaction.date}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p
                                                                className={`font-medium ${transaction.type === "Depósito"
                                                                    ? "text-green-600"
                                                                    : transaction.type === "Retiro"
                                                                        ? "text-red-600"
                                                                        : "text-blue-600"
                                                                    }`}
                                                            >
                                                                {transaction.type === "Depósito" ? "+" : "-"}
                                                                {formatCurrency(transaction.amount)}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{transaction.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-gray-500">No hay transacciones recientes</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Withdraw Modal (solo pide la contraseña) */}
            <AnimatePresence>
                {showWithdrawModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className="w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-yellow-200">
                                <div className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 p-6 relative">
                                    <button
                                        onClick={handleCloseModal}
                                        className="absolute right-4 top-4 text-white hover:text-yellow-200 transition-colors"
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                    <div className="flex items-center mb-">
                                        <div className="bg-white/20 p-2 rounded-full mr-3">
                                            <FaMoneyBillWave className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {withdrawStep === 2 ? "Código de retiro" : "Realizar retiro"}
                                        </h2>
                                    </div>
                                    <p className="text-yellow-100 text-sm">
                                        {withdrawStep === 1
                                            ? "Ingresa tu clave para generar el código de retiro"
                                            : "Usa este código en el cajero para retirar tu dinero"}
                                    </p>
                                    {/* Si deseas mostrar pasos, puedes dejar un indicador sencillo */}
                                    <div className="flex justify-center mt-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${withdrawStep === 1 ? "bg-yellow-400 text-bancolombia_oscuro" : "bg-blue-700 text-white/70"}`}>
                                            1
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-4 ${withdrawStep === 2 ? "bg-yellow-400 text-bancolombia_oscuro" : "bg-blue-700 text-white/70"}`}>
                                            2
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-">
                                    {withdrawStep === 1 && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 block pt-4">
                                                    Ingresa tu clave
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Ingresa tu clave"
                                                        className="w-full pr-10 rounded-xl border-yellow-200 focus:border-yellow-500 focus:ring focus:ring-yellow-200 transition-all"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {withdrawStep === 2 && (
                                        <div className="space-y-2 text-center pt-4">
                                            {success ? (
                                                <>
                                                    <div className="bg-green-100 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                                                        <FaCheckCircle className="h-10 w-10 text-green-600" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">¡Código generado con éxito!</h3>
                                                    <p className="text-gray-600 mb-6">
                                                        Usa este código en el cajero para retirar tu dinero.
                                                    </p>
                                                    <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 mb-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="text-3xl font-bold tracking-wider text-bancolombia_oscuro">
                                                                {securityCode}
                                                            </div>
                                                            <button
                                                                onClick={copyCodeToClipboard}
                                                                className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                                                            >
                                                                {codeCopied ? (
                                                                    <FaCheckCircle className="h-5 w-5 text-green-600" />
                                                                ) : (
                                                                    <FaCopy className="h-5 w-5 text-gray-500" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2">Este código expirará en 30 minutos</p>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        Recuerda que este código es de un solo uso y es personal. No lo compartas con nadie.
                                                    </p>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bancolombia_oscuro mx-auto mb-4"></div>
                                                    <p className="text-gray-600">Generando código de seguridad...</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                            {error}
                                        </div>
                                    )}
                                    <div className={`flex ${withdrawStep === 1 ? "justify-end" : "justify-between"} mt-6`}>
                                        {withdrawStep === 2 && (
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    // Permite volver a ingresar la clave si se requiere
                                                    setWithdrawStep(1)
                                                    setError("")
                                                }}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-xl flex items-center"
                                            >
                                                <FaArrowLeft className="mr-2" /> Atrás
                                            </Button>
                                        )}
                                        {withdrawStep === 1 ? (
                                            <Button
                                                type="button"
                                                onClick={handleNextStep}
                                                disabled={loading}
                                                className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                                            >
                                                {loading ? "Procesando..." : "Continuar"}
                                                {!loading && <FaArrowRight className="ml-2" />}
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={handleCloseModal}
                                                className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                                            >
                                                Finalizar
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-bancolombia_oscuro to-blue-800 text-white py-4 mt-12">
                <div className="container mx-auto px-4 text-center text-sm">
                    <p>&copy; Bancolombia 2025 | Universidad Popular del César | Alexander Muñoz Olivo</p>
                </div>
            </footer>
        </div>
    )
}
