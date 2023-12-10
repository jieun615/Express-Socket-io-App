const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});