import axios from 'axios';

const UPDATE_URL = 'https://garbage-overflow.vercel.app/api/bin/update';
const STATUS_URL = 'https://garbage-overflow.vercel.app/api/bin/status';

async function testBackend() {
    console.log('--- Testing Backend API ---');

    console.log(`\n[TEST 1] Sending simulated hardware update to: ${UPDATE_URL}`);
    try {
        const updateRes = await axios.post(UPDATE_URL, {
            deviceId: 'ScriptDebug',
            fillPercentage: 75
        });
        console.log('✅ Update SUCCESS:', updateRes.data);
    } catch (error) {
        console.error('❌ Update FAILED:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 500) {
            console.error('🔍 500 ERROR CAUSE: Most likely missing environment variables or DB connection failed.');
        }
    }

    console.log(`\n[TEST 2] Fetching status from: ${STATUS_URL}`);
    try {
        const statusRes = await axios.get(STATUS_URL);
        console.log('✅ Status Fetch SUCCESS:', statusRes.data);
    } catch (error) {
        console.error('❌ Status Fetch FAILED:', error.response ? error.response.data : error.message);
    }
}

testBackend();
