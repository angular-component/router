import {
  chain, Rule,
  Tree, SchematicsException
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { addImportToModule, insertImport } from '../utils/ast-utils';
import { InsertChange } from '../utils/change';
import { RouterOptions } from './schema';
import { findModuleFromOptions } from '../utils/find-module';
import { getProjectPath } from '../utils/project';

function addImportToNgModule(options: RouterOptions): Rule {
  return (host: Tree) => {
    options.path = getProjectPath(host, options);
    const modulePath = findModuleFromOptions(host, options);

    if (!modulePath) {
      return host;
    }

    if (!host.exists(modulePath)) {
      throw new Error('Specified module does not exist');
    }


    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      modulePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );


    const importChanges = addImportToModule(
      source,
      modulePath,
      'RoutingModule.forRoot()',
      'angular-routing',
    ).shift();


    let changes = [
      insertImport(source, modulePath, 'RoutingModule', 'angular-routing'),
      importChanges
    ];

    const recorder = host.beginUpdate(modulePath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

// Just return the tree
export default function (options: RouterOptions): Rule {

  return chain([
    addImportToNgModule(options)
  ]);
}



