import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  ShoppingCart,
  Shield,
  Search,
  Menu,
} from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                Air<span className="text-secondary">Rifas</span>
              </span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Rifas Ativas
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Minhas Rifas
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-accent"
              >
                3
              </Badge>
            </Button>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Cadastrar
              </Button>
            </div>

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Rifas Ativas
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Minhas Rifas
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contato
              </a>
              <div className="pt-4 border-t border-border">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/login')}>
                    Entrar
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    Cadastrar
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
