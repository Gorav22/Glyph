# Glyph Browser

A full-stack web browser application built with Next.js, Tailwind CSS, and MongoDB, inspired by Arc Browser.  It features AI-powered search using Google Gemini, tab management, website bookmarking, and user authentication.

## Features

* **AI-Powered Search:** Integrated with Google Gemini for enhanced search results alongside traditional Google Search.
* **Tab Management:** Create, close, rename, and switch between multiple tabs.
* **Split View:**  Compare AI search results with standard web search results side-by-side.
* **Website Bookmarks/Shortcuts:** Save your favorite websites for quick access.
* **User Authentication:** Secure user accounts with sign-up, sign-in, and logout functionality.
* **Profile Management:**  Update user profile information, including password changes.
* **Serverless Functions (API Routes):** Next.js API routes handle backend logic for search, authentication, data persistence, etc.

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, Radix UI, Lucide React Icons, Framer Motion, Styled Components, Showdown (Markdown).
* **Backend:** Node.js, Next.js API Routes, MongoDB, Bcrypt, Nodemailer, @google/generative-ai.
* **Database:** MongoDB Atlas
* **Deployment (Example):** Vercel (or any platform supporting Next.js)


## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Gorav22/Glyph.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Glyph
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**
   * Create a `.env.local` file in the root directory.  
   * Add the following environment variables, replacing placeholders with your actual values:
     ```
     MONGODB_URI=<your_mongodb_uri>
     GOOGLE_API_KEY=<your_google_api_key>
     API_KEY=<your_google_custom_search_API_KEY>
     GOOGLE_CSE_ID=<your_google_custom_search_engine_ID>

     EMAIL_HOST=<smtp_host>
     EMAIL_PORT=<smtp_port>
     EMAIL_USER=<smtp_username>
     EMAIL_PASS=<smtp_password>
     EMAIL_FROM=<from_email_address>

     JWT_SECRET=<your_jwt_secret> //  A strong secret for JWT signing

     NEXT_PUBLIC_HOST_URL=http://localhost:3000 //replace this with your host URL if deploying to production

     ```


5. **Run the development server:**

   ```bash
   npm run dev
   ```

## Usage

1. **Open the application:** Visit `http://localhost:3000` in your browser.
2. **Authentication:**  Sign up or log in to access the browser interface.
3. **Browsing:**  Use the address bar to navigate to websites or perform AI-powered searches (prefix queries with "ai:").
4. **Tab Management:**  Use the "+" button to create new tabs, the "x" buttons to close tabs, and click on tabs to switch between them. Right-click on tabs for rename and close options.
5. **Bookmarks:** Click the star icon in the address bar to bookmark the current website. Access bookmarks in the sidebar.
6. **Split View:** Click the "Toggle Split View" button in the sidebar to compare AI search and web search results.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


## License

MIT


## Credits

Inspired by Arc Browser. Uses various open-source libraries including Next.js, Tailwind CSS, Radix UI, MongoDB, etc.  Special thanks to these projects!
