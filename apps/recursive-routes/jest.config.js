module.exports = {
  name: 'recursive-routes',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/recursive-routes',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
