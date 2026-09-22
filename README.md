# Clima Santa Ella — Bot de WhatsApp

Bot de WhatsApp para consultar a previsão do tempo de uma região específica de Santa Ella, Araçariguama (SP).

## O que já está implementado

- `oi`, `menu`, `ajuda`
- `agora`
- `hoje`
- `amanhã` / `amanha`
- `chuva`
- `vai chover?`
- `sol`
- resposta para mensagens não reconhecidas
- consulta à Open-Meteo
- webhook da Meta WhatsApp Cloud API
- verificação do webhook
- envio de mensagens pelo WhatsApp
- verificação periódica de chuva e alerta automático
- cooldown para evitar spam de alertas

## Requisitos

- Node.js 18+
- Uma conta configurada na Meta para WhatsApp Cloud API
- Um número de WhatsApp conectado à API
- Token de acesso e Phone Number ID da Meta

## Instalação

1. Copie `.env.example` para `.env`.
2. Preencha as variáveis do `.env`.
3. Instale as dependências:

```bash
npm install
```

4. Rode:

```bash
npm start
```

O servidor ficará em `http://localhost:3000`.

## Webhook da Meta

Configure na aplicação da Meta:

- Callback URL: `https://SEU_DOMINIO/webhook`
- Verify Token: exatamente o valor de `WHATSAPP_VERIFY_TOKEN`

Depois assine o campo de mensagens (`messages`).

Para testes locais, você precisa expor seu servidor à internet com um túnel HTTPS, como uma ferramenta de túnel apropriada.

## Coordenadas

O arquivo `.env.example` contém coordenadas de exemplo/aproximadas. Antes de usar o bot, substitua por um ponto representativo da região de Santa Ella que você quer monitorar.

Não use coordenadas exatas de uma residência em um bot público.

## Alertas

O bot verifica a previsão a cada `ALERT_INTERVAL_MINUTES`.

Quando encontra probabilidade de chuva >= `RAIN_ALERT_PROBABILITY` em uma das próximas horas, envia alerta para usuários que já conversaram com o bot.

O `ALERT_COOLDOWN_MINUTES` impede alertas repetidos para o mesmo usuário.

## Observações importantes

- A API da Open-Meteo é usada para os dados meteorológicos.
- O bot não cria nem fornece um número de WhatsApp. O número precisa ser seu e estar configurado na Meta.
- Para produção, use HTTPS, banco de dados e armazenamento persistente dos usuários.
