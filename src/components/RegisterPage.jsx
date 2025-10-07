import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import authService from "../api/authService";

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inscricao: '',
    cellphone: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const cpf = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value) => {
    // Remove tudo que não é dígito
    const phone = value.replace(/\D/g, '');
    
    // Aplica a máscara para celular
    if (phone.length <= 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      inscricao: formatted
    }));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      cellphone: formatted
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }
    
    if (!formData.inscricao.trim()) {
      setError('CPF é obrigatório');
      return false;
    }
    
    // Validação básica de CPF (11 dígitos)
    const cpfNumbers = formData.inscricao.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      return false;
    }
    
    if (!formData.cellphone.trim()) {
      setError('Telefone é obrigatório');
      return false;
    }
    
    // Validação básica de telefone (10 ou 11 dígitos)
    const phoneNumbers = formData.cellphone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      setError('Telefone inválido');
      return false;
    }
    
    if (!formData.password) {
      setError('Senha é obrigatória');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar dados para envio (remover confirmPassword e limpar formatação)
      const dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        inscricao: formData.inscricao.replace(/\D/g, ''), // Remove formatação do CPF
        cellphone: formData.cellphone.replace(/\D/g, ''), // Remove formatação do telefone
        password: formData.password,
        role: formData.role
      };
      
      const response = await authService.register(dataToSend);
      setMessage('Usuário registrado com sucesso!');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      console.log('Registration successful:', response);
    } catch (err) {
      setError(err.message || 'Erro ao registrar usuário.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-foreground">Cadastrar</CardTitle>
        <CardDescription className="text-muted-foreground">
          Crie sua conta para participar das rifas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                required
                className="bg-background border-border text-foreground"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="bg-background border-border text-foreground"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inscricao" className="text-foreground">CPF</Label>
              <Input
                id="inscricao"
                name="inscricao"
                type="text"
                placeholder="000.000.000-00"
                required
                className="bg-background border-border text-foreground"
                value={formData.inscricao}
                onChange={handleCPFChange}
                maxLength={14}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cellphone" className="text-foreground">Telefone</Label>
              <Input
                id="cellphone"
                name="cellphone"
                type="text"
                placeholder="(11) 99999-9999"
                required
                className="bg-background border-border text-foreground"
                value={formData.cellphone}
                onChange={handlePhoneChange}
                maxLength={15}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground">Tipo de Usuário</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuário</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                className="bg-background border-border text-foreground"
                value={formData.password}
                onChange={handleInputChange}
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                required
                className="bg-background border-border text-foreground"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <a href="/login" className="text-primary hover:underline">
            Faça login
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
