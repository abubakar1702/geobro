# GeoBro 🌍

**GeoBro** is a modern, fast-paced geography challenge app designed to test and improve your knowledge of world maps and flags. Built with Next.js and Tailwind CSS, it features a premium, responsive design and interactive gameplay.

## Features 🚀

### 🗺️ Map Hunt
Test your knowledge of world geography by locating countries on an interactive map.
-   **Timed Modes**: Race against the clock in 1, 2, 3, 4, or 5-minute sessions.
-   **Unlimited Mode**: Play at your own pace with no time limit.
-   **Interactive Map**: Zoom, pan, and click to pin locations.
-   **Smart Feedback**:
    -   **Correct**: The country lights up Green (+10 points).
    -   **Wrong**: The *actual* target lights up Red to help you learn (-10 points).
-   **Persistent History**: Your correct and wrong guesses stay colored on the map throughout the session.

### 🚩 Flag Guesser
A rapid-fire quiz to identify countries by their flags.
-   **Multiple Choice**: Choose the correct country name from 4 options.
-   **Streak System**: Build up your streak by answering correctly in a row.
-   **High Scores**: Track your best performance.

### 🌏 Country Explorer
Browse the full list of countries supported by the app.
-   View flags and country names.
-   Learn country codes.

## Tech Stack 💻

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Map Visualization**: [React Simple Maps](https://www.react-simple-maps.io/)
-   **Data Source**: [RestCountries API](https://restcountries.com/) & [World Atlas](https://github.com/topojson/world-atlas)
-   **Icons**: [FontAwesome](https://fontawesome.com/)

## Getting Started 🛠️

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/geobro.git
    cd geobro
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is open source and available under the [MIT License](LICENSE).
