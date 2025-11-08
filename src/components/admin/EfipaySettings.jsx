import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { AlertCircle, CheckCircle, Loader, Eye, EyeOff, TestTube } from 'lucide-react';
import apiClient from '../../api/apiClient';

export function EfipaySettings() {
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    pixKey: '',
    environment: 'sandbox',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/admin/configurations/efipay');
      setFormData({
        clientId: response.data.clientId || '',
        clientSecret: response.data.clientSecret || '',
        pixKey: response.data.pixKey || '',
        environment: response.data.environment || 'sandbox',
      });
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      setError(err?.response?.data?.error || 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validar campos obrigatórios
      if (!formData.clientId || !formData.clientSecret || !formData.pixKey || !formData.environment) {
        setError('Todos os campos são obrigatórios');
        setSaving(false);
        return;
      }

      await apiClient.put('/admin/configurations/efipay', formData);
      setSuccess('Configurações salvas com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError(err?.response?.data?.error || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setError(null);
      setTestResult(null);

      const response = await apiClient.post('/admin/configurations/efipay/test');
      setTestResult({
        success: true,
        message: response.data.message,
        environment: response.data.environment,
      });
    } catch (err) {
      console.error('Erro ao testar conexão:', err);
      setTestResult({
        success: false,
        message: err?.response?.data?.error || 'Erro ao testar conexão',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Efipagamentos</CardTitle>
          <CardDescription>
            Preencha os dados de integração com a Efipagamentos para processar pagamentos PIX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mensagens de Erro e Sucesso */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Erro</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Sucesso</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {testResult && (
            <div className={`border rounded-lg p-4 ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${testResult.success ? 'text-green-900' : 'text-red-900'}`}>
                    Teste de Conexão
                  </p>
                  <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                    {testResult.message}
                  </p>
                  {testResult.environment && (
                    <p className={`text-sm mt-1 ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      Ambiente: <Badge variant="outline" className="ml-1">{testResult.environment}</Badge>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Formulário */}
          <div className="space-y-4">
            {/* Client ID */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Client ID
              </label>
              <Input
                type="text"
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                placeholder="Seu Client ID da Efipagamentos"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Obtido no painel da Efipagamentos
              </p>
            </div>

            {/* Client Secret */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Client Secret
              </label>
              <div className="relative">
                <Input
                  type={showSecret ? 'text' : 'password'}
                  name="clientSecret"
                  value={formData.clientSecret}
                  onChange={handleInputChange}
                  placeholder="Seu Client Secret da Efipagamentos"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Mantém-se seguro e nunca é exibido novamente
              </p>
            </div>

            {/* PIX Key */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Chave PIX
              </label>
              <Input
                type="text"
                name="pixKey"
                value={formData.pixKey}
                onChange={handleInputChange}
                placeholder="Sua chave PIX (CPF, CNPJ, Email ou Telefone)"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Chave PIX para receber os pagamentos
              </p>
            </div>

            {/* Environment */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ambiente
              </label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleInputChange}
                disabled={saving}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="sandbox">Sandbox (Testes)</option>
                <option value="production">Produção</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Use "Sandbox" para testes e "Produção" para ambiente real
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Configurações'
              )}
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={testing || !formData.clientId || !formData.clientSecret}
              variant="outline"
            >
              {testing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Testar Conexão
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações de Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            ✓ Suas credenciais são armazenadas de forma segura no banco de dados
          </p>
          <p>
            ✓ O Client Secret é criptografado e nunca é exibido novamente
          </p>
          <p>
            ✓ Apenas administradores podem acessar e modificar essas configurações
          </p>
          <p>
            ✓ Recomenda-se usar o ambiente "Sandbox" para testes antes de ativar a produção
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

