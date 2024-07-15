const jwt = require('jsonwebtoken');

const secretKey = 'UiHUigyEe8b22XPvdhPEQlUXHBEjjJSUQIihTPkUpmbEphpFQ8CQO8FrWyg6U416W1CnlYWNO7yxhs60Zf7XHA==';

const payload = {
    sub: '1',
    username: 'testuser',
};

const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log('Generated JWT:');
console.log(token);
