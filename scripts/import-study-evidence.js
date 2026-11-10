// Downloads only the publicly shared study pages and their original attachments.
// Cached source records remain in ignored QA output; public images have stable local URLs.
const fs = require('node:fs');
const path = require('node:path');
const { read } = require('./read-public-notes');
const sources = require('../data/service-analysis-sources.json');
const notes = require('../data/service-analyses');
const root = path.join(__dirname, '..');
const cache = path.join(root, 'output/qa/notion-audit');
const plain = b => [b.text || '', ...(b.cells || [])].filter(Boolean).join(' · ');
async function main() {
  fs.mkdirSync(cache, {recursive:true});
  const selected = process.argv.slice(2).filter(arg=>!arg.startsWith('--'));
  const refresh=process.argv.includes('--refresh');
  const manifestFile=path.join(root,'data/service-analysis-evidence.json');
  const manifest=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):{};
  const directory=path.join(root,'images/analysis/source');
  const originalsFile=path.join(root,'data/service-analysis-originals.json');
  const originals=fs.existsSync(originalsFile)?JSON.parse(fs.readFileSync(originalsFile,'utf8')):{};
  fs.mkdirSync(directory,{recursive:true});
  for (let i=0;i<sources.length;i++) {
    const slug=notes[i].slug;
    if (selected.length && !selected.includes(slug)) continue;
    const file=path.join(cache, `${slug}.json`);
    const source=!refresh&&fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):await read(sources[i].id);
    fs.writeFileSync(file, JSON.stringify(source,null,2));
    const text=[],images=[]; let heading='';
    function walk(b) {
      if (['header','sub_header','sub_sub_header'].includes(b.type)) heading=b.text;
      if (b.type==='image') images.push({id:b.id,source:b.source,caption:b.caption,heading});
      else if (b.type!=='page' && plain(b)) text.push(plain(b));
      for (const child of b.children) walk(child);
    }
    walk(source.tree);
    manifest[slug]=[];
    for(const [section,indices] of Object.entries({original:images.map((_,index)=>index)})) {
      for(const index of indices) {
        const attachment=images[index];
        if(!attachment?.source) throw new Error(`Missing attachment ${slug} ${index}`);
        const stem=`${slug}-${String(index+1).padStart(2,'0')}`;
        let filename=fs.readdirSync(directory).find(name=>name.startsWith(stem+'.'));
        if(!filename) {
          const url=`https://melodic-weather-784.notion.site/image/${encodeURIComponent(attachment.source)}?table=block&id=${attachment.id}&cache=v2&width=1600`;
          const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
          const type=response.headers.get('content-type')?.split(';')[0];
          const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'}[type];
          if(!response.ok||!ext) throw new Error(`${slug} ${index}: ${response.status} ${type}`);
          filename=`${stem}.${ext}`;
          fs.writeFileSync(path.join(directory,filename),Buffer.from(await response.arrayBuffer()));
        }
        manifest[slug].push({section,src:`images/analysis/source/${filename}`,blockId:attachment.id,caption:attachment.caption||'',sourceHeading:attachment.heading});
      }
    }
    function publish(block) {
      const image=manifest[slug].find(item=>item.blockId===block.id);
      return {...block,source:image?image.src:(!['image','file','video','pdf'].includes(block.type)?block.source:''),children:block.children.map(publish)};
    }
    originals[slug]={title:source.title,tree:publish(source.tree)};
    fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
    fs.writeFileSync(originalsFile,JSON.stringify(originals,null,2)+'\n');
    console.log(`${slug}: ${manifest[slug].length} original images saved (${images.length} in source)`);
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
