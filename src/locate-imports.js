const esprima = require('esprima')
const fs = require('fs')

const locateImports = (fileList) => {
  let result = fileList.map(location => {

    if (!fs.existsSync(location)) {
      return null
    }

    const stat = fs.statSync(location);

    if (!stat.isFile()) {
      return null
    }

    let content = fs.readFileSync(location, 'utf-8')
    let tree = []
    const imports = []

    // Neutralize import.meta.env
    content = content.replace(/import\./gi, `fakeImport.`)

    try {
      tree = esprima.parse(content, {
        sourceType: 'module',
        tolerant: true,
      })
      tree.body.forEach(node => {
        if (node.type === 'ImportDeclaration') {
          imports.push(node.source.value);
        }
      })
    } catch (err) {
      console.log('Error parsing ecma script with file: ', location, err)
    }
    return {
      location,
      imports,
    }

  }).filter(f => f !== null)

  return result
}
module.exports = locateImports;