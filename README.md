# 🎬 CineHub - Catálogo Interativo de Filmes

<div align="center">



**Uma aplicação moderna e responsiva para descobrir, explorar e organizar seus filmes favoritos**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[🚀 Demo ao Vivo](https://cinehub-mw3m.vercel.app/) | [📱 Recursos](#-recursos) | [⚡ Instalação](#-instalação) | [🛠️ Tecnologias](#️-tecnologias)

</div>

---

## ✨ Visão Geral

CineHub é uma aplicação web moderna que oferece uma experiência excepcional para descobrir e explorar filmes. Desenvolvida com as tecnologias mais recentes, combina design elegante, performance otimizada e funcionalidades avançadas para cinéfilos e entusiastas do cinema.

### 🎯 Características Principais

- **🔍 Busca Inteligente** - Sistema de busca em tempo real com debounce
- **❤️ Sistema de Favoritos** - Salve e organize seus filmes preferidos
- **🎨 Temas Dinâmicos** - Alternância entre modo claro e escuro
- **📱 Design Responsivo** - Experiência perfeita em qualquer dispositivo
- **🚀 Performance Otimizada** - Carregamento rápido e suave
- **♿ Acessibilidade** - Interface inclusiva e navegação por teclado

---

## 🌟 Recursos

### 🎭 **Interface Moderna**
- Design com gradientes e animações suaves
- Skeleton loading para melhor UX
- Efeitos hover e transições fluidas
- Interface glass morphism

### 🔧 **Funcionalidades Avançadas**
- **Filtros Inteligentes**: Por gênero, ano, avaliação e popularidade
- **Paginação Infinita**: Carregamento contínuo de conteúdo
- **Sistema de Temas**: Dark/Light mode com persistência
- **Favoritos Persistentes**: LocalStorage para salvar preferências
- **Compartilhamento**: Exporte e compartilhe sua coleção
- **Estatísticas**: Analytics detalhados da sua coleção

### 🎬 **Informações Detalhadas**
- Posters em alta qualidade
- Avaliações e votos da comunidade
- Informações de lançamento
- Gêneros e classificações
- Trailers e conteúdo adicional

### 📊 **Analytics da Coleção**
- Total de filmes favoritados
- Avaliação média da coleção
- Ano mais recente
- Filmes com nota 8+


---

## ⚡ Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Chave da API TMDb (The Movie Database)

### 🚀 Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/HugoAuroraTech/cinehub.git

# Entre no diretório
cd cinehub

# Instale as dependências
npm install

# Configure a chave da API
cp .env.example .env.local
# Edite .env.local e adicione sua chave da API TMDb

# Inicie o servidor de desenvolvimento
npm run dev
```

### 🔑 Configuração da API

1. Crie uma conta no [TMDb](https://www.themoviedb.org/)
2. Obtenha sua chave da API v3
3. Adicione no arquivo `.env.local`:

```env
VITE_API_KEY="sua_chave_da_api_aqui"
```

---

## 🛠️ Tecnologias

### **Core**
- ⚛️ **React 18** - Biblioteca para interfaces de usuário
- 🔷 **TypeScript** - Tipagem estática para JavaScript
- ⚡ **Vite** - Build tool rápida e moderna
- 🎨 **Tailwind CSS** - Framework CSS utilitário

### **Navegação e Estado**
- 🧭 **React Router DOM v6** - Roteamento declarativo
- 🗂️ **Context API** - Gerenciamento de estado global
- 💾 **LocalStorage** - Persistência de dados

### **Funcionalidades**
- 🌐 **Axios** - Cliente HTTP para API calls
- 📅 **date-fns** - Manipulação de datas
- 🎯 **Lucide React** - Ícones SVG otimizados
- 🔍 **Custom Hooks** - Lógica reutilizável (useDebounce)

### **UX/UI**
- 🎭 **Animações CSS** - Transições e efeitos
- 📱 **Design Responsivo** - Mobile-first approach
- 🎨 **Gradientes** - Visual moderno e atrativo
- ♿ **Acessibilidade** - WCAG compliance

---

## 📂 Estrutura do Projeto

```
cinehub/
├── 📁 public/                  # Arquivos estáticos
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizáveis
│   │   ├── FilterBar.tsx       # Filtros avançados
│   │   ├── Header.tsx          # Cabeçalho com navegação
│   │   ├── Layout.tsx          # Layout principal
│   │   ├── MovieCard.tsx       # Card de filme
│   │   └── Skeleton.tsx        # Loading states
│   ├── 📁 hooks/              # Custom hooks
│   │   └── useDebounce.ts      # Hook de debounce
│   ├── 📁 lib/                # Utilitários
│   │   ├── axios.ts            # Configuração da API
│   │   └── context.tsx         # Context Provider
│   ├── 📁 pages/              # Páginas da aplicação
│   │   ├── Details.tsx         # Detalhes do filme
│   │   ├── Favorites.tsx       # Filmes favoritos
│   │   ├── Home.tsx            # Página principal
│   │   └── SearchResults.tsx   # Resultados de busca
│   ├── 📁 types/              # Definições TypeScript
│   │   └── index.ts            # Interfaces e tipos
│   ├── App.tsx                 # Componente raiz
│   ├── index.css              # Estilos globais
│   └── main.tsx               # Entry point
├── .env.local                  # Variáveis de ambiente
├── package.json               # Dependências
├── tailwind.config.ts         # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
└── vite.config.ts            # Configuração Vite
```

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run preview      # Preview do build

# Linting
npm run lint         # Verifica código com ESLint
```

---

## 🎨 Customização

### **Temas**
Os temas podem ser customizados em `src/index.css`:

```css
:root {
  --brand-dark: #0d1117;
  --brand-primary: #2f81f7;
  /* Suas cores personalizadas */
}
```

### **Componentes**
Todos os componentes são modulares e reutilizáveis:

```tsx
import { MovieCard } from './components/MovieCard';

// Uso simples
<MovieCard movie={movieData} />
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. **Push** para a branch (`git push origin feature/NovaFeature`)
5. **Abra** um Pull Request

### 🐛 Reportando Bugs
- Use as [Issues do GitHub](https://github.com/HugoAuroraTech/cinehub/issues)
- Forneça detalhes sobre o ambiente e passos para reproduzir

---


## 🙏 Agradecimentos

- [TMDb](https://www.themoviedb.org/) - API de dados de filmes
- [React Team](https://reactjs.org/) - Framework incrível
- [Tailwind Labs](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Ícones SVG

---

<div align="center">

**Feito com ❤️ e ☕ por [Hugo Vinicius](https://github.com/HugoAuroraTech)**

[⭐ Deixe uma estrela se gostou do projeto!](https://github.com/HugoAuroraTech/cinehub)

</div>
