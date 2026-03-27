# Frontend Documentation

> **v2.1 - React + TypeScript + Vite + TailwindCSS**

**Last Updated**: 2024-03-26

**⚠️ AI Agent**: 
- Update file ini untuk fitur frontend baru
- Jangan buat file dokumentasi terpisah
- Gunakan versioning (v2.1, v2.2, dst)
- Update CHANGELOG.md

---

## 📋 Daftar Isi

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Component Library](#component-library)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Frontend modern dengan:
- ✅ React 18 + TypeScript
- ✅ Vite (Fast HMR)
- ✅ TailwindCSS v3
- ✅ React Router v6
- ✅ Axios untuk API calls
- ✅ 2 Template: Modern & Admin

### Tech Stack
- React 18
- TypeScript
- Vite
- TailwindCSS v3
- React Router v6
- Axios

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.development
```

Edit `.env.development`:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Development
```bash
npm run dev
```

### 4. Build
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

### 6. Verify
- App: http://localhost:5173
- Modern Template: http://localhost:5173/modern
- Admin Template: http://localhost:5173/admin

---

## 📁 Project Structure

```
src/
├── components/              # Reusable components
│   ├── modern/             # Modern template components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── FeatureCard.tsx
│   │   └── PricingCard.tsx
│   │
│   └── admin/              # Admin template components
│       ├── AdminLayout.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── DataTable.tsx
│       ├── FormField.tsx
│       └── Modal.tsx
│
├── pages/                   # Page components
│   ├── modern/             # Modern template pages
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   │
│   └── admin/              # Admin template pages
│       ├── DashboardPage.tsx
│       ├── UsersPage.tsx
│       └── SettingsPage.tsx
│
├── services/               # API services
│   └── api.ts             # Axios configuration
│
├── App.tsx                # Main app component
├── main.tsx              # Entry point
└── index.css             # Global styles + Tailwind
```

---

## 💻 Development Guide

### Creating New Page

1. **Create Page Component**:
```typescript
// src/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">New Page</h1>
    </div>
  );
}
```

2. **Add Route**:
```typescript
// src/App.tsx
import NewPage from './pages/NewPage';

<Route path="/new" element={<NewPage />} />
```

### API Integration

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const userService = {
  getAll: () => api.get('/api/users'),
  getById: (id: string) => api.get(`/api/users/${id}`),
  create: (data: any) => api.post('/api/users', data)
};
```

### Using API in Component

```typescript
import { useState, useEffect } from 'react';
import { userService } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getAll()
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Component Library

### Modern Template

#### Navbar
```tsx
import { Navbar } from '../components/modern';

<Navbar />
```

#### Hero Section
```tsx
import { Hero } from '../components/modern';

<Hero 
  title="Welcome"
  subtitle="Get started today"
/>
```

#### Feature Card
```tsx
import { FeatureCard } from '../components/modern';

<FeatureCard
  icon={<Icon />}
  title="Feature"
  description="Description"
/>
```

### Admin Template

#### Button
```tsx
import { Button } from '../components/admin';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

#### Card
```tsx
import { Card } from '../components/admin';

<Card title="Card Title">
  Content here
</Card>
```

#### DataTable
```tsx
import { DataTable } from '../components/admin';

<DataTable
  columns={columns}
  data={data}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### Modal
```tsx
import { Modal } from '../components/admin';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
>
  Modal content
</Modal>
```

**Detailed Guide**: [../DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md)

---

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Login & Initialize**:
```bash
firebase login
firebase init hosting
```

3. **Configure** (`firebase.json`):
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. **Deploy**:
```bash
npm run build
firebase deploy
```

**Detailed Guide**: [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md)

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## 🐛 Troubleshooting

### Vite Server Won't Start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### TailwindCSS Not Working

1. Check `tailwind.config.js`:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

2. Verify `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Restart dev server

### Environment Variables Not Working

1. File name must be `.env.development` (not `.env`)
2. Variables must start with `VITE_`
3. Restart dev server after changes

### Build Failed

```bash
# Clean install
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### CORS Error

Update backend `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

**More Solutions**: [../TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

---

## 📚 Additional Resources

- **[Developer Guide](../DEVELOPER_GUIDE.md)** - Komponen & Arsitektur Lengkap
- **[Main README](../README.md)** - Informasi root proyek
- **[Changelog](../CHANGELOG.md)** - Riwayat perubahan

---

**Version**: 2.1
**Last Updated**: 2024-03-26
**Need Help?** Check [Troubleshooting](#troubleshooting) atau [Main Documentation](../README.md)
