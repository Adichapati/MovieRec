const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'postman-collection.json');
let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const csrfExec = [
    "pm.test('Status is 200', () => pm.response.to.have.status(200));",
    "pm.test('Has csrfToken', () => {",
    "  const body = pm.response.json();",
    "  pm.expect(body).to.have.property('csrfToken');",
    "  pm.expect(body.csrfToken).to.be.a('string');",
    "  pm.collectionVariables.set('CSRF_TOKEN', body.csrfToken);",
    "});",
    "pm.test('CSRF cookie captured', () => {",
    "  const cookies = pm.response.headers.filter(h => h.key.toLowerCase() === 'set-cookie').map(h => h.value);",
    "  const csrfCookieHeader = cookies.find(v => v.includes('csrf-token='));",
    "  pm.expect(!!csrfCookieHeader).to.eql(true);",
    "  const match = csrfCookieHeader && csrfCookieHeader.match(/(?:__Host-authjs\\.csrf-token|authjs\\.csrf-token)=([^;]+)/);",
    "  pm.expect(!!match).to.eql(true);",
    "  if (match) pm.collectionVariables.set('CSRF_COOKIE', match[1]);",
    "});"
];

const loginExec = [
    "// NextAuth may redirect depending on config/env.",
    "pm.test('Login response received', () => {",
    "  pm.expect([200, 302, 303, 409]).to.include(pm.response.code);",
    "});",
    "",
    "// Extract session cookie for later use (supports secure and non-secure names)",
    "const cookies = pm.response.headers.filter(h => h.key.toLowerCase() === 'set-cookie');",
    "const setCookieValues = cookies.map(c => c.value);",
    "const secure = setCookieValues.find(v => v.includes('__Secure-authjs.session-token='));",
    "const plain = setCookieValues.find(v => v.includes('authjs.session-token='));",
    "const chosen = secure || plain;",
    "if (chosen) {",
    "  const name = chosen.includes('__Secure-authjs.session-token=') ? '__Secure-authjs.session-token' : 'authjs.session-token';",
    "  const match = chosen.match(/(?:__Secure-authjs\\.session-token|authjs\\.session-token)=([^;]+)/);",
    "  if (match) {",
    "    pm.collectionVariables.set('SESSION_COOKIE_NAME', name);",
    "    pm.collectionVariables.set('SESSION_COOKIE', match[1]);",
    "  }",
    "}",
    "",
    "pm.test('Session cookie was set', () => {",
    "  const val = pm.collectionVariables.get('SESSION_COOKIE');",
    "  pm.expect(val).to.not.be.empty;",
    "});"
];

function replaceScripts(items) {
    for (let item of items) {
        if (item.name === "3.0 Get CSRF Token (Required)" || item.name === "3.2 Get CSRF Token (Helper)") {
            if (item.event && item.event[0] && item.event[0].script) {
                item.event[0].script.exec = csrfExec;
            }
        }
        if (item.name === "3.1 Login via NextAuth Credentials") {
            if (item.event && item.event[0] && item.event[0].script) {
                item.event[0].script.exec = loginExec;
            }
            // And fix the header for 3.1 directly just in case! 
            if (item.request && item.request.header) {
                for (let h of item.request.header) {
                    if (h.key.toLowerCase() === 'cookie') {
                        // Dynamically inject the raw variable to gracefully handle both via postman
                        // We will just let postman send the whole CSRF cookie regardless of name prefix.
                        h.value = h.value.replace(/.*csrf-token=/g, 'authjs.csrf-token=');
                    }
                }
            }
        }
        if (item.item) {
            replaceScripts(item.item);
        }
    }
}

replaceScripts(obj.item);

// Also set the NEXT_BASE_URL to www.sprake.lol just to be 100% sure we didn't lose it
for (let v of obj.variable || []) {
    if (v.key === 'NEXT_BASE_URL') {
        v.value = 'https://www.sprake.lol'; 
    }
}

fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
console.log('Absolute fix applied successfully!');
