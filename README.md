# Agro URL Monitor (Cypress)

Monitora disponibilidade de URLs do site com Cypress e salva o histórico em `dashboard/history.csv`.
Inclui um dashboard estático (`dashboard/index.html`) que lê o CSV e mostra quedas por URL e no tempo.

## Como usar localmente
1. **Instale dependências**
   ```bash
   npm ci
   ```
2. **Edite as URLs**
   - Coloque as URLs prioritárias em `urls/primary.json`
   - Coloque as URLs secundárias em `urls/secondary.json`

3. **Rode os testes (e gere histórico)**
   ```bash
   npm run monitor
   ```
   Os resultados serão salvos/append em `dashboard/history.csv`.

4. **Veja o dashboard**
   ```bash
   npm run serve:dashboard
   # abra http://localhost:8080
   ```

## GitHub Actions (monitoramento agendado)
O workflow em `.github/workflows/monitor.yml` roda o Cypress em agendamento (cron),
e faz commit automático do `dashboard/history.csv` e de arquivos do dashboard para
o próprio repositório (requer permissões padrão de GITHUB_TOKEN).

### Passos
- Crie um repositório e suba esses arquivos.
- Ajuste o cron no workflow, se quiser.
- Habilite GitHub Pages (branch `gh-pages` ou via GitHub Actions se preferir).
- O dashboard lê o `history.csv` diretamente do repositório; quando publicado no Pages,
  acesse a página e veja os gráficos.

## Estrutura do CSV
`timestamp,url,status,duration_ms,group`

- **timestamp**: ISO string do momento do teste
- **url**: URL testada
- **status**: HTTP status code retornado
- **duration_ms**: duração do request em milissegundos (aproximado)
- **group**: "primary" ou "secondary"

## Observações
- Ajuste a lista de status que considera "OK" no `cypress.config.js` → `env.okStatuses`.
- Caso a URL redirecione, status 3xx também é considerado OK por padrão.
- Você pode configurar alertas (Slack/Email) adicionando steps no workflow para ler o CSV
  do último run e disparar notificações se houver quedas.