const path = require('path')
const {
  createHashFromFile,
  extractDirInPath,
  extractFileInPath
} = require('./utils.js')

describe('createHashFromFile', () => {
  it('should create a content based hash of a file', async () => {
    const file = `${path.join(__dirname, '__mock__/__dist__/index.js')}`
    const hash = await createHashFromFile(file).then(hash => hash)
    expect(hash).toEqual("7f20daec21535b94bf62ba0dec2811bf")
  })
  it('should create a content-based sha256 hash of a file', async () => {
    const file = `${path.join(__dirname, '__mock__/__dist__/index.js')}`
    const hash = await createHashFromFile(file, {hashAlgorithm: 'sha256'}).then(hash => hash)
    expect(hash).toEqual("88eb55e8b7794c617aa19480fec8895f57fb100ec5018d48dcb54ce96cc5de62")
  })
  it('should create an 8 character long content-based sha256 hash of a file', async () => {
    const file = `${path.join(__dirname, '__mock__/__dist__/index.js')}`
    const hash = await createHashFromFile(file, {hashAlgorithm: 'sha256', hashLength: 8}).then(hash => hash)
    expect(hash).toEqual("88eb55e8")
  })
  it('should create a full length content-based sha128 hash of a file', async () => {
    const file = `${path.join(__dirname, '__mock__/__dist__/index.js')}`
    const hash = await createHashFromFile(file, {hashAlgorithm: 'sha512', hashLength: 0}).then(hash => hash)
    expect(hash).toEqual("d21837e57e8dbb543caa0ef793844833687a15483fbb8d17d2cf1fecbce53248d845d7927bae99cb154480cf1070e683288417d1fd3a384010aacaa2fb03cb99")
  })
})
describe('extractDirInPath', () => {
  it('should return an object with arr path, str path and dir name', async () => {
    const target = extractDirInPath('/base/sub/path/some-unknown-file.js')
    expect(target).toEqual({
      arr: ["", "base", "sub", "path"],
      str: "/base/sub/path",
      dir: "path"
    })
  })
  it('should manage a path without specified file name', async () => {
    const target = extractDirInPath('/base/sub/path/some-unknown-file')
    expect(target).toEqual({
      arr: ["", "base", "sub", "path", "some-unknown-file"],
      str: "/base/sub/path/some-unknown-file",
      dir: "some-unknown-file"
    })
  })
})
describe('extractFileInPath', () => {
  it('should return an object with name and ext', async () => {
    const target = extractFileInPath('/base/sub/path/some-unknown-file.js')
    expect(target).toEqual({
      name: "some-unknown-file",
      ext: "js"
    })
  })
})
