# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 application using the App Router architecture with TypeScript and React 19.

### UI Framework
- **shadcn/ui**: Complete UI component library built on Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS framework with CSS variables for theming
- **Lucide React**: Icon library
- **Configuration**: `components.json` defines shadcn/ui setup with "new-york" style variant

### Key Dependencies
- **Form Handling**: React Hook Form with Zod validation and Hookform Resolvers
- **Styling**: class-variance-authority, clsx, tailwind-merge (combined in `cn()` utility)
- **UI Components**: Comprehensive Radix UI component suite (accordion, dialog, dropdown-menu, etc.)
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns with react-day-picker
- **Theming**: next-themes for dark/light mode
- **Notifications**: Sonner for toast notifications
- **Mobile**: Vaul for drawer components, embla-carousel for carousels

### Project Structure
- **App Directory**: Uses Next.js App Router (`app/` directory)
- **Components**: All UI components in `components/ui/` following shadcn/ui patterns
- **Utilities**: `lib/utils.ts` contains the `cn()` function for class merging
- **Hooks**: Custom hooks in `hooks/` directory (includes `use-mobile.ts`)
- **Path Aliases**: `@/*` points to root directory

### Configuration
- **Next.js**: Configured for standalone output (Docker deployment ready)
- **TypeScript**: Strict mode enabled with path mapping for clean imports
- **ESLint**: Next.js ESLint configuration with v9 support