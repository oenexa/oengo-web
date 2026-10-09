const fs = require('fs');
const file = 'src/app/rider/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/buyerId: "user_customer",/g, '');
code = code.replace(/restaurantId: "user_restaurant",/g, '');

fs.writeFileSync(file, code);
console.log('Updated rider page successfully.');
