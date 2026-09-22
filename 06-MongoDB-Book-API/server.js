const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const app = express();

app.use(express.json());

const bookRouter = require('./routes/bookRoutes');
app.use('/books', bookRouter);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer(){
    await connectDB();

    app.listen(PORT, () => {
        console.log('Server running on port ' + PORT);
    });
}
startServer();











