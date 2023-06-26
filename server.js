const express = require('express');
const sequelize = require('./config/connection');

//require('./models');
// import routes
const routes = require('./controllers/index');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(routes);

//turn on connection to db and server
sequelize.sync().then( () => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});