import { randomBytes } from 'crypto';

function createSecurityKey(): string {
    let securityKey = randomBytes(32);
    
    return securityKey.toString('base64')
}

console.log(`Generated security key: ${createSecurityKey()}`);