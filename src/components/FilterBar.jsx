import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

export function FilterBar({ onFiltersChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    priceRange: '',
    status: '',
    sortBy: 'newest'
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilter = (key) => {
    handleFilterChange(key, '')
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: '',
      status: '',
      sortBy: 'newest'
    }
    setActiveFilters(clearedFilters)
    setSearchTerm('')
    onFiltersChange?.(clearedFilters)
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value && value !== 'newest').length
  }

  return (
    <div className="bg-card border-b border-border py-6">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Buscar rifas por nome, categoria..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Filter Toggle - Mobile */}
          <Button variant="outline" className="lg:hidden">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {getActiveFilterCount() > 0 && (
              <Badge variant="destructive" className="ml-2 bg-accent">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex flex-wrap gap-4 flex-1">
            {/* Category Filter */}
            <Select value={activeFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rifles">Rifles</SelectItem>
                <SelectItem value="pistols">Pistolas</SelectItem>
                <SelectItem value="equipment">Equipamentos</SelectItem>
                <SelectItem value="accessories">Acessórios</SelectItem>
                <SelectItem value="tactical">Equipamentos Táticos</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={activeFilters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-25">R$ 0 - R$ 25</SelectItem>
                <SelectItem value="25-50">R$ 25 - R$ 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                <SelectItem value="100+">R$ 100+</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={activeFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="ending">Finalizando</SelectItem>
                <SelectItem value="new">Novas</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={activeFilters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="price-low">Menor Preço</SelectItem>
                <SelectItem value="price-high">Maior Preço</SelectItem>
                <SelectItem value="ending-soon">Finalizando</SelectItem>
                <SelectItem value="popular">Mais Populares</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {getActiveFilterCount() > 0 && (
            <Button 
              variant="ghost" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilters.category && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Categoria: {activeFilters.category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 text-primary hover:text-primary/80"
                  onClick={() => clearFilter('category')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {activeFilters.priceRange && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Preço: R$ {activeFilters.priceRange}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 text-secondary hover:text-secondary/80"
                  onClick={() => clearFilter('priceRange')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {activeFilters.status && (
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                Status: {activeFilters.status}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 text-accent hover:text-accent/80"
                  onClick={() => clearFilter('status')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

