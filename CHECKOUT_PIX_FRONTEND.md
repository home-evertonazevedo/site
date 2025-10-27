# Implementação da Tela de Pagamento PIX no Frontend

Este documento resume as alterações realizadas no componente `CheckoutPage.jsx` para integrar a exibição do QR Code PIX e o timer de expiração.

## 1. Componente `CheckoutPage.jsx`

O componente foi refatorado para gerenciar dois estados principais: a **Tela de Seleção de Quantidade** e a **Tela de Pagamento PIX**.

### 1.1. Fluxo de Compra

1.  O usuário seleciona a quantidade de bilhetes na **Tela de Seleção de Quantidade**.
2.  Ao clicar em "Confirmar Compra", a função `handlePurchase` é chamada, que envia a requisição para a API.
3.  A API retorna os dados da compra e o objeto `pixData` (contendo QR Code, URL e string de cópia e cola).
4.  O estado do componente é atualizado com `setPurchase(response)` e `setPixData(response.pixData)`, o que aciona a renderização da **Tela de Pagamento PIX**.

### 1.2. Implementação do Timer de 15 Minutos

Um `useEffect` foi implementado para gerenciar a contagem regressiva de 15 minutos (900 segundos).

*   **Estado:** `timeRemaining` (em segundos) e `paymentExpired` (booleano).
*   **Lógica:** Um `setInterval` decrementa `timeRemaining` a cada segundo.
*   **Exibição:** A função `formatTime(seconds)` exibe o tempo no formato `MM:SS`.
*   **UX:** O componente de timer muda de cor e exibe a mensagem "Cobrança Expirada" quando o tempo chega a zero.

### 1.3. Exibição do QR Code e Cópia e Cola

A **Tela de Pagamento PIX** exibe os seguintes elementos:

| Elemento | Origem dos Dados | Funcionalidade |
| :--- | :--- | :--- |
| **QR Code (Imagem)** | `pixData.qrCodeUrl` | Utiliza a URL fornecida pela API para exibir o código escaneável. |
| **Código Cópia e Cola** | `pixData.copyAndPaste` | Exibido em um bloco de código para fácil visualização. |
| **Botão Copiar** | `handleCopyPixCode` | Utiliza a API `navigator.clipboard.writeText` para copiar a string PIX. Exibe feedback "Copiado!" por 2 segundos. |

## 2. Componentes Utilizados

| Componente | Descrição |
| :--- | :--- |
| `Card`, `CardContent`, `CardHeader`, `CardTitle` | Estrutura e organização do layout. |
| `Button` | Botões de ação (Comprar, Copiar, Voltar, Dashboard). |
| `Separator` | Separador visual no resumo do pedido. |
| `Loader`, `AlertCircle`, `CheckCircle` | Ícones para estados de carregamento, erro e sucesso. |
| `Copy`, `Clock`, `QrCode` | Ícones específicos para a tela PIX. |

## 3. Próximos Passos (Frontend)

Com a implementação do QR Code e do timer, o próximo passo essencial é garantir que o status da compra seja atualizado automaticamente após o pagamento.

*   **Implementar Webhook:** O backend precisa de um endpoint para receber a notificação de pagamento da Efipagamentos.
*   **Atualização de Status:** Após o recebimento do webhook, o status da compra deve ser alterado de `PENDING` para `COMPLETED`.
*   **Pesquisa de Status (Opcional):** Implementar uma pesquisa periódica (polling) no frontend para verificar o status da compra no backend, permitindo que o usuário veja a confirmação de pagamento sem precisar atualizar a página.

