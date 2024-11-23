# Automação Requestia

Automação dedicada a download de relatórios do Requestia.

## Utilização

### 1. Instalar as dependências

Execute o comando abaixo para instalar todas as dependências do projeto:
```bash
$ npm install # or pnpm install or yarn install
```

### 2. Criar as pastas dist e downloads

Após instalar as dependências, crie as pastas `dist` e `downloads` para armazenar os arquivos gerados pela aplicação:
```bash
$ mkdir dist
$ mkdir downloads
```

### 3. Criar o arquivo .env

Na raiz do projeto, crie um arquivo .env com conteúdo de acordo com o .env.example

### 4. Build da aplicação

Antes de rodar a aplicação, é necessário gerar o build. Execute o comando abaixo para compilar a aplicação:
```bash
$ npm run build
```

### 5. Rodar a aplicação

Após gerar o build, você pode rodar a aplicação com o comando:
```bash
$ npm start
```