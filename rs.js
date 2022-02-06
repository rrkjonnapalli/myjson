module.exports = {
  success: (res, data = {}, code) => {
    res.status(code || 200).send(data);
  },
  error: (res, data = {}, code) => {
    res.status(code || 400).send({ message: data.message || data.msg || data.description || 'Bad request' });
  },
  created: (res, data = {}) => {
    res.status(201).send(data);
  }
}
