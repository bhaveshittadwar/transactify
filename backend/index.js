require('dotenv').config()
const cors = require('cors')
const express = require("express");
const app = express();
const PORT = 3000;
const {router: rootRouter} = require('./routes/index')

app.use(cors())
app.use(express.json());
app.use('/api/v1', rootRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});