const crypto = require('crypto')
const fs = require('fs');

const createHashFromFile = (filePath, { hashLength, hashAlgorithm } = {}) => new Promise(resolve => {
  const hash = crypto.createHash(hashAlgorithm || 'md5');
  const substr = value => hashLength ? value.substring(0, hashLength) : value;
  fs.createReadStream(filePath).on('data', data => hash.update(data)).on('end', () => resolve(substr(hash.digest('hex'))));
});

const extractDirInPath = _path => {
  let arr = _path.split('/')
  arr = arr.splice(0, arr.length - 1)
  return {
    arr,
    str: arr.join('/')
  }
}

const extractFileInPath = _path => {
  const arr = _path.split('/')
  const nameArr = arr[arr.length - 1].split('.')
  const name = nameArr.splice(0, nameArr.length - 1).join('.')
  const ext = nameArr[nameArr.length - 1]
  return {
    name,
    ext,
  }
}


module.exports = {
  createHashFromFile,
  extractDirInPath,
  extractFileInPath,
}