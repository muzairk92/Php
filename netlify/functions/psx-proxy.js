
const fetch = require('node-fetch'); // You'll need to install this
console.log('Netlify');
exports.handler = async (event, context) => {
  const psxApiUrl = 'https://www.psx.com.pk/psx/test_api/api_tracker.php'; // The PSX API URL

  try {
    const response = await fetch(psxApiUrl, {
      method: 'POST', // Use the correct method (GET or POST) as required by the PSX API
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Adjust if the API expects a different content type
        // Add any other necessary headers here (e.g., API keys)
      },
      body: new URLSearchParams({ // If it's a POST request with form data
        tracker: event.queryStringParameters.tracker || 'inc_ticker_100', // Get tracker from query, default to 'inc_ticker_100'
      }).toString(),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch from PSX API: ${response.statusText}` }),
      };
    }

    const data = await response.text(); // Or response.json() if the API returns JSON

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain', // Or 'application/json' if the PSX API returns JSON
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin (for development - be more specific in production)
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: data,
    };
  } catch (error) {
    console.error('Error fetching from PSX API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};