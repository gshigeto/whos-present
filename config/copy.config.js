var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/copy.config.js');

module.exports = function () {
  useDefaultConfig.NGXIndexCSS = {
    src: ['{{ROOT}}/node_modules/@swimlane/ngx-charts/release/index.css'],
    dest: '{{BUILD}}'
  };

  useDefaultConfig.D3 = {
    src: ['{{ROOT}}/node_modules/d3/build/d3.min.js'],
    dest: '{{BUILD}}'
  };

  return useDefaultConfig;
};
