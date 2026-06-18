import { join, resolve } from 'node:path';
import { readdirSync, writeFileSync } from 'node:fs';
import { copySync, emptyDirSync, readJSONSync, rmdirSync } from 'fs-extra';
import Handlebars from "handlebars";
import TOC_HBS from './component/toc.hbs';
import CONTENT_HBS from './component/content.hbs';
import MINETYPE_TPL from './template/mimetype.tpl';
import DEFAULT_CSS_TPL from './template/default.css.tpl';
import CONTAINER_TPL from './template/container.xml.tpl';
import { getMimeTypeFrom, hasCssFiles, run } from './utils';
import { execSync } from 'node:child_process';

function makeNcx(metadata: any) {
  let counter = 0;
  Handlebars.registerHelper('nextOrder', function() {
    return ++counter;
  });
  return Handlebars.compile(TOC_HBS)(metadata);
}

function makeOpf(metadata: any, inputDir: string) {
  return Handlebars.compile(CONTENT_HBS)({
    ...metadata,
    modified: new Date().toISOString(),
    images: readdirSync(join(inputDir, 'image')).map(it => {
      const href = `image/${it}`;
      return {
        isCover: href === metadata.cover,
        href,
        mediaType: getMimeTypeFrom(it),
      };
    }),
    texts: readdirSync(join(inputDir, 'text')).map((it) => {
      return {
        href: `text/${it}`,
        mediaType: getMimeTypeFrom(it),
      };
    }),
    styles: run(() => {
      let arr: string[] = [];
      try {
        arr = readdirSync(join(inputDir, 'style')); 
      } catch (error) {}
      if (!arr.length) {
        arr.push('default.css');
      }
      return arr.map((it) => ({
        href: `style/${it}`,
        mediaType: getMimeTypeFrom(it),
      }));
    }),
  });
}

export function core(metadata: any, inputDir: string, outputDir: string) {
  const ncx = makeNcx(metadata);
  const opf = makeOpf(metadata, inputDir);

  const epubDir = join(`${outputDir}/${metadata.title}`);

  emptyDirSync(epubDir);
  emptyDirSync(join(epubDir, 'META-INF'));
  emptyDirSync(join(epubDir, 'OEBPS'));

  writeFileSync(join(epubDir, 'META-INF/container.xml'), CONTAINER_TPL);
  writeFileSync(join(epubDir, 'mimetype'), MINETYPE_TPL);

  emptyDirSync(join(epubDir, 'OEBPS/style'));
  if (!hasCssFiles(join(inputDir, 'style'))) {
    writeFileSync(join(epubDir, 'OEBPS/style/default.css'), DEFAULT_CSS_TPL);
  } else {
    copySync(join(inputDir, 'style'), join(epubDir, 'OEBPS/style'));
  }

  const textOutputDir = join(epubDir, 'OEBPS/text');
  const imageOutputDir = join(epubDir, 'OEBPS/image');
  emptyDirSync(textOutputDir);
  emptyDirSync(imageOutputDir);
  copySync(join(inputDir, 'image'), imageOutputDir);
  copySync(join(inputDir, 'text'), join(epubDir, 'OEBPS/text'));
  writeFileSync(join(epubDir, 'OEBPS/toc.ncx'), ncx);
  writeFileSync(join(epubDir, 'OEBPS/content.opf'), opf);
}

export function make(args: any) {
  const inputDir = resolve(args.inputDir || process.cwd());
  const outputDir = resolve(args.outputDir || process.cwd());
  const metadata = readJSONSync(join(inputDir, 'metadata.json'));
  core(metadata, inputDir, outputDir);
}

export function dist(args: any) {
  const inputDir = resolve(args.inputDir || process.cwd());
  const outputDir = resolve(args.outputDir || process.cwd());
  const metadata = readJSONSync(join(inputDir, 'metadata.json'));
  const epubDir = `${outputDir}/${metadata.title}`;
  const outputFile = join(outputDir, (metadata.name || metadata.title) + '.epub');
  core(metadata, inputDir, outputDir);
  execSync(`zip -X "${outputFile}" mimetype`, { cwd: epubDir });
  execSync(`zip -rg "${outputFile}" META-INF OEBPS`, { cwd: epubDir });
  emptyDirSync(epubDir);
  rmdirSync(epubDir);
}
