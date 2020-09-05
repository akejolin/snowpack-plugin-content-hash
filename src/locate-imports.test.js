const path = require('path')
const locateImports = require('./locate-imports')

describe('locate-imports', () => {
  it('should find some imports in file', () => {
    const fileList = [
      `${path.join(__dirname, '__mock__/__dist__/index.js')}`,
    ]
    const result = locateImports(fileList)
    expect(result[0].imports).toEqual([
        "../__snowpack__/env.js",
        "../web_modules/react.js",
        "../web_modules/react-dom.js",
        "./App.js",
    ])
  })

  it('should not dig in folders or non-existing files', () => {
    const fileList = [
      `${path.join(__dirname, '__mock__/__dist__')}`,
      `${path.join(__dirname, '__mock__/__dist__/i-do-not-exist.js')}`,
    ]
    const result = locateImports(fileList)
    expect(result).toEqual([])
  })

})
