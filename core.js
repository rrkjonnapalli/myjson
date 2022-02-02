const mkdir = require('mkdirp');
const { writeFile, unlink, readFile } = require('fs/promises');
const DATA_PATH = process.env.DATA_PATH || './data';
module.exports = {
    read: (path) => {
        var tp = path.replace(/-/g, '/');
        const filepath = `${DATA_PATH}/${tp}.json`;
        return readFile(filepath)
            .then((data) => JSON.parse(data));
    },
    write: (path, data) => {
        if (typeof data !== 'object') {
            return Promise.reject(new Error('Invalid data'));
        }
        var parts = path.split('-');
        var filename = parts.pop();
        if (filename.toLowerCase() === 'index') {
            return Promise.reject(new Error('index will not be accepted'));
        }
        var dir = parts.join('/');
        var dirpath = `${DATA_PATH}/${dir}`;
        return mkdir(dirpath).then(() => {
            var filepath = `${dirpath}/${filename}.json`;
            try {
                require(filepath);
            } catch (error) {
                return writeFile(filepath, JSON.stringify(data));
            }
            return Promise.reject(new Error('File already exists'));
        });
    },
    update: (path, data) => {
        if (typeof data !== 'object') {
            return Promise.reject(new Error('Invalid data'));
        }
        var parts = path.split('-');
        var filename = parts.pop();
        if (filename.toLowerCase() === 'index') {
            return Promise.reject(new Error('index will not be accepted'));
        }
        var dir = parts.join('/');
        return mkdir(dir).then(() => {
            var filepath = `${DATA_PATH}/${dir}/${filename}.json`;
            return writeFile(filepath, JSON.stringify(data));
        });
    },
    delete: (path) => {
        var tp = path.replace(/-/g, '/');
        const filepath = `${DATA_PATH}/${tp}.json`;
        return unlink(filepath);
    }
}