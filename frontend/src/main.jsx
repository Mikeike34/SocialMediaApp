import { Provider } from "@/components/ui/provider"
import { Toaster, toaster } from "@/components/ui/toaster"
import React from "react"
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
