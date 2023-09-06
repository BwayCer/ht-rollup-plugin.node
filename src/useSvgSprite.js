
import path from 'path';

import svgSpriteTransform from './svgSpriteTransform.js';


async function _svgSprite(cmdName, pluginName, cwd, base, dist, coreUtils) {
  console.log(`[${cmdName}] svgSprite run`);

  const {cleanDir, pipeline, pluginTaskLog, fsStream} = coreUtils;

  await pipeline(
    fsStream.findVinyl('**/*.{svg,gif,jpg,png,webp,avif}', {cwd, base}),
    svgSpriteTransform(),
    pluginTaskLog(pluginName),
    fsStream.dest(dist, {cwd, isForce: true}),
  );

  console.log(`[${cmdName}] svgSprite done`);
}


export default function (config, coreUtils, cmdArgv) {
  const {cmdName, cwd, base} = config;
  const pluginName = 'svgSprite';

  cmdArgv.svgSpriteSrc = cmdArgv.svgSpriteSrc ?? cmdArgv.i ?? base;
  cmdArgv.to = cmdArgv.to ?? cmdArgv.t ?? 'dist';

  const svgSpriteSrcBase = path.resolve(cmdArgv.svgSpriteSrc);
  const dist = path.resolve(cmdArgv.to);

  config.subCmds.push({
    subCmd: 'svgSprite',
    briefly: '多張圖片整合成一張SVG圖',
    helpTxt: `Usage: ${cmdName} svgSprite [OPTION]`
      + '\n\nOptions:'
      + '\n  -s, --src <path>            origin directory. (default: "./src")'
      + '\n  -i, --svgSpriteSrc <path>   origin directory for svgSprite.'
      + ' (default: same as "--src")'
      + '\n  -t, --to <path>             dist directory. (default: "./dist")'
      + '\n  -h, --help                  display this help'
      + '\n',
    async exec() {
      switch (cmdArgv._.join('.')) {
        case 'svgSprite':
          await _svgSprite(
            cmdName, pluginName, cwd, svgSpriteSrcBase, dist, coreUtils,
          );
          break;
        default:
          console.log(this.helpTxt);
      }
    },
  });
}

