import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Target, Shield, Award, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-card py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 border-secondary text-secondary">
            <Shield className="w-4 h-4 mr-2" />
            Rifas Exclusivas e Confiáveis
          </Badge>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Rifas Exclusivas de{' '}
            <span className="text-primary">Airsoft</span>{' '}
            e{' '}
            <span className="text-secondary">Equipamentos Esportivos</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Participe de rifas de equipamentos táticos premium, armas de airsoft de alta qualidade 
            e acessórios esportivos exclusivos. Transparência total.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
            >
              <Target className="w-5 h-5 mr-2" />
              Ver Rifas Ativas
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">100% Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Plataforma certificada com sorteios transparentes
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Produtos Premium</h3>
              <p className="text-sm text-muted-foreground">
                Equipamentos de alta qualidade e marcas reconhecidas
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Receba seu prêmio rapidamente em todo o Brasil
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

