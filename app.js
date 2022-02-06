const express = require('express');
const morgan = require('morgan');

const app = express();
const rs = require('./rs');
const core = require('./core');
const path = require('path');


if (process.env.NODE_ENV !== 'production') {
  app.use(require('cors')());
}

app.use(morgan('common'));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

const pcm = (req, _res, next) => {
  req.params.path = req.params.path || ''
  const path = req.params.path;
  if (path.indexOf('..') !== -1 || !/^[a-zA-Z0-9\-]*$/.test(path)) {
    return next(new Error('What are you trying dude???'));
  }
  return next();
};

app.route('/json/:path').all(pcm).get((req, res) => {
  const path = req.params.path;
  return core.read(path)
    .then(data => rs.success(res, data))
    .catch((err) => {
      rs.error(res, err);
    });;
}).post((req, res) => {
  const path = req.params.path;
  return core.write(path, req.body)
    .then((data) => rs.success(res, data))
    .catch((err) => {
      rs.error(res, err);
    });
}).put((req, res) => {
  const path = req.params.path;
  return core.update(path, req.body)
    .then((data) => rs.success(res, data))
    .catch((err) => {
      rs.error(res, err);
    });
}).delete((req, res) => {
  const path = req.params.path;
  return core.delete(path)
    .then((data) => rs.success(res, data))
    .catch((err) => {
      rs.error(res, err);
    });
});

const lp = (req, res) => {
  const path = req.params.path;
  return core.list(path)
    .then((data) => rs.success(res, data))
    .catch((err) => {
      rs.error(res, err);
    });
};

app.route('/list').all(pcm).get(lp)
app.route('/list/:path').all(pcm).get(lp);
app.use(express.static('public'));
app.use(express.static('samples'));

app.get('*', (_req, res) => {
  const p = path.join(__dirname, 'public/index.html');
  res.sendFile(p);
});

app.get('/**', (_req, res) => {
  rs.error(res, { message: 'Wrong door' });
});

app.use((err, _req, res, next) => {
  if (err) {
    return rs.error(res, err);
  }
  return next();
});

module.exports = app;
