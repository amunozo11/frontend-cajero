import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  CreditCard,
  Building,
  Wallet,
  ArrowRightCircle,
  ChevronRight,
  Shield,
  Clock,
  DollarSign,
  Smartphone,
} from "lucide-react"

import {Button} from "../components/ui/Button"
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"

export default function BankingSystem() {
  const navigate = useNavigate()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const bankOptions = [
    {
      id: "nequi",
      name: "Nequi",
      color: "bg-gradient-to-r from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-700 hover:to-purple-900",
      icon: <Smartphone className="h-5 w-5 mr-2" />,
    },
    {
      id: "bancolombia",
      name: "Bancolombia",
      color: "bg-gradient-to-r from-amber-500 to-amber-700",
      hoverColor: "hover:from-amber-600 hover:to-amber-800",
      icon: <Building className="h-5 w-5 mr-2" />,
    },
    {
      id: "tarjeta",
      name: "Tarjeta",
      color: "bg-gradient-to-r from-slate-600 to-slate-800",
      hoverColor: "hover:from-slate-700 hover:to-slate-900",
      icon: <CreditCard className="h-5 w-5 mr-2" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-nequi_oscuro text-white dark:bg-slate-950 shadow-sm pt-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-nequi_claro dark:text-white ml-2">BancoUPC</h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="outline" className="mr-2">
              <Shield className="h-4 w-4 mr-2" />
              Ayuda
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Horarios
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <Tabs defaultValue="accounts" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="accounts">Acceso a Cuentas</TabsTrigger>
            <TabsTrigger value="atm">Cajero Automático</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-3 gap-6"
            >
              {bankOptions.map((bank) => (
                <motion.div key={bank.id} variants={fadeIn}>
                  <Card className="border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardHeader className={`${bank.color} text-white`}>
                      <div className="flex items-center font-bold text-lg">
                        {bank.icon}
                        {bank.name}
                      </div>
                      <p className="text-slate-100 text-sm">Accede a tu cuenta de {bank.name}</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Consulta saldos, realiza transferencias y administra tus finanzas de forma segura.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${bank.color} ${bank.hoverColor} text-white`}
                        onClick={() => navigate(`/auth/${bank.id}`)}
                      >
                        Ingresar
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="atm">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
                  <div className="flex items-center font-bold text-lg">
                    <Wallet className="h-5 w-5 mr-2" />
                    Cajero Automático Virtual
                  </div>
                  <p className="text-slate-100 text-sm">Realiza operaciones como si estuvieras en un cajero físico</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white">Operaciones disponibles</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center text-slate-700 dark:text-slate-300">
                          <ArrowRightCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                          Retiros de efectivo
                        </li>
                        <li className="flex items-center text-slate-700 dark:text-slate-300">
                          <ArrowRightCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                          Consulta de saldo
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 flex flex-col items-center justify-center">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-medium px-8"
                          onClick={() => navigate("/cajero")}
                        >
                          <Wallet className="h-5 w-5 mr-2" />
                          Iniciar Operación
                        </Button>
                      </motion.div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                        Selecciona esta opción para comenzar a utilizar el cajero virtual
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-6 mt-8 absolute bottom-0 w-full">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Proyecto Sistema de Cajero - Universidad Popular del Cesar
              </p>
              <p className="text-slate-800 dark:text-white font-medium">Alexander Muñoz Olivo</p>
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs">
              © {new Date().getFullYear()} BancoUPC. Todos los derechos reservados.
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

