module.exports = {
  name: 'getting-started',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/getting-started',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
