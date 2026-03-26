# Claude Example Module

## Overview
Module contoh untuk demonstrasi cara kerja framework.

## Agent
- **Name**: Claude
- **Version**: 1.0.0
- **Created**: 2026-03-26

## Features
- List page dengan navigation
- Detail page dengan dynamic routing
- Demonstrasi useNavigate dan useParams

## Routes
- `/example` - List page
- `/example/detail/:id` - Detail page

## Files
```
claude-example/
├── pages/
│   ├── ExampleListPage.tsx
│   └── ExampleDetailPage.tsx
├── routes.ts
├── module.json
└── README.md
```

## Usage
Module ini sudah registered di `FE/src/routes.ts`.

Akses di browser:
- http://localhost:3000/example
- http://localhost:3000/example/detail/1
