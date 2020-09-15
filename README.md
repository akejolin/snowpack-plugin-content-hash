# snowpack-plugin-content-hash
This small snowpack plugin will add a *content hash* to your imports paths. The hash is created on `build` command. If no changes is made within the files, the hash will result the same as last build.

### Why content hash
If you do not want bundled production code, then cache control of each imported module is getting more important. Specially if you use some sort of cache service in front of your application, for instance CloudFront.
 
Content based hash, is a great way of taking control over whether the browser should point the request towards its cache or the server. Once there are some changes made within the file, the hash will be updated and the browser will then re-download it.

## Get started
```bash
npm i -D snowpack-plugin-content-hash
```

## Configure the plugin

#### snowpack.config.js
```js
module.exports = {
  plugins: [
    ["snowpack-plugin-content-hash", {
      exts: [".js", ".jsx"], // Extensions of files to be affected by this plugin. Note: only .js or .jsx are valid extensions.
      silent: true, // Provide log output during build process. Default: true.
      hashLength: 8, // Specify the max length of the resulting hash string. Defaults to 0 for the full length.
      hashAlgorithm: "sha256", // Specify the hash algorithm. Defaults to md5.
    }],
  ],
}
```
