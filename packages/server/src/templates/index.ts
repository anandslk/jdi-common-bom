import { config } from "src/config";

export const home = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        h1 { color: #333; }
        p { color: #666; font-size: 18px; }
        </style>
        </head>
        <body>
        <h1>🚀 Server is Running!</h1>
        <p>Welcome to the API. Navigate to <code>/api/v1</code> to access the endpoints.</p>
        <p>
        For more information, visit the <a href="${config.HOST}/api-docs">Swagger Docs</a>.
        </p>
        </body>
        </html>
        `;

export const notFound = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Not Found</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: #e74c3c; }
            p { color: #666; font-size: 18px; }
        </style>
    </head>
    <body>
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
    </body>
    </html>
  `;
