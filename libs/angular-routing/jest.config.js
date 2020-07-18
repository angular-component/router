module.exports = {
  name: 'angular-routing',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/angular-routing',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
