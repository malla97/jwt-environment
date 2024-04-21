var express = require('express');
const authRoutes = require('./routes/authRoutes');
var app = express();

const PORT = 8080;

app.use('/auth', authRoutes);
app.use(express.json());
app.listen(
    PORT,
    () => console.log(`Listening on http://localhost:${PORT}`)
)