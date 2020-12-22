module.exports = {
  name: 'responsive-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/responsive-app',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
