# Amazon Deals Backend API

This Node.js backend fetches top deals in the Garden & Patio category from Amazon using the Product Advertising API. Designed to be used with a React frontend.

## Features

- Fetches top 5 (or configurable) Garden & Patio deals from Amazon.
- Simple Express API (`/api/deals`) for frontend integration.
- Uses environment variables for credentials.
- Ready for future expansion.

## Setup

1. **Clone the repo** and install dependencies:

   ```bash
   npm install
   ```

2. **Set up your environment variables:**

   - Copy `.env.example` to `.env` and fill in your Amazon PA-API Access Key, Secret Key, Partner Tag, and Marketplace.

3. **Start the server:**

   ```bash
   npm run dev
   # or
   npm start
   ```

4. **Test the API:**

   - Open [http://localhost:4000/api/deals](http://localhost:4000/api/deals)

## Notes

- For production, you must implement full AWS Signature V4 signing in `amazon.js` (see AWS documentation).
- Keep your secret keys secure and never expose them to the frontend.

## Next Steps

- Integrate with your React frontend by calling `/api/deals`.
- Style and display the deals as needed.
