const express = require('express');
const router = express.Router();

const { 
    readUsers,
    readOneUser,
    registerUser,
    updateUser,
    deleteUser
  } = require('../controllers/user_controller');

router
    // Unauthenticated
    .post('/', registerUser)

    // Admin
    // TODO: adminRequired
    .get('/', readUsers)
    .get('/:id', readOneUser)
    .put('/:id', updateUser)
    .delete('/:id', deleteUser);

module.exports = router;