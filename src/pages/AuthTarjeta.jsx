import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaIdCard, 
  FaPhone, 
  FaCalendarAlt, 
  FaLock, 
  FaCreditCard, 
  FaDownload, 
  FaCheck, 
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const CrearTarjeta = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    fechaNacimiento: "",
    clave: "",
    monto: 0,
    tipo: "tarjeta"
  });

  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const cardRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación específica para la clave (solo números y máximo 4 dígitos)
    if (name === "clave" && !/^\d*$/.test(value)) {
      return;
    }
    
    if (name === "clave" && value.length > 4) {
      return;
    }
    
    // Validación para cedula (solo números)
    if (name === "cedula" && !/^\d*$/.test(value)) {
      return;
    }
    
    // Validación para telefono (solo números y máximo 10 dígitos)
    if (name === "telefono" && !/^\d*$/.test(value)) {
      return;
    }
    
    if (name === "telefono" && value.length > 10) {
      return;
    }
    
    // Validación para monto (solo números positivos)
    if (name === "monto" && (isNaN(value) || Number(value) < 0)) {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.nombre) {
      setError("El nombre es obligatorio");
      return false;
    }
    
    if (!formData.cedula) {
      setError("La cédula es obligatoria");
      return false;
    }
    
    if (!formData.telefono || formData.telefono.length !== 10) {
      setError("El teléfono debe tener 10 dígitos");
      return false;
    }
    
    if (!formData.fechaNacimiento) {
      setError("La fecha de nacimiento es obligatoria");
      return false;
    }
    
    if (!formData.clave || formData.clave.length !== 4) {
      setError("La clave debe ser un número de 4 dígitos");
      return false;
    }
    
    if (isNaN(formData.monto) || Number(formData.monto) < 0) {
      setError("El monto inicial debe ser un número positivo");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/cuentas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error al crear la cuenta");
      }
      
      setCardData(data.cuenta);
      setSuccess(true);
      setStep(2);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!cardRef.current) return;
    
    try {
      setLoading(true);
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: null
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Añadir título
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 128);
      pdf.text("Detalles de su Tarjeta", 105, 20, { align: "center" });
      
      // Añadir imagen de la tarjeta
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 15, 30, imgWidth, imgHeight);
      
      // Añadir información adicional
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Información importante:", 15, imgHeight + 40);
      pdf.setFontSize(10);
      pdf.text("• Guarde este documento en un lugar seguro.", 20, imgHeight + 50);
      pdf.text("• No comparta su número de tarjeta, CVV o PIN con nadie.", 20, imgHeight + 60);
      pdf.text("• En caso de pérdida o robo, contacte inmediatamente a nuestro servicio al cliente.", 20, imgHeight + 70);
      
      // Añadir fecha de generación
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Documento generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 105, 285, { align: "center" });
      
      // Guardar PDF
      pdf.save(`Tarjeta_${cardData.nombre.replace(/\s+/g, "_")}.pdf`);
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      setError("Error al generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (number) => {
    if (!number) return "";
    return number.replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <motion.div
        className="max-w-2xl mx-auto"
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
              <h2 className="text-2xl font-bold">Crear Nueva Tarjeta</h2>
              <p className="text-sm text-gray-200">Complete el formulario para obtener su tarjeta virtual</p>
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
          {/* Pasos */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            {[1, 2].map((stepNumber) => (
              <motion.div
                key={stepNumber}
                className="flex flex-col items-center relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * stepNumber, duration: 0.5 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {stepNumber === 1 ? (
                    <FaUser size={16} />
                  ) : (
                    <FaCreditCard size={16} />
                  )}
                </motion.div>
                <p className={`text-xs mt-2 font-medium ${step >= stepNumber ? "text-gray-800" : "text-gray-500"}`}>
                  {stepNumber === 1 ? "Datos Personales" : "Tarjeta Generada"}
                </p>
              </motion.div>
            ))}
          </div>

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

          {/* Paso 1: Formulario de datos */}
          {step === 1 && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese su nombre completo"
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      placeholder="Ingrese su número de cédula"
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (10 dígitos)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ingrese su número de teléfono"
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
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
                      placeholder="Ingrese una clave de 4 dígitos"
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      maxLength={4}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">La clave debe ser un número de 4 dígitos.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto Inicial</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleChange}
                      placeholder="Ingrese el monto inicial"
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full p-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white rounded-lg shadow-md flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    <>
                      <FaCreditCard className="mr-2" />
                      Crear Tarjeta
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Paso 2: Tarjeta generada */}
          {step === 2 && cardData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">¡Tarjeta Creada con Éxito!</h3>
                <p className="text-center text-gray-600 mb-6">
                  Su tarjeta ha sido generada correctamente. A continuación se muestran los detalles de su tarjeta.
                </p>

                {/* Tarjeta virtual */}
                <div className="mb-8" ref={cardRef}>
                  <div className="relative w-full h-56 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden p-6">
                    {/* Círculos decorativos */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
                    
                    {/* Chip y logo */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-10 bg-yellow-500/80 rounded-md"></div>
                      <div className="text-white text-xl font-bold">BancoUPC</div>
                    </div>
                    
                    {/* Número de tarjeta */}
                    <div className="mb-6">
                      <p className="text-gray-400 text-xs mb-1">Número de Tarjeta</p>
                      <p className="text-white text-xl tracking-wider font-mono">
                        {formatCardNumber(cardData.numeroTarjeta || cardData.numero)}
                      </p>
                    </div>
                    
                    {/* Nombre y fecha */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Titular</p>
                        <p className="text-white font-medium uppercase">{cardData.nombre}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Vence</p>
                        <p className="text-white">{cardData.fechaVencimiento}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">CVV</p>
                        <p className="text-white">{cardData.cvv}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalles de la cuenta */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Detalles de la Cuenta</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{cardData.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número de Tarjeta:</span>
                      <span className="font-medium">{formatCardNumber(cardData.numeroTarjeta || cardData.numero)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de Vencimiento:</span>
                      <span className="font-medium">{cardData.fechaVencimiento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CVV:</span>
                      <span className="font-medium">{cardData.cvv}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saldo Inicial:</span>
                      <span className="font-medium">${Number(cardData.monto).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Importante:</strong> Guarde estos datos en un lugar seguro. Para su seguridad, descargue la información de su tarjeta en formato PDF.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={generatePDF}
                    className="flex-1 p-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white rounded-lg shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaDownload className="mr-2" />
                    )}
                    Descargar PDF
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate("/")}
                    className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUser className="mr-2" />
                    Ir al Inicio
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CrearTarjeta;
