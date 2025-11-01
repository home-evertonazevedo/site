# Implementação da Visualização de Participações no Dashboard

## Objetivo
Ajustar o dashboard do cliente para exibir as compras e bilhetes reais associados ao usuário logado, substituindo os dados simulados.

## Alterações no Backend (API)

| Arquivo | Descrição |
| :--- | :--- |
| `src/routes/purchaseRoutes.ts` | Adicionada a rota `GET /purchases/user/me` para buscar as compras do usuário autenticado. |
| `src/controllers/purchaseController.ts` | Adicionado o método `getUserPurchases` que busca todas as compras do usuário logado, incluindo os detalhes da rifa associada (`raffle`). |

### Detalhes do Endpoint

**Endpoint:** `GET /purchases/user/me`
**Autenticação:** Necessária (Bearer Token)
**Retorno:** Lista de objetos `Purchase` com o objeto `Raffle` aninhado.

## Alterações no Frontend (Site)

| Arquivo | Descrição |
| :--- | :--- |
| `src/api/raffleService.js` | Adicionada a função `getUserPurchases` para consumir o novo endpoint da API. |
| `src/components/Dashboard.jsx` | Refatorado para: <ul><li>Remover dados simulados.</li><li>Utilizar `raffleService.getUserPurchases()` para buscar dados reais.</li><li>Exibir as compras do usuário na seção "Minhas Participações".</li><li>Exibir o status da compra (`PENDING`, `COMPLETED`, `CANCELLED`) com badges coloridos.</li><li>Exibir os números dos bilhetes comprados.</li><li>Tratar estados de carregamento, erro e lista vazia.</li></ul> |

## Próximos Passos

1.  Commit e Push das alterações.
2.  Testes de integração final.
3.  Implementar a lógica de cancelamento de compras expiradas (sugestão anterior).
4.  Implementar a funcionalidade de "Tentar Novamente" no frontend para compras com erro de PIX.

