# Student MFE - Clean Architecture Structure

## 📋 Overview

This document outlines the complete directory structure of the Student MFE (Micro Frontend) built using **Clean Architecture principles** and **MFE best practices**.

## 🏗️ Architecture Layers

The Student MFE follows **Clean Architecture** with clear separation of concerns:

- **Domain Layer**: Business logic and entities (framework-agnostic)
- **Application Layer**: Use cases and service orchestration
- **Infrastructure Layer**: External concerns (repositories, adapters)
- **Presentation Layer**: React components, hooks, and UI logic

## 📂 Directory Structure

```
student-mfe/
├── 📄 Configuration Files
│   ├── .gitignore                    # Git ignore patterns
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Dependencies and scripts
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.app.json            # TypeScript app configuration
│   ├── tsconfig.json                # TypeScript base configuration
│   ├── tsconfig.node.json           # TypeScript Node configuration
│   └── vite.config.ts               # Vite + Module Federation config
│
├── 📚 Documentation
│   ├── CLEANUP_ANALYSIS.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── ISSUES_FIXED_REPORT.md
│   ├── POST_CLEANUP_ASSESSMENT.md
│   ├── README.md
│   ├── REFACTOR_PLAN.md
│   ├── REFACTORING_SUCCESS_REPORT.md
│   └── STUDENT_MFE_ASSESSMENT_AND_QUIZ_IMPLEMENTATION_PLAN.md
│
├── 🔧 Build Output
│   ├── .__mf__temp/                 # Module Federation temp files
│   └── dist/                        # Build output (generated)
│
├── 🎨 Static Assets
│   └── public/
│       └── vite.svg                 # Vite logo
│
└── 💻 Source Code
    └── src/
        ├── 📱 Entry Points
        │   ├── App.tsx              # Main application component
        │   ├── index.css            # Global styles + CSS reset
        │   ├── main.tsx             # React DOM entry point
        │   └── vite-env.d.ts        # Vite type definitions
        │
        ├── 🏛️ DOMAIN LAYER (Clean Architecture)
        │   ├── entities/
        │   │   └── Navigation.ts    # Navigation business entity
        │   └── usecases/
        │       └── NavigationUseCase.ts  # Navigation business logic
        │
        ├── 🔧 APPLICATION LAYER
        │   └── StudentMFEServices.ts     # Dependency injection container
        │
        ├── 🌐 INFRASTRUCTURE LAYER
        │   └── NavigationRepository.ts   # Navigation data persistence
        │
        ├── 🎨 PRESENTATION LAYER
        │   ├── hooks/
        │   │   └── useNavigation.ts      # Navigation React hook
        │   └── pages/                    # Page components (future)
        │
        └── 🧩 COMPONENTS
            ├── index.ts                  # Component barrel exports
            └── layout/
                ├── index.ts              # Layout barrel exports
                └── Sidebar.tsx           # Navigation sidebar component
```

## 🎯 Key Architecture Principles

### **1. Clean Architecture Compliance**
- **Domain Layer**: Pure business logic, no framework dependencies
- **Application Layer**: Orchestrates use cases, dependency injection
- **Infrastructure Layer**: External adapters (APIs, storage, MFE communication)
- **Presentation Layer**: React-specific UI logic and components

### **2. MFE Best Practices**
- **Layout-Agnostic**: No assumptions about container layout
- **Internal Navigation**: View management without URL routing conflicts
- **Host-Shell Communication**: PostMessage API for inter-MFE communication
- **Standalone Capable**: Can run independently for development

### **3. TypeScript & Code Quality**
- **Strict Type Safety**: Full TypeScript coverage
- **Interface Segregation**: Clear contracts between layers
- **Dependency Inversion**: Abstractions over concretions

## 🔄 Data Flow

```
User Interaction → Sidebar Component → useNavigation Hook → Navigation Use Case → Navigation Repository → State Update → UI Re-render
```

## 🛠️ Development Features

### **Navigation System**
- **Internal View Management**: No URL routing conflicts with Host-Shell
- **Business Rules**: Domain-driven navigation validation
- **State Persistence**: Optional localStorage integration
- **Host Communication**: MFE-to-MFE messaging capability

### **Component Architecture**
- **Composition Pattern**: Flexible, reusable components
- **Prop-driven Configuration**: Configurable via props
- **TypeScript Interfaces**: Strong typing for all components

### **Service Layer**
- **Dependency Injection**: Singleton service container
- **Repository Pattern**: Abstracted data access
- **Environment-aware**: Different implementations for dev/prod

## 🚀 Build & Deployment

### **Module Federation Configuration**
- **Exposed Module**: `./StudentApp` → `./src/App.tsx`
- **Shared Dependencies**: React, React-DOM
- **Port Configuration**: Development (5001), Preview (5001)

### **Scripts**
- `pnpm run dev`: Development server
- `pnpm run build`: Production build
- `pnpm run preview`: Preview built application
- `pnpm run start-mf`: Build + Preview (MFE mode)

## 📈 Future Expansion Points

### **Planned Components**
- **Pages**: Dashboard, Quizzes, History, Profile
- **UI Components**: Button, Card, Modal, Toast
- **Features**: Quiz Engine, State Management, API Integration

### **Architecture Extensions**
- **State Management**: Global state for complex interactions
- **API Layer**: HTTP client and data fetching hooks
- **Error Boundaries**: Robust error handling
- **Testing Layer**: Unit, integration, and E2E tests

## 🔗 Integration Points

### **Host-Shell Communication**
- **Incoming Messages**: `HOST_SHELL_SET_STUDENT_VIEW`
- **Outgoing Messages**: `STUDENT_MFE_NAVIGATION`
- **Fallback Mode**: Graceful degradation when standalone

### **Styling Integration**
- **Tailwind CSS**: Utility-first styling
- **CSS Reset**: Browser default elimination
- **Responsive Design**: Mobile-first approach

---

**Last Updated**: August 20, 2025  
**Architecture**: Clean Architecture + MFE Patterns  
**Status**: Core navigation system implemented ✅
