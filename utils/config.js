const { JWT_SECRET = 'super-strong-secret' } = process.env;
console.log('JWT_SECRET:', JWT_SECRET); // Temporary log for checking
module.exports = { JWT_SECRET };
