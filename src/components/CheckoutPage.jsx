import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useAuth } from '../contexts/AuthContext';
import raffleService from '../api/raffleService';
import { ShoppingCart, Plus, Minus, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export function CheckoutPage() {
  const { raffleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [raffle, setRaffle] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Fetch raffle details
  useEffect(() => {
    const fetchRaffleDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const raffleData = await raffleService.getRaffleById(raffleId);
        setRaffle(raffleData);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar detalhes da rifa');
        console.error('Erro ao buscar detalhes da rifa:', err);
      } finally {
        setLoading(false);
      }
    };

    if (raffleId) {
      fetchRaffleDetails();
    }
  }, [raffleId]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && raffle && newQuantity <= raffle.totalTickets) {
      setQuantity(newQuantity);
    }
  };

  const handleQuickIncrement = (amount) => {
    handleQuantityChange(quantity + amount);
  };

  const calculateTotal = () => {
    if (!raffle) return 0;
    return (raffle.ticketPrice * quantity).toFixed(2);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      setError(null);

      const purchaseData = {
        raffleId: parseInt(raffleId),
        ticketCount: quantity,
      };

      const response = await raffleService.createPurchase(purchaseData);
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err?.message || 'Erro ao processar a compra. Tente novamente.');
      console.error('Erro ao processar compra:', err);
    } finally {
      setPurchasing(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Carregando detalhes da rifa...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Rifa não encontrada</h3>
                <p className="text-sm text-red-700 mt-1">
                  A rifa que você está tentando acessar não existe ou foi removida.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-4 w-full"
            >
              Voltar para Rifas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Success Message */}
      {success && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Compra realizada com sucesso!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Você será redirecionado para o dashboard em breve...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Erro</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raffle Details */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{raffle.title}</CardTitle>
              <CardDescription className="mt-2">
                {raffle.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="ml-2">
              Rifa #{raffle.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Preço por Bilhete</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(raffle.ticketPrice)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bilhetes Disponíveis</p>
              <p className="text-2xl font-bold">
                {raffle.totalTickets.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantity Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Selecione a Quantidade
          </CardTitle>
          <CardDescription>
            Escolha quantos bilhetes deseja comprar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Increment Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickIncrement(10)}
              disabled={quantity + 10 > raffle.totalTickets}
              className="text-xs"
            >
              +10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickIncrement(100)}
              disabled={quantity + 100 > raffle.totalTickets}
              className="text-xs"
            >
              +100
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickIncrement(1000)}
              disabled={quantity + 1000 > raffle.totalTickets}
              className="text-xs"
            >
              +1000
            </Button>
          </div>

          {/* Quantity Input */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="flex-1">
              <input
                type="number"
                min="1"
                max={raffle.totalTickets}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border rounded-md text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= raffle.totalTickets}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {quantity > raffle.totalTickets && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Quantidade máxima de bilhetes disponíveis: {raffle.totalTickets}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="mb-6 border-2 border-primary">
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {quantity} bilhete(s) × {formatCurrency(raffle.ticketPrice)}
            </span>
            <span className="font-semibold">
              {formatCurrency(raffle.ticketPrice * quantity)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate('/')}
          disabled={purchasing}
        >
          Cancelar
        </Button>
        <Button
          className="flex-1"
          onClick={handlePurchase}
          disabled={purchasing || quantity <= 0}
          size="lg"
        >
          {purchasing ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Confirmar Compra
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

