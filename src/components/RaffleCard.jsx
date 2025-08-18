import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Clock, Users, Target } from 'lucide-react'

export function RaffleCard({ raffle }) {
  const progressPercentage = (raffle.soldTickets / raffle.totalTickets) * 100

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-primary text-primary-foreground">Ativa</Badge>
      case 'ending':
        return <Badge variant="destructive" className="bg-accent text-accent-foreground">Últimas Horas</Badge>
      case 'new':
        return <Badge variant="outline" className="border-secondary text-secondary">Novo</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={raffle.image} 
            alt={raffle.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            {getStatusBadge(raffle.status)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2">
          {raffle.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-secondary">
            R$ {raffle.ticketPrice.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">por bilhete</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progresso</span>
              <span className="text-foreground font-medium">
                {raffle.soldTickets}/{raffle.totalTickets}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progressPercentage.toFixed(1)}% vendidos
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{raffle.drawDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{raffle.participants} participantes</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-center">
        <h4 className="text-lg font-bold text-foreground mb-3">Participe</h4>
        <div className="flex space-x-2 w-full">
          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            100
          </Button>
          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            500
          </Button>
          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            1000
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

