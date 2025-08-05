# LLM Proxy Integration

This repository now includes LLM proxy functionality that allows you to send requests to any LLM proxy service and receive responses.

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual LLM proxy credentials:
   ```env
   LLM_API_KEY=your_actual_api_key_here
   MODEL_NAME=gpt-3.5-turbo
   URL=https://api.openai.com/v1/chat/completions
   ```

## Usage

### Basic Usage

```javascript
const LLMProxy = require('./llm-proxy.js');

async function example() {
    const llmProxy = new LLMProxy();
    
    // Send a simple message
    const response = await llmProxy.sendRequest("Hello, how are you?");
    
    if (response.success) {
        console.log('Response:', response.message);
    } else {
        console.error('Error:', response.error);
    }
}
```

### Advanced Usage with Options

```javascript
const response = await llmProxy.sendRequest("Explain artificial intelligence", {
    temperature: 0.7,
    max_tokens: 150,
    top_p: 0.9
});
```

### Test Connection

```javascript
const testResult = await llmProxy.testConnection();
console.log(testResult.success ? 'Connected!' : 'Connection failed');
```

## API Reference

### `new LLMProxy()`
Creates a new LLM proxy instance and loads configuration from `.env` file.

### `sendRequest(message, options)`
Sends a request to the LLM proxy.

- **message** (string): The message to send to the LLM
- **options** (object, optional): Additional parameters for the request
- **Returns**: Promise that resolves to response object with `success`, `data`, `message`, and potentially `error` fields

### `testConnection()`
Tests the connection to the LLM proxy with a simple message.

- **Returns**: Promise that resolves to test result object

## Configuration

The following environment variables are required in your `.env` file:

- **LLM_API_KEY**: Your API key for authentication
- **MODEL_NAME**: The model to use (e.g., "gpt-3.5-turbo")
- **URL**: The endpoint URL for your LLM proxy

## Files

- `llm-proxy.js` - Main LLM proxy client
- `test-llm-proxy.js` - Test suite for the LLM proxy
- `demo-llm-proxy.js` - Demo script showing usage examples
- `.env.example` - Template for environment configuration
- `.env` - Your actual configuration (git-ignored for security)

## Running Tests

```bash
node test-llm-proxy.js
```

## Running Demo

```bash
node demo-llm-proxy.js
```

## Security Notes

- The `.env` file is automatically added to `.gitignore` to prevent accidental commits of sensitive credentials
- Always use environment variables for API keys and sensitive configuration
- Never commit actual API keys to version control