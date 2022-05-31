var raffleRepo = require('../repos/raffleRepo');
var tokenRepo = require('../repos/tokenRepo');
var express = require('express');
var router = express.Router();


const createResponse = (success, objectOrError) => 
  (success) ? 
  { isSuccess: true, value: objectOrError } :
  { isSuccess: false, error: objectOrError };

/* GET users listing. */
router.get('/', function(req, res, next) {
  const response = raffleRepo.getAll();

  response.then(list => {
    res.send(list);
  });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const id = req.params.id;

  raffleRepo.get(id)
  .then((raffle) => res.send(createResponse(true, raffle)))
});

/**
 * Fetch the json from the file.
 * @requires Item {
 *  raffleId: Guid,
 *  bidAmount: number,
 *  fullName: string,
 *  emailAddress: string,
 *  phoneNumber: string
 * }
 * 
 * @returns 
 */

router.post('/placeBid', async (req, res, next) => {
  const raffleId = req.body.raffleId;
  const bidAmount = parseInt(req.body.bidAmount);
  const fullName = req.body.fullName;
  const emailAddress = req.body.emailAddress;
  const phoneNumber = req.body.phoneNumber;

  if(!raffleId){
    res.send(createResponse(false, "Must include a raffleId"))
  }
  if(!bidAmount){
    res.send(createResponse(false, "Must include a bidAmount"))
  }
  if(!fullName){
    res.send(createResponse(false, "Must include a fullName"))
  }
  if(!emailAddress){
    res.send(createResponse(false, "Must include a emailAddress"))
  }
  if(!phoneNumber){
    res.send(createResponse(false, "Must include a phoneNumber"))
  }

  let raffle = await raffleRepo.get(raffleId);

  if(!raffle){
    res.send(createResponse(false, "Invlid raffle id"));
  }

  if(!raffle.bids) {
    raffle.bids = [];
  }
  const now = new Date().toLocaleString('en-US', {timeZone: 'America/Denver'});

  raffle.bids.push({
    emailAddress: emailAddress,
    bidAmount: bidAmount,
    fullName: fullName,
    phoneNumber: phoneNumber,
    bidTime: now
  });

  let response = await raffleRepo.update(raffle);
  res.send(createResponse(true, "Success"));
});

/* GET users listing. */
router.post('/update', function(req, res, next) {
  const request = req.body;

  if(!request) {
    res.status(404).send({ error: "Item not found in body"});
    return; 
  }

  if(!request.id){
    return res.send(createResponse(false, "Missing id for listing"));
  }

  raffleRepo.get(request.id)
  .then(raffle => { 
    raffle.title = request.title;
    raffle.startPrice = request.startingPrice;
    raffle.incramentAmount = request.increment;
    raffle.status = request.status;
    raffle.images = request.images;
    raffle.description = request.description;

    return raffleRepo.update(raffle);
  })
  .then(() => res.send(createResponse(true)))
  .catch((error) => res.send(createResponse(false, error)))
});

/**
 * Fetch the json from the file.
 * @requires Item {
 *  title: string,
 *  startPrice: number,
 *  status: Status,
 *  incramentAmount: number,
 *  description: string
 * }
 * 
 * @returns 
 */
router.post('/', function(req, res, next){
  const request = req.body;

  if(!request) {
    res.status(404).send({ error: "Item not found in body"});
    return; 
  }

  if(!request.title){
    return res.send(createResponse(false, "Missing title"));
  }

  if(!request.startPrice){
    return res.send(createResponse(false, "Missing startPrice"));
  }

  if(!request.status){
    return res.send(createResponse(false, "Missing status"));
  }

  if(!request.incramentAmount){
    return res.send(createResponse(false, "Missing incramentAmount"));
  }

  raffleRepo.add(request)
  .then(response => {
    return res.send(createResponse(true, request));
  });

});

router.post('/add-image-to-raffle', function(req, res, next){
  const request = req.body;

  if(!request) {
    res.status(404).send({ error: "Item not found in body"});
    return; 
  }

  if(!request.id){
    return res.send(createResponse(false, "raffle id missing"));
  }

  if(!request.images || request.images.length === 0){
    return res.send(createResponse(false, "No images included"));
  }

  raffleRepo.get(request.id)
  .then((raffle) => ({...raffle, "images": request.images }))
  .then(raffle => raffleRepo.update(raffle))
  .then(()=> res.send(createResponse(true)))
});

module.exports = router;
