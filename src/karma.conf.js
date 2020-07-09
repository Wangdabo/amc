// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: '', // 基础路径
    frameworks: ['jasmine', '@angular-devkit/build-angular'], //设定为测试框架的地方, 我们这里主要是用jasmine
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // 是否在浏览器中显示Jasmine结果
    },
    coverageIstanbulReporter: { // 使用reporters为"coverage"时报告输出的类型和那目录
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],  // 负责将测试结果告知给开发者。通常是将结果打印到控制台上，或者存入文件中
    port: 9876,
    colors: true, // 启用或禁用输出（报告和日志）的颜色
    logLevel: config.LOG_INFO, // 控制日志的级别
    autoWatch: true, // 如果设置为true，则测试将以Watch模式运行。如果您更改任何测试并保存文件，测试将重新生成并重新运行
    browsers: ['Chrome'], // 测试浏览器
    singleRun: false // 持续集成模式. 如果该值为true，karma将会启动和捕获配置的浏览器，运行测试然后退出，退出使用的代码0或1取决于测试是成功还是失败。
  });
};
