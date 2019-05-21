// vue.config.js
const webpack = require("webpack");

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
              })
        ],
        externals:{
          'vue':'Vue',
          'vue-router':'VueRouter',
          'vuex':'Vuex',
          'element-ui':'ELEMENT',
          'jquery':'$'
        },
      },
      
}