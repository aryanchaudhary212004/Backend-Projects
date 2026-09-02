const express = require('express');
const app = express();

const bookRouter = require('./routes/bookRoutes');
app.use(express.json());
app.use('/books', bookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
})