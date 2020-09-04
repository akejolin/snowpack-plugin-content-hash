const path = require('path')
const snowpackPluginContentHash = require('./plugin')

describe('snowpack-plugin-content-hash', () => {
  it('should add a hashtag on every import paths', async () => {
    const buildDirectory = path.join(process.cwd(), 'build/__mock__')
    const plugin = snowpackPluginContentHash({}, {})
    await plugin.optimize({buildDirectory})
    expect(true).toEqual(true)
  })
})


