const recursive = require('recursive-readdir')
const crypto = require('crypto')
const fs = require('fs');
const path = require('path');
const replace = require('replace');
const locateImports = require('./locate-imports');

const {
  createHashFromFile,
  extractDirInPath,
  extractFileInPath
} = require('./utils.js');

// defaults
let isDev = true;
const defaultExt = ['js', 'jsx']


const createReference = async file => {
  const hash = await createHashFromFile(file).then(hash => hash)
  // Get file extension
  const fileName = extractFileInPath(file)



  // Create complete new file path
  const result = {
    file,
    hash,
    ext: fileName.ext,
  }
  return result
}

const formatOptions = options => {
  const {
    exts,
    silent,
  } = options || {}

  let _exts = Array.isArray(exts) && exts.length > 0 ? exts.map(ext => ext.replace(/\./, '')) : defaultExt
  // ToDo: We may find other solutions for other filetypes in the future. But for now, only .js and .jsx are valid.
  _exts = _exts.filter(e => defaultExt.find(ext => ext === e))

  return {
    exts: _exts,
    silent: typeof silent === 'boolean' ? silent : true
  }
}

const plugin = (snowpackConfig, pluginOptions) => {

  const { exts, silent } = formatOptions(pluginOptions)

  return {
    name: "snowpack-plugin-content-hash",
    async run(options) {
      isDev = !!options.isDev;
    },

    async optimize({ buildDirectory }) {
      if (isDev) {
        return
      }
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
        referenceFiles.filter(ref => exts.find(ext => ext === ref.ext)).map(ref => ref.file),
      )

      /*
      * 3. Verify the imports with reference
      */
      const readyForImplementation = []

      importsInFileList.forEach(host => {
        host.imports.forEach(imp => {
          const testImport = path.resolve(extractDirInPath(host.location).str, imp)

          const verifiedImport = referenceFiles.find(ref => ref.file === testImport)
          if (verifiedImport) {
            if (!exts.find(ext => ext === extractFileInPath(imp).ext)) {
              return
            }
            const hash = verifiedImport.hash || ''
            readyForImplementation.push({
              hostLocation: host.location,
              importPath: imp,
              hash, // Add content hash for implementation later on
            })
          }
        })
      })

      /*
      * 4. Inject hash into imports
      */

      readyForImplementation.forEach(async ({hostLocation, importPath, hash}) => replace({
        regex: importPath,
        replacement: `${extractDirInPath(importPath).str}/${extractFileInPath(importPath).name}-${hash}.${extractFileInPath(importPath).ext}`,
        paths: [hostLocation],
        recursive: true,
        silent: true,
      }))

      /*
      * 5. Rename files
      */

      referenceFiles.forEach(ref => {
        if (exts.find(ext => ext === ref.ext)) {
          const newPath = `${extractDirInPath(ref.file).str}/${extractFileInPath(ref.file).name}-${ref.hash}.${extractFileInPath(ref.file).ext}`
          fs.renameSync( ref.file, newPath)
        }
      })


      /*
      * 6. Log output implementation
      */

      if (!silent) {
        readyForImplementation.forEach(file => {
          console.log(file)
        })
      }
    }
  }
}

module.exports = plugin;
