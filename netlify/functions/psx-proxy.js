// Use dynamic import for ESM compatibility
const fetchModulePromise = import('node-fetch');
console.log(123);
exports.handler = async (event, context) => {
  const psxApiUrl = 'https://www.psx.com.pk/psx/test_api/api_tracker.php';

  try {
    // Wait for node-fetch to load
    const { default: fetch } = await fetchModulePromise;

    const response = await fetch(psxApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        tracker: event.queryStringParameters.tracker || 'inc_ticker_100',
      }).toString(),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch from PSX API: ${response.statusText}` }),
      };
    }

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
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
