import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { RouterOptions } from './schema';

export const workspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0',
  defaultProject: 'bar',
};

export const defaultAppOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  viewEncapsulation: 'Emulated',
  routing: false,
  style: 'css',
  skipTests: false,
};


const collectionPath = path.join(__dirname, '../collection.json');

describe('ng add function', () => {
  let appTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;

  const defaultOptions: RouterOptions = {
    project: 'bar',
    module: 'app',
    name: ''
  };

  beforeEach(async () => {

    schematicRunner = new SchematicTestRunner('angular-routing', collectionPath);

    appTree = await schematicRunner.runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      workspaceOptions
    ).toPromise();

    appTree = await schematicRunner.runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      defaultAppOptions,
      appTree
    ).toPromise();
  });

  it('should import RouterModule a specified module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`/projects/bar/src/app/app.module.ts`);
    expect(content).toContain('RoutingModule.forRoot()');
  });
});
