// Ultra-minimal test page with no dependencies
export default function TestPage() {
  return (
    <html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Test Page Working</h1>
        <p>If you see this, the basic React Router is working.</p>
        <p>Current time: {new Date().toISOString()}</p>
      </body>
    </html>
  );
}