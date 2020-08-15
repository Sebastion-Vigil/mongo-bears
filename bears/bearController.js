const router = require('express').Router();

const Bear = require('./bearModel');

router
  .route('/')
  .get((req, res) => {
    Bear
      .find()
      .then(bears => {
        res.status(200).json(bears);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The bear information could not be retrieved." });
      })
  })
  .post((req, res) => {
    const bearData = req.body;
    const bear = new Bear(bearData);

    bear
      .save()
      .then(bear => {
        console.log(bear);
        if (bear.species !== undefined && bear.latinName !== undefined) {
          res.status(201).json(bear);
        } else {
          res.status(400).json({ errorMessage: "Please provide both species and latin name for the bear." })
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "There was an error while saving the bear to the database" });
      });
  });

router
  .route('/:id') // pass id number after slash, i.e., api/bears/5f3671dbceb55d2c2554b40c (Grizzly Bear)
  .get((req, res) => { 
    const bearId = req.params.id;
    Bear.findById(bearId)
      .then(bear => {
        if (bear !== null) {
          res.status(200).json({ bear });
        } else {
          res.status(404).json({ errorMessage: "The bear with the specified ID does not exist." })
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The bear information could not be retrieved." })
      })
  })
  .delete((req, res) => {
    const { id } = req.params;
    Bear.findByIdAndRemove(id)
      .then(bear => {
        if (bear !== null) {
          res.status(200).json(bear);
        } else {
          res.status(404).json({ errorMessage: "The bear with the specified ID does not exist." });
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The bear could not be removed" })
      })
  })
  .put((req, res) => {
    const { id } = req.params;
    const bearData = req.body;
    const options = {
      new: true
    }
    Bear.findByIdAndUpdate(id, bearData, options)
      .then(bear => {
        if (bear !== null) {
          res.status(200).json(bear);
        } else {
          res.status(404).json({ message: "The bear with the specified ID does not exist." });
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The bear information could not be modified." })
      })
  });

module.exports = router;