# Frontend Interview Test

This repository contains the frontend take-home assignment for the technical interview.

---

## Instructions

Complete the assignment according to the requirements provided separately. Submit your solution by pushing your code to this repository.

### Features to Implement

**CRUD Operations for Products**

- **List Products** — Display all products in a grid/list  
- **Create Product** — Form to add new product  
- **Edit Product** — Form to update existing product  
- **Delete Product** — Remove a product with confirmation  
- **Upload Media** — Manage media catalog (preview, upload, reorder, delete)  

### Product Data Structure

```ts
interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  description: string;
  category: string; // "roses" | "tulips" | "lilies" | "mixed"
}
```

### Technical Requirements

- **Framework:** Remix.js OR TanStack Start
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Forms:** react-hook-form with validation
- **TypeScript:** Properly typed, no any

### Form Validation Rules

- Name: required, min 3 chars
- Price: required, number, min 0.01
- Stock: required, number, min 0
- Description: required, min 10 chars, max 200 chars
- Category: required, one of the options

### What We're NOT Testing
- Accessibility
- URL state management
- Lazy loading
- Authentication
- Complex animations

### Deliverables

- GitHub repository with README
- PR with implementation, submit PR to:
    - https://github.com/fifty-git/test-1
    - https://github.com/fifty-git/test-2
- Quick demo (video or deployed link)

## Setup

Instructions for running the project locally:

1. Install dependencies:

```bash
npm install
```

2. Run in development:
```bash
npm run dev
```
## Tech Stack

- Remix (Server + Routing)
- TypeScript
- Tailwind CSS
- shadcn/ui
- react-hook-form
- Zod validation
- Hexagonal / Clean Architecture (Domain, Service, Repository, Infrastructure)
- Local file storage for uploads (Dokploy) + in-memory repositories

## Main Features Implemented

- Full Products CRUD (list, create, edit, delete with confirmation)
- Product form with Zod + react-hook-form validation rules
- Media manager per product:
    - Upload (multiple)
    - Preview
    - Reorder
    - Delete (with confirmation)
- Architecture with clear separation of concerns:
    - ```domain/``` models and invariants
    - ```service/``` use-cases and orchestration
    - ```persistence/``` repositories (in-memory)
    - ```storage/``` file storage abstractions (```FileStorage``` + ```LocalFileStorage```)
- TypeScript strictly typed (no any)

## Deployed link

Quick demo deployed:

https://nextbitnesscom-fiftyflowerstest-qonxfc-735ca5-178-156-186-148.traefik.me/