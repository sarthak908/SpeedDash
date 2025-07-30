require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/uploadRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Access files statically

app.use('/api', uploadRoute); // Mount upload route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
