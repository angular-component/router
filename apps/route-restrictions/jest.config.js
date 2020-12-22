module.exports = {
  name: 'route-restrictions',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/route-restrictions',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
