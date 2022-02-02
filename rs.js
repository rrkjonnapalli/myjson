module.exports = {
    success: (res, data = {}, code) => {
        res.status(code || 200).send(data);
    },
    error: (res, data = {}, code) => {
        res.status(code || 400).send(data);
    },
    created: (res, data = {}) => {
        res.status(201).send(data);
    }
}