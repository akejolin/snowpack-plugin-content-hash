const esprima = require('esprima')
const fs = require('fs')

const locateImports = (fileList) => {
  const result = fileList.map(location => {
    var stat = fs.statSync(location);
    if (!stat.isFile()) {
        return;
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
  })
  return result
}
module.exports = locateImports;