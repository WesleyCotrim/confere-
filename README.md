# Sistema de Conferências
Site estático (GitHub Pages) + Supabase. Veja o passo a passo no chat ou siga:
1. Supabase: criar projeto, rodar `sql/setup.sql`, criar usuários, desativar cadastro público.
2. Colar URL e chave anon em `js/app.js`.
3. Subir para um repositório do GitHub e ativar Pages (branch main, pasta root).
4. Em Settings > Secrets > Actions criar `SUPABASE_URL` e `SUPABASE_KEY` para o keepalive.
