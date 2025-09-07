module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['@cucumber/pretty-formatter', 'html:cucumber-report.html'],
    publishQuiet: true,
    timeout: 30 * 1000 // 30 seconds
  }
};
