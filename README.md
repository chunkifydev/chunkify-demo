<p align="center">
  <img src="https://chunkify.s3.us-east-1.amazonaws.com/logos/chunkify.png" alt="Chunkify Logo" width="300"/>
</p>

# Chunkify Demo App

A simple Next.js demo application showcasing video processing with Chunkify uing webhooks. The app uses webhooks to:

-   Validate upload and source creation
-   Trigger video processing jobs
-   Track job completion and failures

## Features

-   Video upload and processing
-   Thumbnail generation
-   Video playback with thumbnails

## Getting Started

1. Clone the repository

2. Install dependencies:

    ```bash
    npm install
    ```

3. Setup the needed environment variables in the`.env.local` file with:

    ```
    CHUNKIFY_PROJECT_KEY=your_project_key
    CHUNKIFY_WEBHOOK_SECRET=your_webhook_secret
    ```

4. You will need the Chunkify CLI to start the webhook proxy:

    - Install the CLI from [https://github.com/chunkify/cli](https://github.com/chunkify/cli)
    - Read the instructions to setup a webhook for your project
    - Run the proxy with:

    ```bash
    chunkify notifications proxy http://localhost:3000/api/webhook --webhook-secret your_project_webhook_secret
    ```

5. Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
