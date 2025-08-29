Project src directory structure

Overview
- This document captures the current structure of the src directory and describes the purpose of each top-level area.
- Source of truth: d:\Revou\final-project-fe-rifkykurniawanp\src

Tree
```
src/
├─ app/
│  ├─ (course)/
│  ├─ (product)/
│  ├─ about/
│  ├─ cart/
│  ├─ dashboard/
│  ├─ data/
│  ├─ login/
│  ├─ payment/
│  ├─ register/
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ provider.tsx
│  └─ RootLayoutClient.tsx
├─ components/
│  ├─ admin/
│  ├─ auth/
│  ├─ cart/
│  ├─ certificate/
│  ├─ course/
│  ├─ dashboard/
│  ├─ form/
│  ├─ layout/
│  ├─ payment/
│  ├─ product/
│  │  ├─ FilterSideBar.tsx
│  │  ├─ ProductCard.tsx
│  │  ├─ ProductDetailClient.tsx
│  │  └─ ProductGrid.tsx
│  ├─ tables/
│  ├─ ui/
│  └─ chart-area-interactive.tsx
├─ context/
│  ├─ AuthContext.tsx
│  ��─ CartContext.tsx
├─ hooks/
│  ├─ course/
│  ├─ dashboard/
│  ├─ use-mobile.ts
│  ├─ useAuth.ts
│  ├─ useCourseCRUD.ts
│  ├─ usePayment.ts
│  ├─ useProduct.ts
│  ├─ useProducts.ts
│  └─ useSearch.ts
├─ lib/
│  ├─ API/
│  └─ utils.ts
└─ types/
   ├─ about.ts
   ├─ api.ts
   ├─ assignment.ts
   ├─ auth.ts
   ├─ cart.ts
   ├─ certificate.ts
   ├─ course-dto.ts
   ├─ course-enrollment.ts
   ├─ course-module.ts
   ├─ course.ts
   ├─ dashboard.ts
   ├─ enum.ts
   ├─ header.ts
   ├─ index.ts
   ├─ lesson-progress.ts
   ├─ lesson.ts
   ├─ order.ts
   ├─ payment.ts
   ├─ product.ts
   ├─ search.ts
   └─ user.ts
```

Conventions and notes
- app: Next.js App Router (route groups in parentheses are not part of the URL). Includes application-wide layout.tsx, RootLayoutClient.tsx, provider.tsx, and global CSS.
- components: Reusable React components organized by domain and UI category. Example: components/product contains ProductDetailClient.tsx, ProductCard.tsx, ProductGrid.tsx, and FilterSideBar.tsx.
- context: React Context Providers for global app state (e.g., authentication, cart state).
- hooks: Custom React hooks. Domain-scoped subfolders (course, dashboard) and shared hooks (useAuth, useSearch, etc.).
- lib: Shared utilities (utils.ts) and API integration under lib/API.
- types: Centralized TypeScript types and DTOs grouped per domain.

Notes
- This snapshot reflects the files present at generation time. If you add or move files, regenerate or update this document accordingly.
