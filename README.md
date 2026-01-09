# Fit-for-Value Modeller

**Fit-for-Value Modeller** is an interactive web application designed to model, manage, and visualize a matrix organization through the lens of Technology Business Management (TBM). It provides a clear, data-driven view of how resources (people and costs) are allocated across value-delivering solutions, helping leaders make informed strategic decisions.

The application comes pre-loaded with a comprehensive demo dataset based on the **official TBM 5.0.1 Taxonomy**, allowing users to immediately explore a realistic, standards-aligned organizational model.

## Key Features

*   **Interactive Dashboard:** A high-level overview of key organizational metrics. The dashboard is filterable by Solution or Competence for drill-down analysis and includes:
    *   **Organizational Health Checks:** A dynamic card that provides at-a-glance insights into potential risks, such as "at-risk" skills possessed by only one person, unassigned services, or services shared by multiple solutions.
*   **Comprehensive Entity Management:** Full CRUD (Create, Read, Update, Delete) functionality for all core entities:
    *   **Employees:** Manage internal and external staff, their roles, salaries, and assign them to Competences, Solutions, and Skills.
    *   **Solutions (Value Streams):** Define the products and services the organization delivers, and allocate direct costs (from Cost Pools) to them.
    *   **Services (Offerings):** Create a catalog of specific services and link them to the Solutions that provide them, supporting a many-to-many relationship to model shared services.
    *   **Competences:** Represent functional teams or centers of excellence (e.g., Frontend Engineering, Data Science).
    *   **Cost Pools & Resource Towers:** Model IT costs according to the TBM framework, from general ledger entries (Cost Pools) to a structured IT hierarchy (Resource Towers).
*   **Advanced Analytics & Visualization:**
    *   **Live Organization View:** A dynamic, interactive chart that visually maps the relationships between Competences, Employees, and the Solutions they contribute to. Hovering over any element highlights its direct and indirect connections.
    *   **Financial Analytics Suite:** A powerful tool for deep-diving into the financial composition of any given solution. It features interactive Sankey diagrams to visualize cost flows through different lenses (Financial, TBM Structure, Organizational).
    *   **Solution Taxonomy Viewer:** A dedicated analytics page that provides a clear, interactive diagram of the full TBM solution hierarchy (`Type -> Category -> Solution -> Service`). It now includes granular resource metrics:
        *   **Reach (Unique):** Distinct individuals involved.
        *   **Volume (Assignments):** Total roles filled (sum of parts).
        *   **Capacity (FTE):** Financial/Effort distribution.
*   **Skills & Competency Management:**
    *   **Skills Repository:** Centrally define and manage a library of skills with standardized categories.
    *   **Proficiency Tracking:** Assign skills to employees with a proficiency rating from 1 (Beginner) to 5 (Expert).
    *   **Interactive Competency Map:** A powerful heatmap visualization that maps employees against skills, with dynamic filtering to identify experts, discover skill gaps, and highlight at-risk skills.
*   **Data Portability:** Easily import and export the entire application state as a single JSON file, allowing for backups, versioning, and sharing of organizational models.
*   **Global Search:** Quickly find any entity within the application—be it an employee, a solution, or a competence—directly from the header.
*   **In-App Guidance:** A built-in user guide explains core TBM concepts and application features to help new users get started.
*   **Printable Reports:** The dashboard views are optimized for printing, allowing users to generate physical reports (PDFs via browser print).

---

## Architecture & Tech Stack

The application is built as a modern Single Page Application (SPA).

*   **Frontend:** React 18, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (via CDN or build process)
*   **Visualization:** Recharts
*   **State Management:** React Hooks + LocalStorage Persistence (No backend database required)

---

## How to Run Locally

1.  **Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Start Development Server:**
    ```bash
    npm run dev
    ```
4.  Open your browser to the URL provided in the terminal (usually `http://localhost:5173`).

To build for production locally:
```bash
npm run build
npm run preview
```

---

## Deploying to Azure Static Web Apps

This application is configured for easy deployment to **Azure Static Web Apps**.

### Prerequisites
*   An Azure Subscription.
*   A GitHub repository containing this code.

### Deployment Steps

1.  **Push Code to GitHub:** Ensure your code (including `package.json`, `vite.config.ts`, and `staticwebapp.config.json`) is pushed to a GitHub repository.
2.  **Create Static Web App:**
    *   Log in to the [Azure Portal](https://portal.azure.com).
    *   Search for **Static Web Apps** and click **Create**.
    *   Select your **Subscription** and **Resource Group**.
    *   Name your app (e.g., `matrix-weaver-tbm`).
    *   Plan type: **Free** (for personal/hobby use) or **Standard**.
    *   **Deployment details:** Select **GitHub**.
    *   Authorize Azure to access your GitHub account and select your repository and branch.
3.  **Build Details:**
    *   **Build Presets:** Select **React**.
    *   **App location:** `/` (The root of your repo).
    *   **Api location:** (Leave empty).
    *   **Output location:** `dist` (This matches the `vite.config.ts` output).
4.  **Review + Create:** Click **Review + create**, then **Create**.

Azure will automatically create a GitHub Action workflow in your repository, build the application using `npm run build`, and deploy it.

### Configuration Files
*   **`staticwebapp.config.json`**: This file handles the SPA routing (rewriting all navigation to `index.html`) so that refreshing the page on a sub-route (like `/employees`) works correctly.
*   **`vite.config.ts`**: Configures the build output directory to `dist`.