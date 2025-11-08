import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useAuth } from '../contexts/AuthContext';
import raffleService from '../api/raffleService';
import { User, Mail, Phone, CreditCard, Calendar, Package, LogOut, Edit, BarChart3, Settings, AlertCircle, Loader } from 'lucide-react';
import { RafflesList } from './admin/RafflesList';
import { EfipaySettings } from './admin/EfipaySettings';

export function Dashboard() {
  const { user, logout, getFirstName } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchUserPurchases = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await raffleService.getUserPurchases();
        setPurchases(data || []);
      } catch (err) {
        console.error('Erro ao buscar compras:', err);
        setError(err?.message || 'Erro ao carregar suas participações');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPurchases();
    }
  }, [user]);

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Aguardando Pagamento', variant: 'outline', color: 'text-yellow-600' },
      COMPLETED: { label: 'Pago', variant: 'default', color: 'text-green-600' },
      CANCELLED: { label: 'Cancelado', variant: 'secondary', color: 'text-red-600' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge variant={config.variant} className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Package },
    ...(isAdmin ? [
      { id: 'raffles', label: 'Gerenciar Rifas', icon: BarChart3 },
      { id: 'settings', label: 'Configurações', icon: Settings }
    ] : [])
  ];

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
            {isAdmin ? 'Painel de Administração' : 'Gerencie suas rifas e acompanhe suas participações'}
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

      {/* Abas de Navegação para Administradores */}
      {isAdmin && (
        <div className="flex gap-2 mb-8 border-b overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Conteúdo da Aba Overview */}
      {activeTab === 'overview' && (
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

                  {isAdmin && (
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Badge className="bg-amber-100 text-amber-800">Admin</Badge>
                      <p className="text-xs text-muted-foreground">Acesso administrativo</p>
                    </div>
                  )}
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
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Carregando suas participações...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Erro ao carregar</p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
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
                                {purchase.raffle?.title || 'Rifa'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Comprado em {formatDate(purchase.createdAt)}
                              </p>
                            </div>
                            {getStatusBadge(purchase.status)}
                          </div>
                          
                          {purchase.raffle?.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {purchase.raffle.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-sm font-medium text-muted-foreground">
                              Bilhetes ({purchase.ticketNumbers?.length || 0}):
                            </span>
                            {purchase.ticketNumbers && purchase.ticketNumbers.length > 0 ? (
                              purchase.ticketNumbers.map((number) => (
                                <Badge key={number} variant="secondary" className="text-xs">
                                  {number}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">Nenhum bilhete</span>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground">Valor Total</p>
                              <p className="font-semibold text-foreground">
                                {formatCurrency((purchase.raffle?.ticketPrice || 0) * (purchase.ticketNumbers?.length || 0))}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">ID da Compra</p>
                              <p className="font-mono text-sm text-foreground">#{purchase.id}</p>
                            </div>
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
      )}

      {/* Conteúdo da Aba Rifas (Apenas para Admins) */}
      {activeTab === 'raffles' && isAdmin && (
        <RafflesList />
      )}

      {/* Conteúdo da Aba Configurações (Apenas para Admins) */}
      {activeTab === 'settings' && isAdmin && (
        <EfipaySettings />
      )}
    </div>
  );
}

