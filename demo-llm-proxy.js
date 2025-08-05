/**
 * LLM Proxy Demo
 * Demonstrates how to use the LLM proxy client
 */

const fs = require('fs');
const LLMProxy = require('./llm-proxy.js');

console.log('🚀 LLM Proxy - Usage Demo\n');
console.log('='.repeat(50));

async function runDemo() {
    try {
        // Check if .env file exists, create a demo one if not
        if (!fs.existsSync('.env')) {
            console.log('📝 Creating demo .env file...');
            const demoEnvContent = `# Demo configuration - replace with your actual values
LLM_API_KEY=your_actual_api_key_here
MODEL_NAME=gpt-3.5-turbo
URL=https://api.openai.com/v1/chat/completions`;
            
            fs.writeFileSync('.env', demoEnvContent);
            console.log('✅ Demo .env file created');
            console.log('⚠️  Please update .env with your actual LLM proxy credentials\n');
        }

        // Initialize LLM proxy
        console.log('🔧 Initializing LLM Proxy...');
        const llmProxy = new LLMProxy();
        console.log('✅ LLM Proxy initialized successfully');
        console.log(`📝 Using model: ${llmProxy.config.MODEL_NAME}`);
        console.log(`🌐 Endpoint: ${llmProxy.config.URL}\n`);

        // Demo 1: Test connection
        console.log('📡 Testing connection...');
        const connectionTest = await llmProxy.testConnection();
        
        if (connectionTest.success) {
            console.log('✅ Connection test successful');
            console.log(`📝 Response: ${connectionTest.response || 'No response content'}`);
        } else {
            console.log('❌ Connection test failed');
            console.log(`📝 Error: ${connectionTest.message}`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('💡 Usage Examples:');
        console.log('');
        console.log('// Basic usage:');
        console.log('const llmProxy = new LLMProxy();');
        console.log('const response = await llmProxy.sendRequest("Hello, how are you?");');
        console.log('console.log(response.message);');
        console.log('');
        console.log('// With options:');
        console.log('const response = await llmProxy.sendRequest("Explain AI", {');
        console.log('    temperature: 0.7,');
        console.log('    max_tokens: 100');
        console.log('});');
        console.log('');
        console.log('// Test connection:');
        console.log('const test = await llmProxy.testConnection();');
        console.log('console.log(test.success ? "Connected!" : "Failed");');

    } catch (error) {
        console.log(`❌ Demo failed: ${error.message}`);
        
        if (error.message.includes('.env file not found')) {
            console.log('\n💡 Quick start:');
            console.log('1. Copy .env.example to .env');
            console.log('2. Fill in your LLM proxy credentials');
            console.log('3. Run this demo again');
        }
    }
}

// Run the demo
runDemo().then(() => {
    console.log('\n🎯 Demo completed!');
}).catch(error => {
    console.error('💥 Demo error:', error.message);
});