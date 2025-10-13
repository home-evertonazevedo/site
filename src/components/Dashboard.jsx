import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, CreditCard, Calendar, Package, LogOut, Edit } from 'lucide-react';

export function Dashboard() {
  const { user, logout, getFirstName } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de compras do usuário
    // TODO: Implementar chamada real para API de compras
    const mockPurchases = [
      {
        id: 1,
        raffleTitle: 'Rifa Airsoft M4A1 Completo',
        ticketNumbers: ['001', '045', '123'],
        purchaseDate: '2025-10-05',
        status: 'active',
        totalValue: 30.00
      },
      {
        id: 2,
        raffleTitle: 'Kit Equipamentos Táticos',
        ticketNumbers: ['078', '156'],
        purchaseDate: '2025-10-03',
        status: 'completed',
        totalValue: 20.00
      },
      {
        id: 3,
        raffleTitle: 'Pistola Airsoft Glock',
        ticketNumbers: ['234'],
        purchaseDate: '2025-10-01',
        status: 'pending',
        totalValue: 10.00
      }
    ];

    setTimeout(() => {
      setPurchases(mockPurchases);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Ativa', variant: 'default' },
      completed: { label: 'Finalizada', variant: 'secondary' },
      pending: { label: 'Pendente', variant: 'outline' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Você precisa estar logado para acessar o dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header do Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Olá, {getFirstName()}! 👋
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas rifas e acompanhe suas participações
          </p>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="mt-4 md:mt-0"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Usuário */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Meus Dados
              </CardTitle>
              <CardDescription>
                Informações da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Nome completo</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{formatCPF(user.inscricao)}</p>
                    <p className="text-xs text-muted-foreground">CPF</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{formatPhone(user.cellphone)}</p>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(user.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">Membro desde</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Compras */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Minhas Participações
              </CardTitle>
              <CardDescription>
                Histórico das suas rifas e números da sorte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : purchases.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Você ainda não participou de nenhuma rifa
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Ver Rifas Disponíveis
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <Card key={purchase.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">
                              {purchase.raffleTitle}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Comprado em {formatDate(purchase.purchaseDate)}
                            </p>
                          </div>
                          {getStatusBadge(purchase.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            Números:
                          </span>
                          {purchase.ticketNumbers.map((number) => (
                            <Badge key={number} variant="secondary" className="text-xs">
                              {number}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Total: R$ {purchase.totalValue.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {purchase.ticketNumbers.length} número(s)
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {purchases.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Rifas Participadas
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {purchases.reduce((acc, p) => acc + p.ticketNumbers.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                Números Comprados
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                R$ {purchases.reduce((acc, p) => acc + p.totalValue, 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Investido
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
