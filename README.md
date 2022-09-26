# <p align = "center"> Projeto Sing me a Song </p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-SEU_NOME-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/mtsgamorim/Sing-Me-A-Song?color=4dae71&style=flat-square" />
</p>

## :clipboard: Descrição

Sing me a song é uma aplicação para recomendação anônima de músicas.Quanto mais pessoas curtirem uma recomendação, maior a chance dela ser recomendada para outras pessoas.

---

## :computer: Tecnologias e Conceitos

- REST APIs
- JWTs
- Node.js
- TypeScript
- Postgres with Prisma
- Jest and Supertest
- Cypress

---

## 🏁 Rodando a aplicação

Este projeto foi inicializado com o [Create React App](https://github.com/facebook/create-react-app), então certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/mtsgamorim/Sing-Me-A-Song.git
```

Depois, dentro da pasta back-end, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Adicione um arquivo .env seguindo o modelo do .env-example

Finalizado o processo, é só inicializar o servidor

```
npm run dev
```

Depois, abra outro terminal na pasta front-end

Rode o comando

```
npm install
```

Adicione o arquivo .env seguindo o modelo do .env-example

Depois rode o comando

```
npm start
```

E pronto, a aplicação podera ser acessada no seu navegador web

---

## 🏁 Área de testes

### Para os testes de integração:

Vá a pasta do back-end, e rode o comando:

```
npm test
```

### Para os testes unitarios:

Vá a pasta do back-end, e rode o comando:

```
npm run test:unit
```

### Para os testes de ponta a ponta:

Ligue o servidor e a aplicação do front, como nos passos de inicializar projeto.

Com outro terminal, entre na pasta front-end e rode o comando

```
npx cypress open
```

Vai abrir a aplicação cypress, escolha teste e2e e lá ja estará o script de tests, com o nome: tests.cy.js

Basta clicar nela e ela irá rodar os testes
