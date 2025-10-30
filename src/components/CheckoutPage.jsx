import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useAuth } from '../contexts/AuthContext';
import raffleService from '../api/raffleService';
import { ShoppingCart, Plus, Minus, AlertCircle, CheckCircle, Loader, Copy, Clock, QrCode, RefreshCw } from 'lucide-react';

export function CheckoutPage() {
  const { raffleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para a tela de compra
  const [raffle, setRaffle] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  // Estados para a tela de pagamento
  const [purchase, setPurchase] = useState(null);
  const [pixData, setPixData] = useState(null);
  const [pixError, setPixError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutos em segundos
  const [paymentExpired, setPaymentExpired] = useState(false);

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

  // Timer de expiração da cobrança
  useEffect(() => {
    if (!pixData) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setPaymentExpired(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pixData]);

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPixCode = () => {
    if (pixData?.copyAndPaste) {
      navigator.clipboard.writeText(pixData.copyAndPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      setError(null);
      setPixError(null);

      const purchaseData = {
        raffleId: parseInt(raffleId),
        ticketCount: quantity,
      };

      const response = await raffleService.createPurchase(purchaseData);
      
      // Armazenar dados da compra e PIX
      setPurchase(response);
      
      // Verificar se houve erro ao gerar o PIX
      if (response.pixError) {
        setPixError(response.pixError);
        setPixData(null);
      } else {
        setPixData(response.pixData);
        setPixError(null);
      }
      
      setTimeRemaining(15 * 60); // Resetar timer
      setPaymentExpired(false);
    } catch (err) {
      setError(err?.message || 'Erro ao processar a compra. Tente novamente.');
      console.error('Erro ao processar compra:', err);
    } finally {
      setPurchasing(false);
    }
  };

  const handleBackToCheckout = () => {
    setPurchase(null);
    setPixData(null);
    setPixError(null);
    setTimeRemaining(15 * 60);
    setPaymentExpired(false);
  };

  const handleRetryPixGeneration = async () => {
    if (!purchase) return;
    
    try {
      setPixError(null);
      setPurchasing(true);
      
      // Voltar para a tela de checkout e tentar novamente
      handleBackToCheckout();
    } catch (err) {
      setPixError({
        message: 'Erro ao tentar novamente',
        details: err?.message,
        retryable: true,
      });
      console.error('Erro ao tentar gerar PIX novamente:', err);
    } finally {
      setPurchasing(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return null;
  }

  // Tela de Erro de PIX (Compra criada, mas PIX falhou)
  if (pixError && purchase && !pixData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Erro ao Gerar Pagamento</h1>
          <p className="text-muted-foreground">
            Sua compra foi criada, mas houve um problema ao gerar o código PIX
          </p>
        </div>

        {/* Status da Compra */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-blue-700">
                <strong>ID da Compra:</strong> #{purchase.id}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Bilhetes:</strong> {purchase.ticketNumbers?.length || quantity}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Valor:</strong> {formatCurrency(calculateTotal())}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Status:</strong> Aguardando Pagamento
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Erro */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {pixError.message}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">
              {pixError.details}
            </p>
            <div className="bg-red-100 border border-red-300 rounded p-3">
              <p className="text-xs text-red-700">
                <strong>Dica:</strong> Verifique sua conexão com a internet e tente novamente. Se o problema persistir, entre em contato com o suporte.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex gap-3">
          <Button
            onClick={handleRetryPixGeneration}
            className="flex-1 gap-2"
            disabled={purchasing}
          >
            {purchasing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleGoToDashboard}
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Tela de Pagamento PIX
  if (pixData && purchase) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pagamento PIX</h1>
          <p className="text-muted-foreground">
            Escaneie o código QR ou copie e cole o código abaixo para realizar o pagamento
          </p>
        </div>

        {/* Status da Compra */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-blue-700">
                <strong>ID da Compra:</strong> #{purchase.id}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Bilhetes:</strong> {purchase.ticketNumbers?.length || quantity}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Valor:</strong> {formatCurrency(calculateTotal())}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timer */}
        <Card className={`mb-6 ${paymentExpired ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${paymentExpired ? 'text-red-600' : 'text-yellow-600'}`} />
                <span className={`font-semibold ${paymentExpired ? 'text-red-700' : 'text-yellow-700'}`}>
                  {paymentExpired ? 'Cobrança Expirada' : 'Tempo Restante'}
                </span>
              </div>
              <span className={`text-2xl font-bold font-mono ${paymentExpired ? 'text-red-600' : 'text-yellow-600'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            {paymentExpired && (
              <p className="text-sm text-red-700 mt-3">
                O prazo para pagamento expirou. Clique em "Voltar" para gerar uma nova cobrança.
              </p>
            )}
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Código QR
            </CardTitle>
            <CardDescription>
              Escaneie com seu aplicativo bancário
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            {pixData.qrCodeUrl ? (
              <img 
                src={pixData.qrCodeUrl} 
                alt="QR Code PIX" 
                className="w-64 h-64 border-2 border-primary rounded-lg p-2 bg-white"
              />
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">QR Code não disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cópia e Cola */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Cópia e Cola
            </CardTitle>
            <CardDescription>
              Copie o código abaixo para colar no seu app bancário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-muted p-4 rounded-lg border border-border">
                <code className="text-xs break-all text-foreground font-mono">
                  {pixData.copyAndPaste}
                </code>
              </div>
              <Button 
                onClick={handleCopyPixCode}
                className="w-full gap-2"
                size="lg"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copiado!' : 'Copiar Código'}
              </Button>
              {copied && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Código copiado para a área de transferência
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Como Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
              <li>Abra seu aplicativo bancário ou de pagamentos</li>
              <li>Escolha a opção de "Pagar com PIX"</li>
              <li>Escaneie o código QR acima OU copie e cole o código</li>
              <li>Confirme o pagamento de {formatCurrency(calculateTotal())}</li>
              <li>Seu pagamento será confirmado automaticamente</li>
            </ol>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleBackToCheckout}
            disabled={paymentExpired}
          >
            Voltar
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleGoToDashboard}
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Tela de Checkout (Seleção de Quantidade)
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando detalhes da rifa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Erro ao Carregar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/raffles')}>
              Voltar para Rifas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!raffle) {
    return null;
  }

  // Tela de Checkout
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Selecione a quantidade de bilhetes que deseja comprar
        </p>
      </div>

      {/* Erro */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detalhes da Rifa */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{raffle.title}</CardTitle>
          <CardDescription>{raffle.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Preço por Bilhete</p>
                <p className="text-2xl font-bold">{formatCurrency(raffle.ticketPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bilhetes Disponíveis</p>
                <p className="text-2xl font-bold">{raffle.totalTickets}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Quantidade */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Quantidade de Bilhetes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Controle de Quantidade */}
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
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-border rounded-lg text-center text-lg font-semibold"
                  min="1"
                  max={raffle.totalTickets}
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

            {/* Botões de Incremento Rápido */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickIncrement(10)}
                disabled={quantity + 10 > raffle.totalTickets}
              >
                +10
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickIncrement(100)}
                disabled={quantity + 100 > raffle.totalTickets}
              >
                +100
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickIncrement(1000)}
                disabled={quantity + 1000 > raffle.totalTickets}
              >
                +1000
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Pedido */}
      <Card className="mb-6 border-primary bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preço Unitário</span>
              <span className="font-semibold">{formatCurrency(raffle.ticketPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantidade</span>
              <span className="font-semibold">{quantity} bilhete(s)</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Compra */}
      <Button
        onClick={handlePurchase}
        disabled={purchasing || quantity === 0}
        size="lg"
        className="w-full gap-2"
      >
        {purchasing ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Confirmar Compra
          </>
        )}
      </Button>
    </div>
  );
}

