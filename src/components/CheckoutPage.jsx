import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Informações do Produto */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Produto Adquirido</CardTitle>
            </CardHeader>
            <CardContent>
              <img src="https://via.placeholder.com/150" alt="Produto" className="w-full h-auto object-cover mb-4 rounded-md" />
              <h3 className="text-lg font-semibold">Nome do Produto da Rifa</h3>
              <p className="text-muted-foreground">Quantidade: X cotas</p>
              <p className="text-muted-foreground">Valor Total: R$ YYY,YY</p>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Usuário e Pagamento */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Suas Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input id="fullName" type="text" placeholder="Seu nome completo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" type="text" placeholder="000.000.000-00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" required />
                </div>
                <Button className="w-full">Finalizar Pedido</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


