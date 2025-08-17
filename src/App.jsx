import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { Header } from './components/Header.jsx'
import { HeroSection } from './components/HeroSection.jsx'
import { FilterBar } from './components/FilterBar.jsx'
import { RaffleCard } from './components/RaffleCard.jsx'
import { mockRaffles, getFilteredRaffles } from './data/mockRaffles.js'
import { LoginPage } from './components/LoginPage.jsx'
import { ForgotPasswordPage } from './components/ForgotPasswordPage.jsx'
import { Layout } from './components/Layout.jsx'
import './App.css'

function App() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    status: '',
    sortBy: 'newest'
  })

  const filteredRaffles = getFilteredRaffles(mockRaffles, filters)

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Layout><div className="flex items-center justify-center flex-grow py-8"><LoginPage /></div></Layout>} />
        <Route path="/forgot-password" element={<Layout><div className="flex items-center justify-center flex-grow py-8"><ForgotPasswordPage /></div></Layout>} />
        <Route path="/" element={
          <Layout>
            <HeroSection />
            <FilterBar onFiltersChange={handleFiltersChange} />
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Rifas Ativas
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredRaffles.length} rifas encontradas
                  </p>
                </div>
              </div>

              {/* Raffles Grid */}
              {filteredRaffles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRaffles.map((raffle) => (
                    <RaffleCard key={raffle.id} raffle={raffle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhuma rifa encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou buscar por outros termos
                  </p>
                </div>
              )}
            </main>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App
