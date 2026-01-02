# Backend Setup (Node.js + Express + MongoDB)

This is the backend code for the Contact Management App. Run it separately on your local machine.

## Folder Structure

```
server/
├── models/
│   └── Contact.js
├── routes/
│   └── contacts.js
├── controllers/
│   └── contactController.js
├── server.js
├── package.json
└── .env
```

## Setup Instructions

1. Create a new folder called `server`
2. Initialize npm: `npm init -y`
3. Install dependencies: `npm install express mongoose cors dotenv`
4. Create the files as shown below
5. Create `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
6. Run: `node server.js`

## Files

### server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contacts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contacts', contactRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### models/Contact.js
```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name must be less than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message must be less than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
```

### controllers/contactController.js
```javascript
const Contact = require('../models/Contact');

// Get all contacts (sorted by newest first)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    
    res.status(201).json(contact);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

### routes/contacts.js
```javascript
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET /api/contacts - Get all contacts
router.get('/', contactController.getContacts);

// POST /api/contacts - Create a new contact
router.post('/', contactController.createContact);

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', contactController.deleteContact);

module.exports = router;
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/contacts | Fetch all contacts |
| POST | /api/contacts | Create a new contact |
| DELETE | /api/contacts/:id | Delete a contact |

## Connecting Frontend to Backend

To connect the frontend to this backend, update `src/services/contactService.ts`:

```typescript
const API_URL = 'http://localhost:5000/api/contacts';

export const getContacts = async (): Promise<Contact[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch contacts');
  return response.json();
};

export const createContact = async (data: ContactFormData): Promise<Contact> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create contact');
  return response.json();
};

export const deleteContact = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete contact');
};
```
