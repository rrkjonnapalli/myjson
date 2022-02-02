const express = require('express');
const morgan = require('morgan');

const app = express();
const rs = require('./rs');
const core = require('./core');

app.use(morgan('common'));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

app.route('/json/:path').all((req, _res, next) => {
    const path = req.params.path;
    if (path.indexOf('..') !== -1) {
        return next(new Error('What are trying dude???'));
    }
    return next();
}).get((req, res) => {
    const path = req.params.path;
    return core.read(path)
        .then(data => rs.success(res, data))
        .catch((err) => {
            console.error(err);
            rs.error(res, err);
        });;
}).post((req, res) => {
    const path = req.params.path;
    return core.write(path, req.body)
        .then((data) => rs.success(res, data))
        .catch((err) => {
            console.error(err);
            rs.error(res, err);
        });
}).put((req, res) => {
    const path = req.params.path;
    return core.update(path, req.body)
        .then((data) => rs.success(res, data))
        .catch((err) => {
            console.error(err);
            rs.error(res, err);
        });
}).delete((req, res) => {
    const path = req.params.path;
    return core.delete(path)
        .then((data) => rs.success(res, data))
        .catch((err) => {
            console.error(err);
            rs.error(res, err);
        });
});

app.get('/', (req, res) => {
    rs.success(res, { message: 'Welcome to myjson' });
});

app.get('/**', (req, res) => {
    rs.error(res, { message: 'Wrong door' });
});

module.exports = app;