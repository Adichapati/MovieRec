const https = require('https');

const baseUrl = 'https://recon-six-bay.vercel.app';
const base = new URL(baseUrl);
const email = 'testuser_' + Date.now() + '@example.com'; 
const password = 'TestPass123!';

function makeRequest(path, method, data, cookies = '') {
    return new Promise((resolve, reject) => {
        let payload = data ? JSON.stringify(data) : '';
        const options = {
            hostname: base.hostname,
            port: base.port ? Number(base.port) : 443,
            path: path,
            method: method,
            headers: {
                'Content-Type': data ? 'application/json' : 'text/plain',
                'Cookie': cookies
            }
        };

        if(data && method === 'POST' && path.includes('credentials')) {
             options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
             payload = new URLSearchParams(data).toString();
        }

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({
                status: res.statusCode,
                headers: res.headers,
                body: body
            }));
        });
        
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function run() {
    try {
        console.log('1. Trying Signup...');
        const signupRes = await makeRequest('/api/signup', 'POST', {
            name: 'Test User',
            email: email,
            password: password
        });
        console.log('Signup Status:', signupRes.status);
        console.log('Signup Body:', signupRes.body);

        console.log('\n2. Fetching CSRF Token...');
        const csrfRes = await makeRequest('/api/auth/csrf', 'GET', null);
        console.log('CSRF Status:', csrfRes.status);
        let csrfCookie = '';
        let csrfVal = '';
        if (csrfRes.headers['set-cookie']) {
            csrfRes.headers['set-cookie'].forEach(c => {
                if (c.includes('csrf-token')) {
                    csrfCookie = c.split(';')[0];
                }
            });
        }
        try {
            csrfVal = JSON.parse(csrfRes.body).csrfToken;
        } catch(e){}
        console.log('CSRF Cookie:', csrfCookie);
        console.log('CSRF Token:', csrfVal);

        console.log('\n3. Trying Login...');
        const loginPayload = {
            csrfToken: csrfVal,
            email: email,
            password: password,
            redirect: 'false',
            json: 'true',
            callbackUrl: `${baseUrl}/home`
        };
        const loginRes = await makeRequest('/api/auth/callback/credentials', 'POST', loginPayload, csrfCookie);
        console.log('Login Status:', loginRes.status);
        console.log('Login Body:', loginRes.body);
        console.log('Login Set-Cookie headers:', loginRes.headers['set-cookie']);

    } catch (err) {
        console.error('Test crashed:', err);
    }
}

run();
