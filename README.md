# CMS - Wortise Challenge

Full-stack CMS platform for creating and managing blog articles.

## 🚀 Live Demo

**Production:** https://wortise-challenge-nu.vercel.app

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** tRPC, Better Auth, MongoDB
- **Validation:** Zod, React Hook Form
- **State Management:** TanStack Query
- **Internationalization:** next-intl (English/Spanish)
- **Deployment:** Vercel

## ✨ Features

- User authentication (register/login)
- Article CRUD operations
- Server-side search (by title, content, author)
- Pagination
- Protected routes
- Author listing with article counts
- Responsive design
- Dark mode support
- Bilingual (EN/ES)

## 🤖 AI Assistance

This project was developed with AI assistance from **Claude 3.5 Sonnet (Anthropic)**.

AI was used for:

- Architecture planning and setup
- tRPC configuration and type-safety implementation
- Better Auth integration
- MongoDB schema design and indexing
- CRUD operations implementation
- UI component development
- Internationalization setup
- Performance optimizations

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure
4. Run development server: `npm run dev`
5. Open http://localhost:3000

## 📦 Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 👤 Author

David Borgat

## 📄 License

MIT
