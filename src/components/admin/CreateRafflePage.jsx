import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { ArrowLeft, Plus, Loader2, Trash2, Edit2 } from 'lucide-react';
import raffleService from '../../api/raffleService';
import { useAuth } from '../../contexts/AuthContext';

export function CreateRafflePage({ onBack, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticketPrice: '',
    totalTickets: ''
  });

  const [prizeQuotas, setPrizeQuotas] = useState([]);
  const [prizeQuotaForm, setPrizeQuotaForm] = useState({
    quotaNumber: '',
    description: '',
    activationPercentage: ''
  });
  const [editingQuotaId, setEditingQuotaId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ticketPrice') {
      if (!/^\d*\.?\d*$/.test(value)) return;
    } else if (name === 'totalTickets') {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrizeQuotaChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'quotaNumber' || name === 'activationPercentage') {
      if (!/^\d*$/.test(value)) return;
    }

    setPrizeQuotaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPrizeQuota = () => {
    setError('');

    if (!prizeQuotaForm.quotaNumber) {
      setError('Número da cota é obrigatório');
      return;
    }

    if (!prizeQuotaForm.description) {
      setError('Descrição do prêmio é obrigatória');
      return;
    }

    if (!prizeQuotaForm.activationPercentage) {
      setError('Percentual de ativação é obrigatório');
      return;
    }

    const percentage = parseInt(prizeQuotaForm.activationPercentage);
    if (percentage < 0 || percentage > 100) {
      setError('Percentual deve estar entre 0 e 100');
      return;
    }

    const quotaNumber = parseInt(prizeQuotaForm.quotaNumber);
    
    if (editingQuotaId !== null) {
      setPrizeQuotas(prev => prev.map(q => 
        q.id === editingQuotaId 
          ? { ...q, quotaNumber, description: prizeQuotaForm.description, activationPercentage: percentage }
          : q
      ));
      setEditingQuotaId(null);
    } else {
      setPrizeQuotas(prev => [...prev, {
        id: Date.now(),
        quotaNumber,
        description: prizeQuotaForm.description,
        activationPercentage: percentage
      }]);
    }

    setPrizeQuotaForm({
      quotaNumber: '',
      description: '',
      activationPercentage: ''
    });
  };

  const editPrizeQuota = (quota) => {
    setPrizeQuotaForm({
      quotaNumber: quota.quotaNumber.toString(),
      description: quota.description,
      activationPercentage: quota.activationPercentage.toString()
    });
    setEditingQuotaId(quota.id);
  };

  const removePrizeQuota = (id) => {
    setPrizeQuotas(prev => prev.filter(q => q.id !== id));
    if (editingQuotaId === id) {
      setEditingQuotaId(null);
      setPrizeQuotaForm({
        quotaNumber: '',
        description: '',
        activationPercentage: ''
      });
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Título é obrigatório');
      return false;
    }
    if (formData.title.length < 3) {
      setError('Título deve ter pelo menos 3 caracteres');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      return false;
    }
    if (formData.description.length > 500) {
      setError('Descrição não pode exceder 500 caracteres');
      return false;
    }
    if (!formData.ticketPrice) {
      setError('Preço da cota é obrigatório');
      return false;
    }
    const price = parseFloat(formData.ticketPrice);
    if (isNaN(price) || price <= 0) {
      setError('Preço da cota deve ser um valor positivo');
      return false;
    }
    if (!formData.totalTickets) {
      setError('Número total de cotas é obrigatório');
      return false;
    }
    const tickets = parseInt(formData.totalTickets);
    if (isNaN(tickets) || tickets < 1) {
      setError('Número total de cotas deve ser pelo menos 1');
      return false;
    }
    if (tickets > 1000000) {
      setError('Número total de cotas não pode exceder 1 milhão');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const raffleData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ticketPrice: parseFloat(formData.ticketPrice),
        totalTickets: parseInt(formData.totalTickets)
      };

      const response = await raffleService.createRaffle(raffleData);
      const raffleId = response.id;

      // Adicionar cotas premiadas se houver
      if (prizeQuotas.length > 0) {
        for (const quota of prizeQuotas) {
          await raffleService.addPrizeQuota(raffleId, {
            quotaNumber: quota.quotaNumber,
            description: quota.description,
            activationPercentage: quota.activationPercentage
          });
        }
      }

      setSuccess('Rifa criada com sucesso!');
      setFormData({
        title: '',
        description: '',
        ticketPrice: '',
        totalTickets: ''
      });
      setPrizeQuotas([]);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onBack();
        }
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar rifa:', err);
      setError(err.message || 'Erro ao criar rifa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Criar Nova Rifa
          </h2>
          <p className="text-muted-foreground">
            Preencha os dados para criar uma nova rifa
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Rifa</CardTitle>
          <CardDescription>
            Todos os campos são obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensagens de Erro e Sucesso */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Campo Título */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Título da Rifa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Rifa Airsoft M4A1 Completo"
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
                maxLength="100"
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/100 caracteres
              </p>
            </div>

            {/* Campo Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva os detalhes da rifa, características do prêmio, etc."
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
                maxLength="500"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500 caracteres
              </p>
            </div>

            {/* Campos de Preço e Quantidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">
                  Preço da Cota (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ticketPrice"
                  name="ticketPrice"
                  type="text"
                  placeholder="Ex: 10.00"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Valor de cada cota em reais
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalTickets">
                  Total de Cotas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalTickets"
                  name="totalTickets"
                  type="text"
                  placeholder="Ex: 100"
                  value={formData.totalTickets}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Número total de cotas disponíveis
                </p>
              </div>
            </div>

            {/* Resumo */}
            {formData.ticketPrice && formData.totalTickets && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Resumo</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    Preço por cota: <span className="text-foreground font-medium">R$ {parseFloat(formData.ticketPrice).toFixed(2)}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Total de cotas: <span className="text-foreground font-medium">{parseInt(formData.totalTickets).toLocaleString('pt-BR')}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Receita potencial: <span className="text-foreground font-medium">R$ {(parseFloat(formData.ticketPrice) * parseInt(formData.totalTickets)).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Seção de Cotas Premiadas */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Cotas Premiadas (Opcional)</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quotaNumber">
                      Número da Cota
                    </Label>
                    <Input
                      id="quotaNumber"
                      name="quotaNumber"
                      type="text"
                      placeholder="Ex: 100000"
                      value={prizeQuotaForm.quotaNumber}
                      onChange={handlePrizeQuotaChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activationPercentage">
                      Percentual de Ativação (%)
                    </Label>
                    <Input
                      id="activationPercentage"
                      name="activationPercentage"
                      type="text"
                      placeholder="Ex: 50"
                      value={prizeQuotaForm.activationPercentage}
                      onChange={handlePrizeQuotaChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prizeDescription">
                      Descrição do Prêmio
                    </Label>
                    <Input
                      id="prizeDescription"
                      name="description"
                      type="text"
                      placeholder="Ex: Prêmio de R$ 10.000"
                      value={prizeQuotaForm.description}
                      onChange={handlePrizeQuotaChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addPrizeQuota}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {editingQuotaId !== null ? 'Atualizar Cota' : 'Adicionar Cota Premiada'}
                </Button>
              </div>

              {/* Lista de Cotas Premiadas */}
              {prizeQuotas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Cotas Premiadas ({prizeQuotas.length})
                  </p>
                  {prizeQuotas.map((quota) => (
                    <div
                      key={quota.id}
                      className="p-3 bg-muted rounded-lg flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          Cota #{quota.quotaNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {quota.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ativação: {quota.activationPercentage}%
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => editPrizeQuota(quota)}
                          disabled={loading}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removePrizeQuota(quota.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando Rifa...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Criar Rifa
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-base">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• A rifa será criada com status "Ativa" e disponível para compra imediatamente.</p>
          <p>• Você poderá editar ou cancelar a rifa a qualquer momento na lista de rifas.</p>
          <p>• O preço da cota não pode ser alterado após a criação.</p>
          <p>• As cotas premiadas são opcionais e podem ser adicionadas após a criação da rifa.</p>
          <p>• Certifique-se de que as informações estão corretas antes de criar a rifa.</p>
        </CardContent>
      </Card>
    </div>
  );
}

