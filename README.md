## epubass

### Build

```bash
pnpm i
npm run build:pord 
```

### Input Dir

```tree
dev
├── image
│   ├── ...
│   └── fig_appendix.JPG
├── metadata.json
└── text
    ├── ...
    └── chapter.xhtml
```

metadata.json

```json
{
  "title": "Re：从零开始的异世界生活『第二十五卷』",
  "author": "长月达平",
  "publisher": "KADOKAWA",
  "date": "2014-06-12 00:00:00",
  "language": "zh",
  "identifier": {
    "type": "isbn",
    "value": "978-4-04-680080-0"
  },
  "description": "《Re:从零开始的异世界生活》，简称《Re:Zero》，是由长月达平撰写，大冢真一郎绘图的日本轻小说作品。故事以一名从便利店回家的途中突然发现自己来到了异世界的蛰居族菜月昴为中心。该作品最初于2012年4月起在投稿网站“成为小说家吧”连载，后来在2014年经由KADOKAWA旗下的MF文库J整理出版。",
  "cover": "image/cover.JPG",
  "spine": [
    "text/chapter_cover.xhtml",
    "text/chapter_cover_sub_1.xhtml",
    "text/chapter_cover_sub_1.xhtml",
    "text/chapter_color_figs.xhtml"
  ],
  "toc": [{
    "text": "封面",
    "src": "text/chapter_cover.xhtml",
    "subs": [{
      "text": "封面x1",
      "src": "text/chapter_cover_sub_1.xhtml"
    }, {
      "text": "封面x2",
      "src": "text/chapter_cover_sub_1.xhtml"
    }]
  }]
}
```

### Useage

`<input dirpath>`: default `process.cwd()`
`<output dirpath>`: default `process.cwd()`

```bash
node dist/index.cjs -i <input dirpath> -o <output dirpath>
```
