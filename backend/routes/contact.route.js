const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// GET /api/contacts - Get all contacts
router.get('/', contactController.getContacts);

// POST /api/contacts - Create a new contact
router.post('/', contactController.createContact);

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', contactController.deleteContact);

module.exports = router;