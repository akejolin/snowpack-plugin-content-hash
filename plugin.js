const recursive = require('recursive-readdir')
const crypto = require('crypto')
const fs = require('fs');
const path = require('path');
const replace = require('replace');
const locateImports = require('./locate-imports');


const createHashFromFile = filePath => new Promise(resolve => {
  const hash = crypto.createHash('md5');
  fs.createReadStream(filePath).on('data', data => hash.update(data)).on('end', () => resolve(hash.digest('hex')));
});

const getCurrentDirPath = file => {
  const filePathSplit = file.split('/')
  return filePathSplit.splice(0, filePathSplit.length - 1)
}

const createReference = async file => {
  const hash = await createHashFromFile(file).then(hash => hash)
  // Get origin file name
  let filePathSplit = file.split('/')
  const originFileName = filePathSplit[filePathSplit.length - 1]
  let fileNameSplit = originFileName.split('.')
  // Get file extension
  const ext = fileNameSplit[fileNameSplit.length - 1]

  // Create complete new file path
  const result = {
    file,
    hash,
    ext,
  }
  return result
}

const plugin = (snowpackConfig, pluginOptions) => {
  // defaults
  let isDev = true;
  const defaultExt = ['js', 'jsx']

  return {
    name: "snowpack-plugin-content-hash",
    async run(options) {
      isDev = !!options.isDev;
    },

    async optimize({ buildDirectory }) {
      /*
      * 1. Create reference including content hash of all
      * wanted file extensions, within the build dir.
      */
      const files = await recursive(buildDirectory).then(files => files)
      const promiseReferenceFiles = files.map(file => createReference(file))
      const referenceFiles = await Promise.all(promiseReferenceFiles).then(res => res)

      /*
      * 2. Locate all imports made within the built dir
      */
      const importsInFileList = locateImports(
        referenceFiles.filter(f => f.ext === 'js').map(f => f.file)
      )

      /*
      * 3. Verify the imports with reference
      */
      const readyForImplementation = []

      importsInFileList.forEach(file => {
        file.imports.forEach(imp => {
          const testImport = path.resolve(getCurrentDirPath(file.location).join('/'), imp)
          const verifiedImport = referenceFiles.find(t => t.file === testImport)
          if (verifiedImport) {
            const hash = verifiedImport.hash || ''
            readyForImplementation.push({
              location: file.location,
              testImport,
              importPath: imp,
              hash, // Add content hash for implementation later on
            })
          }
        })
      })


      /*
      * 4. Inject hash into imports
      */

      readyForImplementation.forEach(async ({location, importPath, hash}) => replace({
        regex: importPath,
        replacement: `${importPath}?hash=${hash}`,
        paths: [location],
        recursive: true,
        silent: true,
      }))
    }
  }
}

module.exports = plugin;
