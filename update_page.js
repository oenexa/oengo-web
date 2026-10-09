const fs = require('fs');
const file = 'src/app/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/buyerId: "user_customer"/g, 'buyerId: typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_customer" : "user_customer"');
code = code.replace(/restaurantId: selectedRestaurant\?\.id \|\| "user_restaurant"/g, 'restaurantId: selectedRestaurant?.id || (typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_restaurant" : "user_restaurant")');
code = code.replace(/await assignCourier\(activeOrder\.id, "user_courier"\);/g, 'await assignCourier(activeOrder.id, typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_courier" : "user_courier");');

fs.writeFileSync(file, code);
console.log('Updated page.tsx successfully.');
