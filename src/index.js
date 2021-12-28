const express = require('express');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT;
require('./db/mongoose');

const publicDirectoryPath = path.join(__dirname, "../public");

const userRouter = require('./routers/usersRouter');
const adminRouter = require('./routers/adminsRouter');
const bookRouter = require('./routers/booksRouter');
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(publicDirectoryPath))

app.use(userRouter);
app.use(adminRouter);
app.use(bookRouter);
app.listen(port, () => {
    console.log("Server connected, port: ", port)
});