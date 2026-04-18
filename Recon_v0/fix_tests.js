const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'postman-collection.json');
let data = fs.readFileSync(filePath, 'utf8');

let obj = JSON.parse(data);

for (let v of obj.variable || []) {
    if (v.key === 'FLASK_BASE_URL') {
        v.value = 'http://localhost:5000'; // Reset flask to localhost
    }
}

function recursiveReplace(node) {
    if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
            if (typeof node[i] === 'string') {
                // Fix double prefix from previous script
                node[i] = node[i].replace(/__Secure-__Secure-authjs/g, '__Secure-authjs');
                node[i] = node[i].replace(/__Host-__Host-authjs/g, '__Host-authjs');
                
                // Fix Regex extractions
                node[i] = node[i].replace(
                    /next-auth\\\.csrf-token=\(\[\^;\]\+\)/g, 
                    '(?:__Host-authjs\\\\.csrf-token|authjs\\\\.csrf-token)=([^;]+)'
                );
                
                node[i] = node[i].replace(
                    /\(\?:__Secure-next-auth\\\.session-token\|next-auth\\\.session-token\)=\(\[\^;\]\+\)/g,
                    '(?:__Secure-authjs\\\\.session-token|authjs\\\\.session-token)=([^;]+)'
                );
                
            } else if (node[i] !== null && typeof node[i] === 'object') {
                recursiveReplace(node[i]);
            }
        }
    } else if (node !== null && typeof node === 'object') {
        for (let k in node) {
            recursiveReplace(node[k]);
        }
    }
}

recursiveReplace(obj.item);

fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
console.log('Successfully fixed postman collection!');
