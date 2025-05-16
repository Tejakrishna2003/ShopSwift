
# ShopSwift - E-commerce Platform

ShopSwift is a modern e-commerce application built with Next.js, React, ShadCN UI, and Tailwind CSS. It allows users to sign up as buyers or sellers, manage products, and simulate a shopping experience. This project serves as a demonstration of a full-stack application prototype.

## Key Features

*   **User Authentication:**
    *   Sign-up for new users (as Buyer or Seller).
    *   Login for existing users.
    *   Role-based access control (distinct dashboards/functionality for Buyers and Sellers).
*   **Seller Functionality:**
    *   Dedicated dashboard for sellers to manage their products.
    *   Add new products with details: name, category, description, price, and discount.
    *   Edit existing product details.
    *   Delete products from their listings.
*   **Buyer Functionality:**
    *   Browse and view a catalog of products.
    *   Search for products by name or description.
    *   Filter products by category.
    *   Add products to a shopping cart.
    *   View and manage items in the shopping cart (remove items, see total).
    *   Simulated checkout process.
*   **User Interface:**
    *   Clean, responsive, and modern UI built with ShadCN UI components and Tailwind CSS.
    *   Toast notifications for user actions.
    *   Persistent cart and user session using `localStorage`.

## Tech Stack

*   **Framework:** Next.js (with App Router)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Component Library:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **State Management:** React Context API (for Auth and Cart)
*   **AI (Optional/Placeholder):** Genkit (configured in `src/ai/`) - currently not deeply integrated into core e-commerce logic.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url> # Replace <your-repository-url> with your actual GitHub repo URL
    cd <repository-name>
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```
    Or using pnpm:
    ```bash
    pnpm install
    ```

3.  **Environment Variables (Optional):**
    This project uses mock data and `localStorage` for persistence, so no specific `.env` file is strictly required for core functionality to run. However, Genkit (for AI features) might rely on environment variables for API keys (e.g., Google AI). If you plan to use Genkit features, create a `.env.local` file in the root directory and add necessary variables like:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    Or using pnpm:
    ```bash
    pnpm dev
    ```
    The application will typically be available at `http://localhost:9002`.

5.  **Running Genkit (for AI features, optional for core app):**
    If you intend to develop or test Genkit flows:
    ```bash
    npm run genkit:dev
    # or for watching changes
    npm run genkit:watch
    ```
    Genkit development server usually runs on `http://localhost:3400`.

### Building for Production

To create a production build:
```bash
npm run build
```
And to start the production server:
```bash
npm run start
```

## Project Structure

Here's a brief overview of the key directories:

*   `public/`: Static assets.
*   `src/`: Contains all the source code for the application.
    *   `ai/`: Genkit related AI flows and configuration.
        *   `flows/`: Specific AI task implementations.
        *   `dev.ts`: Entry point for Genkit development server.
        *   `genkit.ts`: Genkit global configuration.
    *   `app/`: Next.js App Router pages and layouts.
        *   `(auth)/`, `(cart)/`, `(products)/`, `(seller)/`: Route groups for different sections.
        *   `globals.css`: Global styles and ShadCN theme variables.
        *   `layout.tsx`: Root layout for the application.
        *   `page.tsx`: Homepage.
    *   `components/`: Reusable React components.
        *   `ui/`: ShadCN UI components.
        *   `AddEditProductForm.tsx`: Form for adding/editing products.
        *   `AppHeader.tsx`: Site-wide header.
        *   `ProductCard.tsx`: Component to display individual products.
    *   `context/`: React Context API providers for global state.
        *   `AppProviders.tsx`: Wraps all context providers.
        *   `AuthContext.tsx`: Manages user authentication state.
        *   `CartContext.tsx`: Manages shopping cart state.
    *   `hooks/`: Custom React hooks.
        *   `use-toast.ts`: Hook for displaying toast notifications.
        *   `use-mobile.ts`: Hook to detect mobile viewport.
    *   `lib/`: Utility functions, type definitions, and mock data.
        *   `mockData.ts`: Sample product and category data.
        *   `types.ts`: TypeScript type definitions.
        *   `utils.ts`: General utility functions (e.g., `cn` for classnames).
*   `components.json`: ShadCN UI configuration.
*   `next.config.ts`: Next.js configuration.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `tsconfig.json`: TypeScript configuration.

## Further Development

This application serves as a foundation. Future enhancements could include:
*   Integration with a real database (e.g., Firebase Firestore, PostgreSQL).
*   Server-side validation and API endpoints.
*   More advanced search and filtering capabilities.
*   Payment gateway integration.
*   User profile management.
*   Order history.
*   Admin panel.
*   Implementing AI features using Genkit for product recommendations, descriptions, etc.
```
