/**
 * Test file for LLM Proxy functionality
 * Validates configuration loading and request handling
 */

const fs = require('fs');
const LLMProxy = require('./llm-proxy.js');

console.log('🧪 LLM Proxy - Test Suite\n');
console.log('='.repeat(50));

// Test 1: Configuration Loading
function testConfigLoading() {
    console.log('\n📋 Test 1: Configuration Loading');
    
    try {
        // Create a test .env file
        const testEnvContent = `# Test configuration
LLM_API_KEY=test_key_123
MODEL_NAME=gpt-3.5-turbo
URL=https://api.example.com/v1/chat/completions`;

        fs.writeFileSync('.env', testEnvContent);
        
        const llmProxy = new LLMProxy();
        console.log('  ✅ Configuration loaded successfully');
        console.log(`  📝 Model: ${llmProxy.config.MODEL_NAME}`);
        console.log(`  🔑 API Key: ${llmProxy.config.LLM_API_KEY.substring(0, 8)}...`);
        console.log(`  🌐 URL: ${llmProxy.config.URL}`);
        
        return true;
    } catch (error) {
        console.log(`  ❌ Configuration loading failed: ${error.message}`);
        return false;
    }
}

// Test 2: Missing Configuration
function testMissingConfig() {
    console.log('\n📋 Test 2: Missing Configuration Handling');
    
    try {
        // Remove .env file
        if (fs.existsSync('.env')) {
            fs.unlinkSync('.env');
        }
        
        const llmProxy = new LLMProxy();
        console.log('  ❌ Should have thrown error for missing .env file');
        return false;
    } catch (error) {
        console.log('  ✅ Correctly detected missing .env file');
        console.log(`  📝 Error: ${error.message}`);
        return true;
    }
}

// Test 3: Invalid Configuration
function testInvalidConfig() {
    console.log('\n📋 Test 3: Invalid Configuration Handling');
    
    try {
        // Create invalid .env file
        const invalidEnvContent = `# Invalid configuration - missing required fields
MODEL_NAME=gpt-3.5-turbo
# Missing LLM_API_KEY and URL`;

        fs.writeFileSync('.env', invalidEnvContent);
        
        const llmProxy = new LLMProxy();
        console.log('  ❌ Should have thrown error for missing required fields');
        return false;
    } catch (error) {
        console.log('  ✅ Correctly detected missing required configuration');
        console.log(`  📝 Error: ${error.message}`);
        return true;
    }
}

// Test 4: Request Validation
async function testRequestValidation() {
    console.log('\n📋 Test 4: Request Validation');
    
    try {
        // Create valid .env file for testing
        const testEnvContent = `LLM_API_KEY=test_key_123
MODEL_NAME=gpt-3.5-turbo
URL=https://api.example.com/v1/chat/completions`;

        fs.writeFileSync('.env', testEnvContent);
        
        const llmProxy = new LLMProxy();
        
        // Test invalid message types
        const invalidInputs = [null, undefined, '', 123, {}];
        let validationPassed = true;
        
        for (const input of invalidInputs) {
            try {
                await llmProxy.sendRequest(input);
                console.log(`  ❌ Should have rejected input: ${input}`);
                validationPassed = false;
            } catch (error) {
                // Expected to throw - this is correct behavior
            }
        }
        
        if (validationPassed) {
            console.log('  ✅ Input validation working correctly');
        }
        
        return validationPassed;
    } catch (error) {
        console.log(`  ❌ Request validation test failed: ${error.message}`);
        return false;
    }
}

// Test 5: Response Message Extraction
function testMessageExtraction() {
    console.log('\n📋 Test 5: Response Message Extraction');
    
    try {
        // Create valid .env file for testing
        const testEnvContent = `LLM_API_KEY=test_key_123
MODEL_NAME=gpt-3.5-turbo
URL=https://api.example.com/v1/chat/completions`;

        fs.writeFileSync('.env', testEnvContent);
        
        const llmProxy = new LLMProxy();
        
        // Test message extraction with mock response
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: "Hello! This is a test response."
                    }
                }
            ]
        };
        
        const extractedMessage = llmProxy.extractMessage(mockResponse);
        
        if (extractedMessage === "Hello! This is a test response.") {
            console.log('  ✅ Message extraction working correctly');
            console.log(`  📝 Extracted: "${extractedMessage}"`);
            return true;
        } else {
            console.log('  ❌ Message extraction failed');
            return false;
        }
    } catch (error) {
        console.log(`  ❌ Message extraction test failed: ${error.message}`);
        return false;
    }
}

// Run all tests
async function runTests() {
    const tests = [
        { name: 'Configuration Loading', func: testConfigLoading },
        { name: 'Missing Configuration', func: testMissingConfig },
        { name: 'Invalid Configuration', func: testInvalidConfig },
        { name: 'Request Validation', func: testRequestValidation },
        { name: 'Message Extraction', func: testMessageExtraction }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        const result = await test.func(); // Make sure to await async tests
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results:');
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    // Clean up test files
    if (fs.existsSync('.env')) {
        fs.unlinkSync('.env');
        console.log('\n🧹 Cleaned up test files');
    }
    
    return failed === 0;
}

// Run the tests
runTests().then(success => {
    if (success) {
        console.log('\n🎉 All tests passed!');
        process.exit(0);
    } else {
        console.log('\n💥 Some tests failed!');
        process.exit(1);
    }
});