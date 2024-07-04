# Foodie Service Order

OBS: Necessario ajustar arquivo.
Foodie Production é um microsserviço projetado para gerenciar a fase de produção de pedidos de alimentos. Ele ouve eventos de pagamento de pedidos, atualiza o status do pedido para 'em produção' e se comunica com outros microsserviços para gerenciar o ciclo de vida da produção.

## Tabela de Conteúdos

- [Introdução](#introdução)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Configuração](#configuração)
- [Endpoints da API](#endpoints-da-api)
- [Testes](#testes)
- [Cobertura de Testes](#cobertura-de-testes)
- [Docker](#docker)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Introdução

Foodie Production faz parte do projeto FoodieFlow, que visa otimizar o processo de gerenciamento de pedidos de alimentos. Este microsserviço é responsável por rastrear pedidos que estão na fase de produção e garantir que sejam atualizados e comunicados a outras partes do sistema.

## Funcionalidades

- Ouvir eventos de pagamento de pedidos
- Atualizar status do pedido para 'em produção'
- Comunicar-se com outros microsserviços para gerenciar o ciclo de vida da produção do pedido
- Listar todos os pedidos atualmente em produção
- Marcar pedidos como 'pronto'

## Tecnologias Utilizadas

- NestJS
- TypeScript
- SQS (Amazon Simple Queue Service)
- Jest (para testes)
- Eslint e Prettier (para qualidade de código)
- Docker

## Instalação

### Pré-requisitos

- Node.js (>=14.x)
- npm (>=6.x) ou yarn
- Docker (para ambiente containerizado)

### Passos

1. Clone o repositório:

    ```bash
    git clone https://github.com/emenezes93/foodie_production.git
    cd foodie_production
    ```

2. Instale as dependências:

    ```bash
    npm install
    # ou
    yarn install
    ```

3. Configure as variáveis de ambiente:

    Crie um arquivo `.env` no diretório raiz e configure-o com base no arquivo `.env.example`.

4. Inicie a aplicação:

    ```bash
    npm run start:dev
    # ou
    yarn start:dev
    ```

## Uso

Para executar a aplicação em um ambiente de desenvolvimento, use o comando de start como mostrado acima. Isso iniciará o servidor e monitorará mudanças nos arquivos.

Para produção, construa a aplicação e inicie-a usando:

```bash
npm run build
npm run start:prod
# ou
yarn build
yarn start:prod
```

## Configuração
A configuração pode ser gerenciada usando variáveis de ambiente. Consulte o arquivo .env.example para uma lista de variáveis necessárias.

### Endpoints da API Pedidos

Lista todos os pedidos atualmente em produção.

#### GET /orders/in-production

Atualiza o status de um pedido para 'em produção'.

#### POST /order/preparation

Exemplo de body:
```bash
{
    "id": "2",
    "status": "2"
}
```

Marca um pedido como 'pronto'.

#### POST /order/finish

Exemplo de body:
```bash
{
    "id": "2",
    "status": "3"
}
```

## Testes
Para executar os testes, use:

```bash
npm run test
# ou
yarn test
```
Para cobertura de testes, use:

```bash
npm run test:cov
# ou
yarn test:cov
```

## Cobertura de Testes
O projeto visa manter um alto nível de cobertura de testes. Abaixo está o resumo da cobertura:

```bash
File                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------------|---------|----------|---------|---------|-------------------
All files                        |   92.36 |    92.59 |   93.54 |   90.9  |
__tests__/domain/use-cases       |     100 |      100 |     100 |     100 |
ConsumerSqsPortsMock.ts          |     100 |      100 |     100 |     100 |
order.service.mock.ts            |     100 |      100 |     100 |     100 |
__tests__/infrastructure/adapters|     100 |      100 |     100 |     100 |
OrderRequestService.mock.ts      |     100 |      100 |     100 |     100 |
src                              |    62.5 |    100   |     100 |   59.09 | 1-22
app.module.ts                    |     100 |      100 |     100 |     100 |
main.ts                          |       0 |      100 |       0 |       0 |
src/api/controllers              |     100 |      100 |     100 |     100 |
consumer-sqs.controller.ts       |     100 |      100 |     100 |     100 |
health.controller.ts             |     100 |      100 |     100 |     100 |
order.controller.ts              |     100 |      100 |     100 |     100 |
src/api/dto                      |     100 |      100 |     100 |     100 |
consumer-sqs.dto.ts              |     100 |      100 |     100 |     100 |
src/config                       |     100 |      100 |     100 |     100 |
config.ts                        |     100 |      100 |     100 |     100 |
src/domain/use-cases             |     100 |      100 |     100 |     100 |
order.service.ts                 |     100 |      100 |     100 |     100 |
sqs.consumer-service.ts          |     100 |      100 |     100 |     100 |
src/infrastructure/adapters      |     100 |      100 |     100 |     100 |
consumer-sqs.adapter.ts          |     100 |      100 |     100 |     100 |
src/infrastructure/axios         |    97.05|    86.66 |     100 |    96.66|
build.response.ts                |     100 |      100 |     100 |     100 |
order.request.service.ts         |      95 |   66.66  |      75 |    94.44| 35
request.service.ts               |      100|   91.66  |     100 |      100| 38
src/infrastructure/enums         |     100 |      100 |     100 |     100 |
http.method.enum.ts              |     100 |      100 |     100 |     100 |
src/infrastructure/interfaces/order|       0|      100|       0|       0 |
order.request.interface.ts       |       0|      100 |       0 |       0 | 1

```

## Docker
Para executar a aplicação usando Docker, você pode usar o Dockerfile fornecido no repositório.

#### Construindo a Imagem Docker
1 . Construa a imagem Docker:

```bash
docker build -t foodie_production .
```
2 . Execute o container Docker:

```bash
docker run -d -p 3000:3000 --env-file .env foodie_production
```

Isso iniciará a aplicação no modo de produção no porto 3000.