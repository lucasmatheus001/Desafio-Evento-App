# Desafio-Evento-App
### Pré-requisitos 

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [PostgreSQL](https://www.postgresql.org/). [PHP](https://www.php.net/downloads.php), [Composer](https://getcomposer.org/download/) Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).

## Visão Geral

Este é uma sistema chamado : "Morena", onde a mesma aplicação será desenvolvida para gerenciar eventos, através de uma forma simples e intuitiva os usuários poderão criar, visualizar, se inscrever e gerenciar os eventos que estão inscritos.

## O que foi utilizado até o momento?

 1. Laravel 11
 2. PHP 8.3.21
 2.  React com Vite e Tailwind.css
 3.  Node 22.15
 4.  PostgreSQL

## Principais funcionalidades
-  [x] Listagem de Eventos na home
 - [x] Cadastro de usuários;
 - [x] Login;
 - [x] Criação de eventos para usuários autenticados ;
 - [x] Edição de eventos e Exclusão para usuários;
-  [x] Inscrição em eventos e validação para não participar de eventos que ocorram no mesmo momento.

## Pendências

 - [x] Documentação geral do sistema (README);
 - [ ] melhorar as seeds
 - [ ] melhorar os testes
 - [ ] melhorar as regras de negócios
 - [ ] Aplicar corretamente a internacionalização na aplicação;

## Arquitetura Utilizada para o plataforma

### Frontend (React com Vite e tailwind.css)

- Foi utilizado o framework React com vite utilizando tailwind.css para estilização da plataforma.

### Backend (Laravel)

- Foi utilizado o framework Laravel para a criação da API no backend.

### Banco de Dados (PostgreSQL)

- Foi utilizado o Banco de dados com PostgreSQL para gerenciar o armazenamento de dados dos eventos e os dados do usuário.


## Rotas da API
|Método HTTP | Endpoint | Exige autenticação? |
|---|---|---|
|GET         | /api/events | Não
|POST        | /api/register | Não
|POST        | /api/login | Não
|POST        | /api/logout | Sim
|GET         | /api/events/{uuid} | Não
|POST        | api/events | Sim
|PUT         | /api/events/{uuid} | Sim
|DELETE      | /api/events/{uuid} | Sim
|POST        | /api/events/{uuid}/subscribe | Sim
|GET         | /api/events/{uuid}/subscription-status | Sim
|GET         | /api/my-subscriptions | Sim
|DELETE      | /api/event/{uuid}/unsubscribe | Sim


## Fluxo da utilização da aplicação

### Página Inicial (Listagem de Eventos - Home):

Ao ser carregada a página inicial (HOME), o frontend envia uma requisição ao backend para obter todos os eventos que estajam ativos.

**Endpoint:** `/api/events`</br>
**Requisição:** `GET`</br>
**Response:** O backend retorna todos os eventos que estão ativos para inscrição, incluindo detinformações como a data, o local, a descrição, capacidade máxima de incritos e faz a verificação se o usuário já está inscrito.

### Autenticação do Usuário:

O usuário precisa estar (obrigatoriamente) logado para realizar ações como a inscrição em eventos ou gerenciamento dos mesmos.

Autenticação via API, onde o usuário no formulário de login envia suas credenciais para a API.

**Endpoint:** `/api/login`</br>
**Requisição:** `POST`</br>
**Response:** O backend retorna um token de autenticação (JWT ou sessão) que é utlizado pelo frontend para realizar a autenticação.

### Inscrição do usuário em um Evento:

O usuário, após se autenticar, pode se inscrever em qualquer evento. O backend realiza uma vericação não permitindo que o usuário esteja inscrito em dois eventos que ocorram no mesmo intervalo de tempo.

**Endpoint:** `/api/events`</br>
**Requisição:** `POST`</br>

**Response:** E exibido em Tela um alert confirmando a inscrição ou a exibição da mensagem de erro se houver conflitos.

### Gerenciamento de Eventos do Usuário (Editar, Excluir):

Os usuário precisam estar logados para criar, editar ou excluir eventos, e apenas os usuários criadores do evento podem gerenciar os mesmos.

**1. Editar Evento:**

O usuário pode editar apenas eventos criados por ele próprio.

**Endpoint:** `/api/events/{uuid}`</br>
**Requisição:** `PUT`</br>

**Response:** Evento é Atualizado ou é exibido a mensagem de erro se o usuário não for o dono do evento.

**2. Excluir Evento:**

**Requisição (DELETE):** O usuário pode excluir somente eventos criados pelo mesmo.

**Endpoint:** `/api/events/{uuid}`</br>
**Requisição:** `DELETE`</br>
**Response:** Confirmação de exclusão do evento ou exibição da mensagem de erro se o usuário não for o criador do evento.

## Instalando o projeto
**Passos de Configuração:**

**Clone o Repositório:**

  https://github.com/lucasmatheus001/Desafio-Evento-App

### Frontend

Entre na pasta `frontend`e execute:

  ```bash
  npm install
  ```
Após rode:

  ```bash
  npm run build
  ```
Para iniciar o frontend digite:

  ```bash
  npm run dev
  ```

### Backend
Em outra instância do terminal entre na pasta `/backend`.

Execute o seguinte comando para instalar as dependências :
  ```bash
  composer install
  ```

### Crie o Arquivo `.env`
 ```bash
  cp .env.example .env
  ```

Abra seu PostgreSQL ou MYSQL e cri um banco de dados vazio.
```bash
CREATE DATABASE nome_do_banco;
CREATE USER nome_usuario WITH PASSWORD 'senha';
GRANT ALL PRIVILEGES ON DATABASE nome_do_banco TO nome_usuario;
```
### Configure seu arquivo `.env`

```bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nome_do_banco
DB_USERNAME=nome_usuario
DB_PASSWORD=senha
```

### Gere a Key da aplicação
```bash
php artisan key:generate
```
E para uso da autenticação com JWT rode também:
```bash
php artisan jwt:secret
```
### Rodar as migrations para criação do banco de dados
```bash
php artisan migrate
```

### Rodar as Seeds para popular o banco de dados
```bash
php artisan db:seed
```
Limpe o cache da aplicação
```bash
php artisan config:cache
```
Para Subir a aplicação execute:
```bash
php artisan serve
```

**Acessar a Aplicação:**

A aplicação será acessível em :</br>
FrontEnd - (React com Vite) - ` http://localhost:5173/`</br> 
Backend - (Laravel API) - ` http://localhost:8000`
## Imagem da aplicação

![image](https://github.com/user-attachments/assets/2fa0e33f-a6fa-42d0-95a3-6e4f51c0da9c)
![image](https://github.com/user-attachments/assets/2c00af29-330e-4ca8-8142-3b1d038deed2)

## Video da aplicação
https://github.com/user-attachments/assets/fb400657-56b2-4308-99ee-b022ca6ad84f



