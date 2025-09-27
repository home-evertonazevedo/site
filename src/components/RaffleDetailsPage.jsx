import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRaffle } from '../contexts/RaffleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function RaffleDetailsPage() {
  const { id } = useParams();
  const { raffles, loading, error } = useRaffle();
  const [currentRaffle, setCurrentRaffle] = useState(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (raffles.length > 0) {
      const foundRaffle = raffles.find(raffle => raffle.id === parseInt(id));
      setCurrentRaffle(foundRaffle);
    }
  }, [id, raffles]);

  // Placeholder para imagens, já que a API não as fornece diretamente
  const images = [
    'https://via.placeholder.com/800x400/FF0000/FFFFFF?text=Imagem+1',
    'https://via.placeholder.com/800x400/00FF00/FFFFFF?text=Imagem+2',
    'https://via.placeholder.com/800x400/0000FF/FFFFFF?text=Imagem+3',
  ];

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (currentRaffle && !isNaN(value) && value >= 0 && value <= currentRaffle.totalTickets) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(0);
    }
  };

  const addQuantity = (amount) => {
    if (currentRaffle) {
      setQuantity((prevQuantity) => Math.min(prevQuantity + amount, currentRaffle.totalTickets));
    }
  };

  if (loading) return <p>Carregando rifa...</p>;
  if (error) return <p>Erro ao carregar rifa: {error.message}</p>;
  if (!currentRaffle) return <p>Rifa não encontrada.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Detalhes da Rifa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Carrossel de Imagens */}
        <div>
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-video items-center justify-center p-6">
                        <img src={image} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Detalhes da Rifa e Seleção de Cotas */}
        <div>
          {/* Título e Descrição */}
          <h2 className="text-2xl font-semibold mb-4">{currentRaffle.title}</h2>
          <p className="text-muted-foreground mb-6">
            {currentRaffle.description}
          </p>
          <p className="text-xl font-bold mb-4">Preço por cota: R$ {currentRaffle.ticketPrice.toFixed(2)}</p>
          <p className="text-md mb-4">Total de cotas: {currentRaffle.totalTickets}</p>

          {/* Seleção de Cotas */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Selecione suas Cotas</h3>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="0"
                max={currentRaffle.totalTickets}
                className="w-32 text-center"
              />
              <Button onClick={() => addQuantity(100)}>+100</Button>
              <Button onClick={() => addQuantity(500)}>+500</Button>
              <Button onClick={() => addQuantity(1000)}>+1000</Button>
            </div>
            <p className="text-sm text-muted-foreground">Máximo de {currentRaffle.totalTickets} cotas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

