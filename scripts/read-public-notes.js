// Read-only importer for the user's publicly shared Notion notes.
// Emits content to stdout for review; never updates Notion or local content.
const sources = require('../data/service-analysis-sources.json');
const unwrap = record => record?.value?.value || record?.value;
async function read(id) {
  const blocks={}; const queue=[{stack:[]}]; let chunk=0;
  while(queue.length && chunk<30){
    const cursor=queue.shift();
    const res = await fetch('https://app.notion.com/api/v3/loadCachedPageChunkV2', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({page:{id},limit:100,cursor,chunkNumber:chunk++,verticalColumns:false})});
    if (!res.ok) throw new Error(`Public page ${id}: HTTP ${res.status}`);
    const data = await res.json();
    Object.assign(blocks,Object.fromEntries(Object.entries(data.recordMap?.block||{}).map(([key,r])=>[key,unwrap(r)])));
    queue.push(...(data.cursors||[]));
  }
  const plain = rich => (rich||[]).map(x=>x[0]).join('');
  function tree(id, seen=new Set()) {
    const b=blocks[id]; if(!b || seen.has(id))return null;
    seen.add(id);
    return {id,type:b.type,text:plain(b.properties?.title),source:plain(b.properties?.source),caption:plain(b.properties?.caption),cells:b.type==='table_row'?Object.values(b.properties||{}).map(plain):undefined,links:(b.properties?.title||[]).flatMap(x=>(x[1]||[]).filter(y=>y[0]==='a').map(y=>y[1])),children:(b.content||[]).map(x=>tree(x,seen)).filter(Boolean)};
  }
  const result={id,title:plain(blocks[id]?.properties?.title),remaining:queue.length,tree:tree(id)};
  if(process.argv.includes('--text')){
    const flatten=b=>[...(b.text&&!['image','page'].includes(b.type)?[b.text]:[]),...(b.cells?[b.cells.join(' | ')]:[]),...(b.source&&b.type==='bookmark'?[b.source]:[]),...b.children.flatMap(flatten)];
    return {id,title:result.title,remaining:result.remaining,text:flatten(result.tree).join('\n')};
  }
  return result;
}
(async()=>{const args=process.argv.slice(2).filter(x=>x!=='--text');const ids=args[0]==='--range'?sources.slice(Number(args[1]),Number(args[2])).map(s=>s.id):args;const result=[];for(const id of ids)result.push(await read(id));console.log(JSON.stringify(result));})().catch(e=>{console.error(e.message);process.exitCode=1});
