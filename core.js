const mkdir = require('mkdirp');
const { writeFile, unlink, readFile } = require('fs/promises');
const glob = require('fast-glob');
const DATA_PATH = process.env.DATA_PATH || './data';

module.exports = {
  read: (path) => {
    let tp = path.replace(/-/g, '/');
    const filepath = `${DATA_PATH}/${tp}.json`;
    return readFile(filepath)
      .then((data) => JSON.parse(data));
  },
  write: (path, data) => {
    if (typeof data !== 'object') {
      return Promise.reject(new Error('Invalid data'));
    }
    let parts = path.split('-');
    let filename = parts.pop();
    if (filename.toLowerCase() === 'index') {
      return Promise.reject(new Error('index will not be accepted'));
    }
    let dir = parts.join('/');
    let dirpath = `${DATA_PATH}/${dir}`;
    return mkdir(dirpath).then(() => {
      let filepath = `${dirpath}/${filename}.json`;
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
    let parts = path.split('-');
    let filename = parts.pop();
    if (filename.toLowerCase() === 'index') {
      return Promise.reject(new Error('index will not be accepted'));
    }
    let dir = parts.join('/');
    return mkdir(dir).then(() => {
      let filepath = `${DATA_PATH}/${dir}/${filename}.json`;
      return writeFile(filepath, JSON.stringify(data));
    });
  },
  delete: (path) => {
    let tp = path.replace(/-/g, '/');
    const filepath = `${DATA_PATH}/${tp}.json`;
    return unlink(filepath);
  },
  list: (path) => {
    let tp = path.replace(/-/g, '/');
    tp = `${DATA_PATH}/${tp}`;
    tp += tp.slice(-1) === '/' ? '*' : '/*';
    return glob(tp, { onlyFiles: false }).then(d => d.map(p => p.slice(tp.length - 1).replace(/\//g, '-')));
  }
}
