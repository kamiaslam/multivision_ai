# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Development:**
```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

**Testing:** No test framework is currently configured. If tests need to be added, check with the user for their preferred testing approach.

## Architecture Overview

This is a **Next.js 14 App Router dashboard application** built with TypeScript and Tailwind CSS. The codebase follows a template-based architecture pattern where each page uses a dedicated template component.

### Key Architectural Patterns

**Template-Based Page Structure:**
- Each route in `/app/*/page.tsx` imports and renders a template from `/templates/*`
- Templates encapsulate all page-specific logic, components, and state
- Example: `/app/team/page.tsx` → `/templates/TeamPage/index.tsx`

**Component Organization:**
- `/components/` - Reusable UI components (Button, Card, Layout, etc.)
- `/components/ui/` - Base UI primitives (likely Radix UI based)
- Each component lives in its own folder with `index.tsx`

**Data Architecture:**
- `/lib/data.ts` - Central data access layer with API abstractions
- `/mocks/` - Mock data organized by domain for development
- `/types/` - TypeScript type definitions
- `/Data/Data.tsx` - Large data component (25k+ tokens) containing extensive mock data

### Tech Stack Details

**Core Technologies:**
- Next.js 14.2.32 with App Router
- TypeScript 5.x (strict mode)
- Tailwind CSS 4.0.9 with custom design system
- Radix UI components for accessibility

**Key Libraries:**
- Tiptap for rich text editing
- Recharts for data visualization
- Framer Motion for animations
- React Hook Form for forms
- Lucide React for icons
- jspdf/html2canvas for PDF generation

## Design System

The application uses a comprehensive design system with CSS custom properties:

**Color System:**
- `--shade-01` through `--shade-10` for grayscale
- `--primary-01` through `--primary-05` for brand colors
- Semantic tokens: `--backgrounds-*`, `--text-*`, `--stroke-*`
- Full dark/light theme support via CSS variables

**Responsive Breakpoints:**
- Custom breakpoints: `max-xl`, `max-lg`, `max-md`
- Mobile-first responsive design approach

## Application Features

This is an **enterprise dashboard** with complex functionality including:

**User Management:**
- Multi-role system (owner, admin, subadmin, support)
- Comprehensive permissions architecture
- User profile and team management

**Dashboard Capabilities:**
- Analytics and insights with data visualization
- Billing and financial management
- Agent/bot management and automation
- Telephony integration
- Security audit logging
- Workflow management

## Development Guidelines

**File Organization:**
- Use the existing template pattern for new pages
- Place reusable components in `/components/` with their own folders
- Add mock data to `/mocks/` organized by domain
- Define types in `/types/` or co-locate with components

**Styling Conventions:**
- Use Tailwind utility classes with the custom design system
- Leverage CSS custom properties for theming
- Follow existing responsive patterns with custom breakpoints

**TypeScript Patterns:**
- Maintain strict typing throughout
- Use the `@/*` path alias for imports from root
- Define interfaces for all data structures

**Component Patterns:**
- Follow the polymorphic component pattern (see Button component)
- Use icon integration through the centralized Icon component
- Implement prop-based styling with semantic boolean flags

**Navigation:**
- Navigation configuration is centralized in `/constants/navigation.tsx`
- Supports main navigation and user-specific navigation patterns
- Uses icon-based navigation with semantic routing

## Important Notes

- The `/Data/Data.tsx` file is extremely large (25k+ tokens) and contains extensive mock data
- The application supports comprehensive theming via CSS custom properties
- Path aliases are configured: `@/*` maps to the root directory
- The codebase is set up for enterprise-level user management and permissions