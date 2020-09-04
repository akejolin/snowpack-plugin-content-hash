const path = require('path')
const {
  createHashFromFile,
  extractDirInPath,
  extractFileInPath
} = require('./utils.js')

describe('createHashFromFile', () => {
  it('should create a content based hash of a file', async () => {
    const file = `${path.join(__dirname, '__mock__/site_modules/index.js')}`
    const hash = await createHashFromFile(file).then(hash => hash)
    expect(hash).toEqual("7f20daec21535b94bf62ba0dec2811bf")
  })
})
describe('extractDirInPath', () => {
  it('should return an object with arr and str', async () => {
    const target = extractDirInPath('/base/sub/path/some-unknown-file.js')
    expect(target).toEqual({
      arr: ["", "base", "sub", "path"],
      str: "/base/sub/path"
    })
  })
  it('should manage a not a fully path', async () => {
    const target = extractDirInPath('/base/sub/path/some-unknown-file')
    expect(target).toEqual({
      arr: ["", "base", "sub", "path"],
      str: "/base/sub/path"
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
