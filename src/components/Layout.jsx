import React from 'react'
import { Header } from './Header.jsx'
import { Footer } from './Footer.jsx'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

