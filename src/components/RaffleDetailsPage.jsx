import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function RaffleDetailsPage() {
  const images = [
    'https://via.placeholder.com/800x400/FF0000/FFFFFF?text=Imagem+1',
    'https://via.placeholder.com/800x400/00FF00/FFFFFF?text=Imagem+2',
    'https://via.placeholder.com/800x400/0000FF/FFFFFF?text=Imagem+3',
  ];

  const [quantity, setQuantity] = useState(0);
  const maxQuantity = 20000;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= maxQuantity) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(0);
    }
  };

  const addQuantity = (amount) => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + amount, maxQuantity));
  };

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
          <h2 className="text-2xl font-semibold mb-4">Título da Rifa</h2>
          <p className="text-muted-foreground mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          {/* Seleção de Cotas */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Selecione suas Cotas</h3>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="0"
                max={maxQuantity}
                className="w-32 text-center"
              />
              <Button onClick={() => addQuantity(100)}>+100</Button>
              <Button onClick={() => addQuantity(500)}>+500</Button>
              <Button onClick={() => addQuantity(1000)}>+1000</Button>
            </div>
            <p className="text-sm text-muted-foreground">Máximo de {maxQuantity} cotas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


