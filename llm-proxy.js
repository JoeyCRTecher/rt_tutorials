/**
 * LLM Proxy Client
 * Handles communication with LLM proxy services
 */

const fs = require('fs');
const path = require('path');

class LLMProxy {
    constructor() {
        this.config = this.loadConfig();
    }

    /**
     * Load configuration from .env file
     * @returns {Object} Configuration object with API key, model name, and URL
     */
    loadConfig() {
        const envPath = path.join(__dirname, '.env');
        
        if (!fs.existsSync(envPath)) {
            throw new Error('.env file not found. Please create one based on .env.example');
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const config = {};

        // Parse .env file
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    config[key.trim()] = valueParts.join('=').trim();
                }
            }
        });

        // Validate required configuration
        const requiredKeys = ['LLM_API_KEY', 'MODEL_NAME', 'URL'];
        for (const key of requiredKeys) {
            if (!config[key]) {
                throw new Error(`Missing required configuration: ${key}`);
            }
        }

        return config;
    }

    /**
     * Send a request to the LLM proxy
     * @param {string} message - The message to send to the LLM
     * @param {Object} options - Optional parameters for the request
     * @returns {Promise<Object>} Response from the LLM proxy
     */
    async sendRequest(message, options = {}) {
        if (!message || typeof message !== 'string' || message.trim() === '') {
            throw new Error('Message must be a non-empty string');
        }

        const requestBody = {
            model: this.config.MODEL_NAME,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            ...options
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.LLM_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        };

        try {
            // Use Node.js built-in fetch (available in Node 18+)
            const response = await fetch(this.config.URL, requestOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data,
                message: this.extractMessage(data)
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: null,
                message: null
            };
        }
    }

    /**
     * Extract the message content from LLM response
     * @param {Object} responseData - Raw response from LLM proxy
     * @returns {string|null} Extracted message content
     */
    extractMessage(responseData) {
        try {
            if (responseData.choices && responseData.choices.length > 0) {
                return responseData.choices[0].message?.content || null;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Test the connection to the LLM proxy
     * @returns {Promise<Object>} Test result
     */
    async testConnection() {
        try {
            const testMessage = "Hello, this is a test message. Please respond with 'Connection successful'.";
            const result = await this.sendRequest(testMessage);
            
            return {
                success: result.success,
                message: result.success ? 'LLM proxy connection successful' : `Connection failed: ${result.error}`,
                response: result.message
            };
        } catch (error) {
            return {
                success: false,
                message: `Connection test failed: ${error.message}`,
                response: null
            };
        }
    }
}

module.exports = LLMProxy;