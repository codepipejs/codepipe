import * as path from 'path';
import * as fs from 'fs-extra';
import * as directoryTree from 'directory-tree';
import { Reducer } from '@codepipe/reducer';
import { INodeTree, INodeTemplate, DirectiveType } from '@codepipe/common';
import { flattenDeep, groupBy } from 'lodash';
import { Transpiler } from '@codepipe/transpiler';
import { compile } from 'ejs';
import * as treeify from 'treeify';
import chalk from 'chalk';

export const command = 'apply <output>';
export const description = 'Apply a folder\'s template into output';

export const builder = {
  output: {
    default: '.',
    description: 'the output folder'
  },
  model: {
    alias: 'm',
    description: 'The model to apply',
    require: true
  },
  input: {
    alias: 'i',
    description: 'Template folder input',
    require: true
  }
};

export function handler(yargs) {
  const modelPath = path.resolve(yargs.model);
  const inputPath = path.resolve(yargs.input);
  const outputPath = path.resolve(yargs.output);
  
  const model = require(modelPath);
  const dirTree: any = directoryTree(inputPath);
  const tree: INodeTree[] = dirTree.children;

  const templTree = Reducer.expand(tree, model);
  // set the relative path
  templTree.forEach(t => { setRelative(t) });
  // filter the template files
  // and only who need to be write
  const templates = flattenDeep(
      templTree.map(_tmap)
    ).filter(t => {
      const fp = path.join(outputPath, t.relative, t.name);
      return t.directive === DirectiveType.Auto || !fs.existsSync(fp);
    });
  
  console.log(chalk.bold(`${templates.length} templates to apply`));

  // group by templates
  const grouped = groupBy(templates, 'path');

  const trans = new Transpiler( { compile } );

  Object.keys(grouped).forEach( tkey => {
    grouped[tkey].forEach( (titem: INodeTemplate) => {
      trans
        .render(titem.path, titem.context)
        .then(content => {
          // FIXME: conrvet to async
          const fp = path.join(outputPath, titem.relative, titem.name);
          const dir = path.dirname(fp);
          fs.ensureDirSync(dir);
          fs.writeFileSync(fp, content);
          console.log(chalk.green('CREATE'), fp.replace(outputPath, ''));
        });
    });
  });

}

function setRelative(templ, relative = '') {
  templ.relative = relative;
  if (templ.children) {
    templ.children.forEach(t => { setRelative(t, path.join(templ.relative, templ.name)) });
  }
}

function _tmap(templ) {
  if (templ.type === 'file') {
    return templ;
  }

  return templ.children ? templ.children.map(_tmap) : [];
}