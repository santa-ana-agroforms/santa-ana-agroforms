# 🌾 Santa Ana AgroForms — Frontend Module

> **Web system for dynamic agricultural form management**  
> Developed with **React**, **Vite**, and **Tailwind CSS** under a **Single Page Application (SPA)** architecture.

---

> **Branch Notice**  
> The latest stable work is on **`deploy2`**.

## 🚀 Overview

**Santa Ana AgroForms** is a *frontend module* designed for **Ingenio Santa Ana**, aimed at optimizing the collection, validation, and management of agricultural data through **dynamic and adaptable forms**.

This project is part of a broader research and technological application initiative that integrates **usability principles (Nielsen, 1994)**, **modern frontend architecture**, and **role-based access control (RBAC)**.

---

## 🧭 Methodology

The development process followed **five methodological stages**, integrating theory, design, implementation, validation, and documentation:

1. 🔍 **Technology Research and Selection**  
   Comparative analysis of modern SPA frameworks and development tools.

2. 🧩 **Architecture and Component Design**  
   Definition of a modular structure based on reusable components and efficient state management.

3. 💻 **System Implementation and UI Development**  
   Construction of the user interface with React + Vite + Tailwind CSS, following UX design principles.

4. 🧪 **Functional Testing and User Validation**  
   Evaluation of usability, performance, and reliability under real-world field scenarios.

5. 📝 **Results Analysis and Documentation**  
   Assessment of performance metrics and formal documentation of outcomes.

---

## 🏗️ Technological Architecture

The project adopts a **Single Page Application (SPA)** architecture to ensure a seamless and responsive user experience without full page reloads.

**Technology Stack:**

| Technology | Role |
|-------------|------|
| ⚛️ **React** | Core library for building dynamic, component-based UIs. |
| ⚡ **Vite** | Development and build tool providing ultra-fast bundling and HMR. |
| 🎨 **Tailwind CSS** | Utility-first CSS framework for responsive and consistent styling. |
| 🔐 **Axios** | HTTP client for API communication and authentication handling. |
| 💾 **React Query (TanStack)** | Server state management, caching, and background data synchronization. |
| 🧠 **React Hook Form + Yup** | Synchronous form validation and dynamic data control. |

---

## 🧱 Component Design

The frontend is structured around a hierarchy of **reusable and modular components**:

- `CategoryTable` — Displays forms grouped by category.  
- `BaseModal` — Reusable modal component for CRUD actions.  
- `FormRenderer` — Dynamic JSON-driven form rendering engine.  
- `AuthContext` — Global context for user authentication and role management.

**State Management:**
- Local UI state: `useState`, `useReducer`, `useContext`
- Server state: **React Query** (caching, refetching, invalidation)
- Persistent authentication via `localStorage` tokens and Axios interceptors.

---

## 🧑‍💻 Key Features

### 🔐 Secure Authentication
Safe login with real-time feedback and error handling.

### 📋 Dynamic Forms
Creation and editing of fully dynamic forms from JSON definitions.

### 🗂️ Category Management
Hierarchical organization of forms through an intuitive category system.

### 🧭 Intuitive Navigation
Dashboard-style layout with sidebar navigation and a persistent top bar.

### 📊 Dashboard Analytics
Real-time metrics and graphical summaries of system activity.

### 🧾 Advanced Validation
Synchronous and schema-based validation using **Yup/Zod**, compliant with **ISO/IEC 25012** data quality standards.

### 🔄 Offline Synchronization
Temporary form storage in `IndexedDB` or `localStorage`, with automatic resubmission when connectivity is restored.

---

## 🔒 Role-Based Access Control (RBAC)

The system implements **Role-Based Access Control** directly in the presentation layer:

- Hierarchical roles (Administrator, Field Technician, User).  
- Dynamic UI adaptation based on permissions.  
- Security and consistency without duplicating backend logic.

---

## 📈 Results and Usability Testing

During functional and usability testing with real users:
- The system demonstrated **efficiency, stability, and data consistency**.  
- There was a **significant reduction in input errors** due to real-time validation.  
- Users highlighted the **clarity and ease of navigation** throughout the platform.

The interface adheres to the **usability heuristics of visibility, consistency, and error prevention**, ensuring an intuitive and effective user experience.

---

## 🛠 Installation & Setup
Prerequisites

- Git
- Node.js 20 LTS (recommended)
- Yarn

### 1) Clone the repository
```bash
git clone https://github.com/ingenio-santa-ana/agroforms-frontend.git
cd agroforms-frontend
```

### 2) Install dependencies
```bash
yarn install --frozen-lockfile
```

### 3) Configure environment variables
```bash
# Backend / APIs
VITE_API_BASE_URL=https://api.santa-ana.local

# Auth (if applicable)
VITE_AUTH_PROVIDER=custom
VITE_AUTH_CLIENT_ID=agroforms-web
VITE_AUTH_REDIRECT_URL=http://localhost:5173

# Telemetry (optional)
VITE_SENTRY_DSN=

# Feature flags
VITE_ENABLE_MOCKS=false
```

### 4) Run in development
```bash
yarn dev
```

### 5) Build for production
```bash
yarn build
```

## 🙏 Thanks for Reading

Thanks for taking the time to read this README and explore **Santa Ana AgroForms — Frontend**.  

