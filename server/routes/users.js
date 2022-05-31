var express = require('express');
var router = express.Router();
var userRepo = require('../repos/userRepo');
var tokenRepo = require('../repos/tokenRepo');
const { v4: uuidv4 } = require('uuid');

const createResponse = (success, objectOrError) => 
  (success) ? 
  { isSuccess: true, value: objectOrError } :
  { isSuccess: false, error: objectOrError };

// Generate Order Data
function createItem(id, title, startPrice, currentBid, status, incramentAmount) {
  return { id, title, startPrice, currentBid, status, incramentAmount };
}

function createUser(id, firstName, lastName, email, phone){
    return { id, firstName, lastName, email, phone };
}

function createBid(id, user, amount, time) {
    return { id, user, amount, time};
}

const addHours = (hours) => {
  return Date.now() + (hours * 60 * 60 * 1000);
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.post('/validateToken', function(req, res, next) {
  const token = req.body.token;
  
  if(!token){
    return res.send(createResponse(false, "Missing token"));
  }

  tokenRepo.get(token)
  .then((tokenData) => {
    const now = new Date();
    const expires = new Date(tokenData.expires);

    if(
      !tokenData ||  
      expires < now)
    {
      res.send(createResponse(false, token))
    } else {
      res.send(createResponse(true, token))
    }
  })
});

/* GET users listing. */
router.post('/login', function(req, res, next) {
  const email = req.body.emailAddress;
  const password = req.body.password;
  
  if(!email || !password){
    return res.send(createResponse(false, "Missing password or email"));
  }

  let token = uuidv4();

  userRepo.get(email)
  .then(user => new Promise((resolve, reject) => {
    if(user.password.toUpperCase() === password) {
      tokenRepo.add({
        email: email,
        token: token,
        expires: addHours(24)
      })
      .then(() => resolve(createResponse(false, token)));
    }
    resolve(createResponse(false, "incorrect password"));
  }))
  .then((response) => res.send(response) )
});

router.post('/signup', function(req, res, next) {
  const request = req.body;

  if(!request) {
    res.status(404).send({ error: "Item not found in body"});
    return; 
  }

  if(!request.firstName){
    return res.send(createResponse(false, "Missing firstName"));
  }

  if(!request.lastName){
    return res.send(createResponse(false, "Missing lastName"));
  }

  if(!request.emailAddress){
    return res.send(createResponse(false, "Missing emailAddress"));
  }

  if(!request.phoneNumber){
    return res.send(createResponse(false, "Missing phoneNumber"));
  }

  if(!request.password){
    return res.send(createResponse(false, "Missing password"));
  }

  let token = uuidv4(); 

  userRepo.add(request)
  .then(() => {
    tokenRepo.add({
      email: request.emailAddress,
      token: token,
      expires: addHours(24)
    })
  })
  .then(() => {
    return res.send(createResponse(true, token))
  })
  .catch(error => {
    return res.send(createResponse(false, error.message))
  });
});

module.exports = router;
