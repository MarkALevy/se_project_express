const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // let's check the header exists and starts with 'Bearer '
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authorization required' });
  }

  // getting the token
  const token = authorization.replace('Bearer ', '');

  // verifying the token
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // we return an error if something goes wrong
    return res.status(401).send({ message: 'Authorization required' });
  }
  req.user = payload; // assigning the payload to the request object

  next(); // sending the request to the next middleware
};