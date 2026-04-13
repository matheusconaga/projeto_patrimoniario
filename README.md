# 🏢 Sistema de Gestão de Patrimônio

Sistema web para gerenciamento completo de patrimônios, com foco em praticidade, automação e visualização inteligente dos dados.

A aplicação permite o controle total dos ativos através de uma interface moderna em página única (SPA), utilizando apenas frontend integrado a serviços terceiros.

---

# 🚀 Funcionalidades

## 📦 Gestão de Patrimônios

* Cadastro de patrimônios
* Edição de informações
* Exclusão de registros
* Organização por categorias e modelos dinâmicos

---

## 📊 Visualização de Dados

* Dashboards interativos
* Tabelas completas com listagem dos patrimônios
* Visualização prática em página única

---

## 🔍 Filtros Avançados

* Filtragem por categoria
* Filtragem por modelo
* Busca específica por patrimônio
* Combinação de múltiplos filtros

---

## 📥 Importação e Exportação

* Importação automática via arquivo Excel
* Download de template Excel
* Exportação de dados

---

## 🏷️ Etiquetas com QR Code

* Geração de etiquetas individuais ou em lote
* Seleção específica de patrimônios para geração
* Download em PDF
* Leitura via celular
* Acesso às informações do patrimônio via QR Code (necessário login)

---

## 🧠 Gestão Dinâmica

* Criação de categorias e modelos diretamente na interface
* Sem necessidade de telas separadas
* Fluxo simplificado e ágil

---

# 🛠️ Tecnologias Utilizadas

## Frontend

* React + Vite

## Serviços Externos

* Firebase Authentication → autenticação de usuários
* Firestore → banco de dados em tempo real
* Cloudinary → armazenamento e entrega de imagens

---

# 🧩 Arquitetura

O sistema foi desenvolvido sem backend próprio, utilizando:

* Frontend como camada principal
* Firebase para autenticação e persistência
* Cloudinary para armazenamento de mídia

Isso permite:

* Alta escalabilidade
* Baixa complexidade de infraestrutura
* Deploy simplificado

---

# 💻 Como rodar o projeto localmente

## 🔧 Pré-requisitos

* Node.js instalado (recomendado versão LTS)
* NPM ou Yarn

---

## 📥 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

---

## 📂 2. Acesse a pasta do projeto

```bash
cd gestao_patrimonial
```

---

## 📦 3. Instale as dependências

```bash
npm install
```

ou

```bash
npm i
```

---

## ▶️ 4. Execute o projeto

```bash
npm run dev
```

---

## 🌐 5. Acesse no navegador

O sistema estará disponível em:

```
http://localhost:5173
```

---

# ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

---

# 🔐 Autenticação

* O acesso ao sistema requer login
* A leitura de QR Code também exige autenticação
* Controle de acesso feito via Firebase Auth

---

# 📱 Uso via celular

* Leitura de QR Code direciona para página do patrimônio
* Necessário estar autenticado para visualizar os dados
* Interface responsiva

---

# 📌 Diferenciais do Projeto

* Arquitetura sem backend próprio
* Integração com serviços modernos (Firebase + Cloudinary)
* Geração de etiquetas com QR Code
* Importação em massa via Excel
* Interface única e fluida
* Sistema dinâmico sem telas redundantes

---

# 🚧 Possíveis melhorias futuras

* Backend dedicado para maior controle de segurança
* Controle de permissões por usuário
* Histórico de alterações
* Auditoria de ações
* Notificações automáticas
* Integração com IA para análise de patrimônio

---

# 📄 Licença

Este projeto é de uso livre para fins de estudo e desenvolvimento.

---

# 👨‍💻 Autor

Desenvolvido por Matheus Lula
