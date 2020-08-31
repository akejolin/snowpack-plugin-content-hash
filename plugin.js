const recursive = require('recursive-readdir')
const crypto = require('crypto')
const fs = require('fs');
const { resolve } = require('path');

const createHashFromFile = filePath => new Promise(resolve => {
  const hash = crypto.createHash('md5');
  fs.createReadStream(filePath).on('data', data => hash.update(data)).on('end', () => resolve(hash.digest('hex')));
});

const plugin = (snowpackConfig, pluginOptions) => {
  let isDev = true;

  return {
    name: "snowpack-plugin-content-hash",
    async run(options) {
      isDev = !!options.isDev;
    },
    async optimize({ buildDirectory }) {
      if (!isDev) {
        const files = await recursive(buildDirectory).then(files => files)

        /*
        * 1. Get each file within build folder and format
        */
        const hashesAndFiles = files.map(async (file) => {
          // create content hash of file
          const hash = await createHashFromFile(file)
          // Get origin file name
          let filePathSplit = file.split('/')
          const originFileName = filePathSplit[filePathSplit.length - 1]
          let fileNameSplit = originFileName.split('.')
          // Get file extension
          const ext = fileNameSplit[fileNameSplit.length - 1]
          fileNameSplit = fileNameSplit.splice(0, fileNameSplit.length - 1)
          // Create new file name with hash
          const newFileName = `${fileNameSplit.join('.')}.${hash}.${ext}`
          filePathSplit = filePathSplit.splice(0, filePathSplit.length - 1)
          filePathSplit.push(newFileName)
          // Create complete new file path
          const newFilePath = filePathSplit.join('/')
          const result = {
            originPath: file,
            originFileName,
            hash,
            newPath: newFilePath,
            newFileName
          }
          return result
        })
        let result = await Promise.all(hashesAndFiles).then(res => res)

        /*
        * 2. Exe change name
        */
        const _result = result.map(async file => {
            try {
              fs.renameSync(file.originPath, file.newPath)
            } catch (e) {
              console.log('Error renameSync: ', e)
            }
            return {
              originPath: file.originPath,
              newPath: file.newPath,
              status: 'ok'
            }
        })

        /*
        * 3. Find every imports for each file
        */
          const __result = _result.map(file => {


          })

        /*
        * 4. Exe replace each import with new filename
        */

      }
    },
  }
}

module.exports = plugin;
