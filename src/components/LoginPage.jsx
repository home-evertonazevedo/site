import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import authService from "../api/authService";

export function LoginPage() {
  const [inscricao, setInscricao] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await authService.login(inscricao, password);
      setMessage(response.message || 'Login bem-sucedido!');
      // Redirecionar ou armazenar token
      console.log('Login successful:', response);
    } catch (err) {
      setError(err.message || 'Erro ao fazer login.');
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    try {
      const response = await authService.forgotPassword(inscricao);
      setMessage(response.message || 'Email de redefinição enviado!');
      console.log('Forgot password successful:', response);
    } catch (err) {
      setError(err.message || 'Erro ao solicitar redefinição de senha.');
      console.error('Forgot password error:', err);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Entrar</CardTitle>
          <CardDescription className="text-muted-foreground">
            Acesse sua conta para gerenciar suas rifas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-foreground">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  required
                  className="bg-background border-border text-foreground"
                  value={inscricao}
                  onChange={(e) => setInscricao(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-background border-border text-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4">
              Entrar
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Esqueceu sua senha?{" "}
            <a href="#" onClick={handleForgotPassword} className="text-primary hover:underline">
              Recuperar Senha
            </a>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <a href="/register" className="text-primary hover:underline">
              Cadastre-se
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}


