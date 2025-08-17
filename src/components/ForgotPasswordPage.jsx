import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"

export function ForgotPasswordPage() {
  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Recuperar Senha</CardTitle>
          <CardDescription className="text-muted-foreground">
            Informe seu CPF para receber instruções de recuperação de senha.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-foreground">CPF</Label>
              <Input id="cpf" type="text" placeholder="000.000.000-00" required className="bg-background border-border text-foreground" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Enviar Instruções
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Lembrou da senha?{" "}
            <a href="/login" className="text-primary hover:underline">
              Voltar para o Login
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  )
}