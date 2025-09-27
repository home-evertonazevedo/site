import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Clock, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

export function RaffleCard({ raffle }) {
  const soldTickets = 0; // Placeholder, API does not provide soldTickets
  const progressPercentage = (soldTickets / raffle.totalTickets) * 100;
  const drawDate = new Date(raffle.createdAt).toLocaleDateString(); // Using createdAt as placeholder for drawDate



  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src="https://via.placeholder.com/800x400/CCCCCC/000000?text=Rifa"
            alt={raffle.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      
      <Link to={`/raffle/${raffle.id}`}>
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
                  {soldTickets}/{raffle.totalTickets}
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
                <span>{drawDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>

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

