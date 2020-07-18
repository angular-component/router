import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { RouterOptions } from './schema';
import { async } from '@angular/core/testing';

export const workspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0',
  defaultProject: 'bar',
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
    schematicRunner = new SchematicTestRunner('schematics', collectionPath);
    appTree = await schematicRunner.runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      workspaceOptions
    ).toPromise();
  });

  it('should update package.json', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);

    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['angular-routing']).toBeDefined();
  });

  it('should import RouterModule a specified module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`src/app/app.module.ts`);
    expect(content).toMatch(
      /import { RoutingModule } from '\.\/angular-routing';/
    );
  });
});
