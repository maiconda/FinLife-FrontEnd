# FinLife Frontend

### Para rodar o projeto siga os passos abaixo:

#### Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

 - Node.js (versão recomendada LTS)
 - PNPM

Após isso:

1. Instale as dependências do projeto com o comando:
   ```bash
   pnpm install
   ```
2. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis de ambiente:
   ```env
   NEXT_PUBLIC_API_URL= Sua rota da API
   ```
3. Inicie o servidor de desenvolvimento com o comando:
   ```bash
   pnpm run dev
