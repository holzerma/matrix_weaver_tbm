
# Matrix Weaver TBM Edition

**Matrix Weaver TBM Edition** is an interactive web application designed to model, manage, and visualize a matrix organization through the lens of Technology Business Management (TBM). It provides a clear, data-driven view of how resources (people and costs) are allocated across value-delivering solutions, helping leaders make informed strategic decisions.

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
    *   **Solution Taxonomy Viewer:** A dedicated analytics page that provides a clear, interactive diagram of the full TBM solution hierarchy: `Type -> Category -> Solution -> Service`.
*   **Skills & Competency Management:**
    *   **Skills Repository:** Centrally define and manage a library of skills with standardized categories.
    *   **Proficiency Tracking:** Assign skills to employees with a proficiency rating from 1 (Beginner) to 5 (Expert).
    *   **Interactive Competency Map:** A powerful heatmap visualization that maps employees against skills, with dynamic filtering to identify experts, discover skill gaps, and highlight at-risk skills.
*   **Data Portability:** Easily import and export the entire application state as a single JSON file, allowing for backups, versioning, and sharing of organizational models.
*   **Global Search:** Quickly find any entity within the application—be it an employee, a solution, or a competence—directly from the header.
*   **In-App Guidance:** A built-in user guide explains core TBM concepts and application features to help new users get started.
*   **Printable Reports:** The dashboard views are optimized for printing, allowing users to generate physical reports.

---

## Architecture

The application is built as a modern, single-page application (SPA) with a focus on simplicity, performance, and maintainability.

*   **Frontend Framework:** Built with **React 18** and **TypeScript**, ensuring a robust, type-safe, and component-based structure.
*   **Styling:** Styled with **Tailwind CSS**, a utility-first CSS framework that allows for rapid and consistent UI development. The application also supports a dark mode theme.
*   **State Management:** Utilizes React's built-in hooks (`useState`, `useMemo`, `useEffect`) for managing component and application state. There is no external state management library like Redux, keeping the architecture lightweight.
*   **Data Persistence:** A custom `useLocalStorage` hook persists the entire application state (employees, solutions, etc.) in the browser's local storage. This ensures that all data is saved automatically and is available across sessions without needing a backend.
*   **Data Flow:** Follows a unidirectional data flow pattern. The main `App.tsx` component acts as the single source of truth, holding all the data and passing it down to child components via props. State modifications are handled by callback functions passed down from `App.tsx`.
*   **Visualization:** All charts, including pie charts, bar charts, and the complex Sankey diagrams, are rendered using the **Recharts** library, which provides a rich set of composable and declarative charting components.
*   **Build & Dependencies:** The project uses a modern, **build-less setup**. Instead of a traditional build process (like Webpack or Vite), it leverages an `importmap` in `index.html`. This allows the browser to load React and other libraries as ES modules directly from a CDN (`esm.sh`), simplifying the development workflow.

---

## How to Run Locally

Because of the build-less architecture, running the application is very straightforward.

1.  Ensure all the application files (`index.html`, `index.js`, `components/`, etc.) are in a single directory.
2.  Serve this directory using any simple local web server. For example, if you have Python installed, you can run:
    ```bash
    # For Python 3
    python3 -m http.server
    ```
3.  Open your web browser and navigate to the local address provided by the server (e.g., `http://localhost:8000`).

The application will load and run, using the data persisted in your browser's local storage or the initial constant data if it's the first time.
