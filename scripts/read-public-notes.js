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
  // Collapsed toggles are not always included in page chunks. Resolve only
  // descendants of the requested public page, never unrelated ancestor pages.
  const attempted=new Set();
  for(let round=0;round<30;round++) {
    const missing=new Set(), visited=new Set();
    function visit(key) {
      if(visited.has(key)) return;
      visited.add(key);
      if(!blocks[key]) {if(!attempted.has(key)) missing.add(key);return;}
      for(const child of blocks[key].content||[]) visit(child);
    }
    visit(id);
    if(!missing.size) break;
    const ids=[...missing]; ids.forEach(key=>attempted.add(key));
    const res=await fetch('https://app.notion.com/api/v3/syncRecordValues',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requests:ids.map(key=>({id:key,table:'block',version:-1}))})});
    if(!res.ok) throw new Error(`Public descendants: HTTP ${res.status}`);
    const data=await res.json();
    Object.assign(blocks,Object.fromEntries(Object.entries(data.recordMap?.block||{}).map(([key,r])=>[key,unwrap(r)])));
  }
  const plain = rich => (rich||[]).map(x=>x[0]).join('');
  const collectionTables={};
  const reachable=new Set();
  function mark(key){if(reachable.has(key)||!blocks[key])return;reachable.add(key);for(const child of blocks[key].content||[])mark(child);}
  mark(id);
  for(const key of reachable) {
    const b=blocks[key];
    if(b.type!=='collection_view'||!b.collection_id||!b.view_ids?.[0])continue;
    const cid=b.collection_id,vid=b.view_ids[0];
    const metadata=await fetch('https://app.notion.com/api/v3/syncRecordValues',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requests:[{id:cid,table:'collection',version:-1},{id:vid,table:'collection_view',version:-1}]})});
    if(!metadata.ok)throw new Error(`Collection metadata: ${metadata.status}`);
    const records=(await metadata.json()).recordMap;
    const collection=unwrap(records?.collection?.[cid]),view=unwrap(records?.collection_view?.[vid]);
    if(!collection?.schema)throw new Error(`Unavailable public collection ${cid}`);
    const response=await fetch('https://app.notion.com/api/v3/queryCollection',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({collection:{id:cid},collectionView:{id:vid},loader:{type:'reducer',reducers:{collection_group_results:{type:'results',limit:100}},searchQuery:'',userTimeZone:'Asia/Seoul'}})});
    if(!response.ok)throw new Error(`Collection rows: ${response.status}`);
    const result=await response.json(),rows=result.result?.reducerResults?.collection_group_results;
    if(!rows||rows.hasMore)throw new Error(`Incomplete public collection ${cid}`);
    const columns=(view?.format?.table_properties||Object.keys(collection.schema).map(property=>({property,visible:true}))).filter(c=>c.visible&&collection.schema[c.property]);
    collectionTables[key]={name:plain(collection.name),rows:[columns.map(c=>collection.schema[c.property].name.replace(/[\u0000-\u001f]/g,'')),...rows.blockIds.map(rowId=>{const row=unwrap(result.recordMap?.block?.[rowId]);return columns.map(c=>plain(row?.properties?.[c.property]));})]};
  }
  function tree(id, seen=new Set()) {
    const b=blocks[id]; if(!b || seen.has(id))return null;
    seen.add(id);
    if(collectionTables[id]) {
      const table=collectionTables[id];
      return {id,type:'table',text:table.name,source:'',caption:'',links:[],missingChildren:[],children:table.rows.map((cells,i)=>({id:`${id}-${i}`,type:'table_row',text:'',cells,links:[],children:[]}))};
    }
    return {id,type:b.type,text:plain(b.properties?.title),source:plain(b.properties?.source),caption:plain(b.properties?.caption),cells:b.type==='table_row'?Object.values(b.properties||{}).map(plain):undefined,links:(b.properties?.title||[]).flatMap(x=>(x[1]||[]).filter(y=>y[0]==='a').map(y=>y[1])),missingChildren:(b.content||[]).filter(key=>!blocks[key]),children:(b.content||[]).map(x=>tree(x,seen)).filter(Boolean)};
  }
  const result={id,title:plain(blocks[id]?.properties?.title),remaining:queue.length,tree:tree(id)};
  if(process.argv.includes('--text')){
    const flatten=b=>[...(b.text&&!['image','page'].includes(b.type)?[b.text]:[]),...(b.cells?[b.cells.join(' | ')]:[]),...(b.source&&b.type==='bookmark'?[b.source]:[]),...b.children.flatMap(flatten)];
    return {id,title:result.title,remaining:result.remaining,text:flatten(result.tree).join('\n')};
  }
  return result;
}
module.exports = { read };
if (require.main === module) (async()=>{const args=process.argv.slice(2).filter(x=>x!=='--text');const ids=args[0]==='--range'?sources.slice(Number(args[1]),Number(args[2])).map(s=>s.id):args;const result=[];for(const id of ids)result.push(await read(id));console.log(JSON.stringify(result));})().catch(e=>{console.error(e.message);process.exitCode=1});
