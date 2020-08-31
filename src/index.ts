const recursive:any = require('recursive-readdir')

const plugin: object = (snowpackConfig:object, pluginOptions:object) => {
  let isDev:boolean = true;
  console.log(snowpackConfig ? 'snowpackConfig' : 'no snowpackConfig')
  console.log(pluginOptions ? 'pluginOptions' : 'no pluginOptions')
  return {
    name: "snowpack-plugin-content-hash",
    async run(options:any) {
      isDev = !!options.isDev;
    },
    async optimize({ buildDirectory }: any) {
      if (!isDev) {

        recursive(buildDirectory, function (err, files) {
          // `files` is an array of file paths
          console.log(files);
        });
      }
    },
  }
}

export default plugin;
