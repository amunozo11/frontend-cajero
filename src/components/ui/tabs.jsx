"use client"

import { createContext, useContext, useState } from "react"

const TabsContext = createContext({
  value: "",
  onValueChange: () => {},
})

const Tabs = ({ children, defaultValue, className = "", ...props }) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={`${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const TabsTrigger = ({ children, value, className = "", ...props }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext)
  const isActive = selectedValue === value

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50"
          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
      } ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, className = "", ...props }) => {
  const { value: selectedValue } = useContext(TabsContext)

  if (selectedValue !== value) return null

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

