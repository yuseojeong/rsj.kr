const details = require('../data/service-analysis-details');
const esc = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function wrap(text, limit) {
  const lines=[]; let line='';
  for(const word of text.split(' ')) {
    if(line && (line+' '+word).length>limit){lines.push(line);line='';}
    line+=(line?' ':'')+word;
  }
  if(line)lines.push(line);
  return lines;
}
function label(text,x,y,size,limit,color='#393344'){
  return '<text text-anchor="middle" x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+color+'">'+wrap(text,limit).map((s,i)=>'<tspan x="'+x+'" dy="'+(i?size*1.4:0)+'">'+esc(s)+'</tspan>').join('')+'</text>';
}
function svg(flow,mobile=false) {
  const width=mobile?420:1000, height=mobile?490:340;
  let content='';
  flow.rows.forEach((row,r)=>{
    const color=r===0?'#706978':'#7952a7',x=mobile?112+r*196:0;
    content+=mobile?label(row.label,x,28,17,12,color):'<text x="25" y="'+(30+r*165)+'" font-size="19" font-weight="600" fill="'+color+'">'+esc(row.label)+'</text>';
    row.steps.forEach((step,i)=>{
      const bx=mobile?20+r*196:24+i*330, by=mobile?80+i*137:50+r*165;
      const w=mobile?184:292,h=mobile?108:104;
      content+='<rect x="'+bx+'" y="'+by+'" width="'+w+'" height="'+h+'" rx="14" fill="'+(r===0?'#f4f2f6':'#f4effb')+'" stroke="'+(r===0?'#e3dfe8':'#d8c8e9')+'"/>';
      const lines=wrap(step,mobile?9:17);
      content+=label(step,bx+w/2,by+h/2-(lines.length-1)*(mobile?14:16)+8,mobile?20:23,mobile?9:17);
      if(i<row.steps.length-1) content+=mobile?'<path d="M'+(bx+w/2)+' '+(by+h+8)+'v17m-5-5 5 5 5-5" fill="none" stroke="'+color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>':'<path d="M'+(bx+w+9)+' '+(by+h/2)+'h20m-6-6 6 6-6 6" fill="none" stroke="'+color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    });
  });
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" role="img" aria-labelledby="title desc"><title id="title">'+esc(flow.title)+'</title><desc id="desc">'+esc(flow.rows.map(r=>r.label+': '+r.steps.join(' → ')).join('. '))+'</desc><rect width="100%" height="100%" fill="#fff"/><g font-family="Noto Sans KR, Apple SD Gothic Neo, sans-serif">'+content+'</g></svg>';
}
module.exports=()=>Object.entries(details).filter(([,d])=>d.flow).flatMap(([slug,d])=>[
  ['images/analysis/'+slug+'-flow.svg',svg(d.flow)],
  ['images/analysis/'+slug+'-flow-mobile.svg',svg(d.flow,true)]
]);
