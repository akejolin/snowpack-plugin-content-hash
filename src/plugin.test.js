const path = require('path')
const fs = require('fs')

const snowpackPluginContentHash = require('./plugin')
const locateImports = require('./locate-imports')


beforeAll(async () => {

  const buildDirectory = path.join(process.cwd(), 'build/__mock__')
  const plugin = snowpackPluginContentHash({}, {})
  await  plugin.optimize({ buildDirectory })

})

describe('snowpack-plugin-content-hash', () => {

  it('should add a content hash on files in build dir', () => {

    const fileExist = (location) => fs.existsSync(location)
    let isHashed = fileExist(path.resolve(process.cwd(), 'build/__mock__/site_modules/index-7f20daec21535b94bf62ba0dec2811bf.js'))
    isHashed = isHashed ? fileExist(path.resolve(process.cwd(), 'build/__mock__/web_modules/react-d41d8cd98f00b204e9800998ecf8427e.js')) : isHashed
    expect(isHashed).toEqual(true)
  })


  it('should add content hash on import paths', () => {
    const importsInFileList = locateImports([
      path.resolve(process.cwd(), 'build/__mock__/site_modules/index-7f20daec21535b94bf62ba0dec2811bf.js'),
    ])
    expect(importsInFileList[0].imports).toEqual([
      '../__snowpack__/env-999a70d0b2c562f4b06f8f76b2a78200.js',
      '../web_modules/react-d41d8cd98f00b204e9800998ecf8427e.js',
      '../web_modules/react-dom-d41d8cd98f00b204e9800998ecf8427e.js',
      './App-a529301310a0d2f1df8bd812e15b1f5a.js',
    ])

  })
})


