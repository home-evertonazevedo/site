import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { 
  List, 
  Search, 
  TrendingUp, 
  Calendar, 
  Ticket,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import raffleService from '../../api/raffleService';
import { CreateRafflePage } from './CreateRafflePage';

export function RafflesList() {
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      const response = await raffleService.getAllRaffles();
      
      // Simular dados completos com status e tickets vendidos
      const rafflesWithStats = response.map(raffle => ({
        ...raffle,
        status: raffle.status || 'active', // active, completed, cancelled
        ticketsSold: Math.floor(Math.random() * raffle.totalTickets),
        soldPercentage: Math.floor((Math.random() * raffle.totalTickets) / raffle.totalTickets * 100)
      }));
      
      setRaffles(rafflesWithStats);
    } catch (error) {
      console.error('Erro ao buscar rifas:', error);
      // Dados mock para demonstração
      const mockRaffles = [
        {
          id: 1,
          title: 'Rifa Airsoft M4A1 Completo',
          description: 'Rifle airsoft M4A1 com acessórios completos',
          ticketPrice: 10,
          totalTickets: 100,
          ticketsSold: 78,
          soldPercentage: 78,
          status: 'active',
          createdAt: '2025-10-01',
          userId: 1
        },
        {
          id: 2,
          title: 'Kit Equipamentos Táticos',
          description: 'Kit completo de equipamentos táticos',
          ticketPrice: 15,
          totalTickets: 50,
          ticketsSold: 50,
          soldPercentage: 100,
          status: 'completed',
          createdAt: '2025-09-15',
          userId: 1
        },
        {
          id: 3,
          title: 'Pistola Airsoft Glock',
          description: 'Pistola airsoft Glock 18C',
          ticketPrice: 5,
          totalTickets: 200,
          ticketsSold: 45,
          soldPercentage: 22,
          status: 'active',
          createdAt: '2025-10-05',
          userId: 1
        },
        {
          id: 4,
          title: 'Colete Tático Premium',
          description: 'Colete tático com múltiplos compartimentos',
          ticketPrice: 8,
          totalTickets: 75,
          ticketsSold: 0,
          soldPercentage: 0,
          status: 'cancelled',
          createdAt: '2025-09-20',
          userId: 1
        }
      ];
      setRaffles(mockRaffles);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Ativa', variant: 'default', color: 'bg-green-100 text-green-800' },
      completed: { label: 'Finalizada', variant: 'secondary', color: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Cancelada', variant: 'destructive', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredRaffles = raffles.filter(raffle => {
    const matchesSearch = raffle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         raffle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || raffle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredRaffles.reduce((acc, raffle) => 
    acc + (raffle.ticketsSold * raffle.ticketPrice), 0
  );

  const totalTicketsSold = filteredRaffles.reduce((acc, raffle) => 
    acc + raffle.ticketsSold, 0
  );

  // Se estiver criando uma nova rifa, mostrar o formulário
  if (isCreating) {
    return <CreateRafflePage onBack={() => setIsCreating(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
            <List className="w-6 h-6" />
            Gerenciamento de Rifas
          </h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as rifas do sistema
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Rifa
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'Todas' : status === 'active' ? 'Ativas' : status === 'completed' ? 'Finalizadas' : 'Canceladas'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total de Rifas</p>
              <p className="text-3xl font-bold text-foreground">{filteredRaffles.length}</p>
              <p className="text-xs text-muted-foreground">
                {filteredRaffles.filter(r => r.status === 'active').length} ativa(s)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Ingressos Vendidos</p>
              <p className="text-3xl font-bold text-foreground">{totalTicketsSold}</p>
              <p className="text-xs text-muted-foreground">
                {filteredRaffles.reduce((acc, r) => acc + r.totalTickets, 0)} total disponível
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">
                Valor arrecadado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Rifas */}
      <Card>
        <CardHeader>
          <CardTitle>Rifas do Sistema</CardTitle>
          <CardDescription>
            {filteredRaffles.length} rifa(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredRaffles.length === 0 ? (
            <div className="text-center py-12">
              <List className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma rifa encontrada
              </p>
              <Button 
                variant="outline"
                onClick={() => setIsCreating(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Criar Nova Rifa
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRaffles.map((raffle) => (
                <div
                  key={raffle.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Informações Principais */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 truncate">
                            {raffle.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {raffle.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(raffle.status)}
                        </div>
                      </div>

                      {/* Detalhes */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {raffle.ticketPrice === 1 ? 'R$ 1,00' : `R$ ${raffle.ticketPrice.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {raffle.ticketsSold}/{raffle.totalTickets}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDate(raffle.createdAt)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold ${getPercentageColor(raffle.soldPercentage)}`}>
                            {raffle.soldPercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            raffle.soldPercentage >= 80
                              ? 'bg-green-500'
                              : raffle.soldPercentage >= 50
                              ? 'bg-yellow-500'
                              : raffle.soldPercentage >= 20
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${raffle.soldPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        title="Visualizar detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        title="Editar rifa"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none text-destructive hover:text-destructive"
                        title="Deletar rifa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

