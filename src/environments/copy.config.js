var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/copy.config.js');

module.exports = function () {
  useDefaultConfig.ChartJS = {
    src: ['{{ROOT}}/node_modules/chart.js/dist/Chart.bundle.min.js'],
    dest: '{{BUILD}}'
  };

  return useDefaultConfig;
};
