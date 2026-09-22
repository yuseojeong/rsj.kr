(() => {
  const hero = document.querySelector('.coffeechat-dialog');
  const canvas = hero?.querySelector('.meadow-motion');
  const button = hero?.querySelector('.scene-motion-toggle');
  if (!hero || !canvas || !button) return;
  function initialize() {
  const ctx = canvas.getContext('2d');
  if (!ctx) { button.hidden = true; return; }
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionPreference.matches;
  let visible = true;
  let width = 0, height = 0, frame = 0, time = 0, previous = 0;
  const landscape = window.createMeadowLandscape?.(hero, () => { resize(); });
  let stars = [], blades = [], fireflies = [];
  // Seeded positions keep the landscape steady across resizes.
  let seed = 41;
  function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function resize() {
    width = hero.clientWidth; height = hero.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    landscape?.resize(width, height);
    seed = 41;
    stars = Array.from({length:width < 600 ? 40 : 85}, () => ({x:random(),y:random()*.64,r:.35+random()*.85,phase:random()*Math.PI*2,speed:.45+random()*.7}));
    blades = Array.from({length:width < 600 ? 45 : 95}, () => ({x:random(),base:.97+random()*.06,length:20+random()*60,lean:(random()-.5)*17,phase:random()*Math.PI*2,tone:random(),thickness:.6+random()*1.1}));
    fireflies = Array.from({length:width < 600 ? 19 : 34}, () => ({x:random(),y:.62+random()*.31,phase:random()*Math.PI*2,r:.9+random()*1.3,speed:.35+random()*.45,travel:18+random()*32}));
    draw();
  }
  function draw() {
    landscape?.draw(time);
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      // Preserve a calm, readable area behind the title and description.
      if (star.x>.22 && star.x<.78 && star.y>.14 && star.y<.52) continue;
      const opacity=.2+(Math.sin(time*star.speed+star.phase)+1)*.2;
      ctx.beginPath(); ctx.arc(star.x*width,star.y*height,star.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(215,236,255,${opacity})`; ctx.fill();
    }
    for (const fly of fireflies) {
      const x=fly.x*width+Math.sin(time*fly.speed+fly.phase)*fly.travel+Math.sin(time*.19+fly.phase)*22;
      const y=fly.y*height+Math.cos(time*fly.speed*.65+fly.phase)*18+Math.sin(time*.36+fly.phase)*12;
      const alpha=.25+(Math.sin(time*1.3+fly.phase)+1)*.24;
      const radius=9+fly.r*3;
      const light=ctx.createRadialGradient(x,y,0,x,y,radius);
      light.addColorStop(0,`rgba(255,235,162,${alpha*.65})`);light.addColorStop(.3,`rgba(252,221,154,${alpha*.2})`);light.addColorStop(1,'rgba(250,227,165,0)');
      ctx.fillStyle=light;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
      ctx.beginPath();ctx.arc(x,y,fly.r*.75,0,Math.PI*2);ctx.fillStyle=`rgba(255,243,190,${alpha})`;ctx.fill();
    }
    for (const blade of blades) {
      const x=blade.x*width, y=blade.base*height;
      const sway=Math.sin(time*1.25+blade.x*9)*10+Math.sin(time*.7+blade.phase)*4;
      ctx.beginPath();ctx.moveTo(x,y);
      ctx.quadraticCurveTo(x+blade.lean*.35+sway*.4,y-blade.length*.55,x+blade.lean+sway,y-blade.length);
      ctx.strokeStyle=blade.tone>.65?'rgba(141,160,127,.34)':'rgba(48,86,69,.5)';
      ctx.lineWidth=blade.thickness;ctx.lineCap='round';ctx.stroke();
    }
  }
  function tick(timestamp) {
    frame = 0;
    if (paused || !visible || !hero.open || document.hidden) { previous=0; return; }
    if (!previous || timestamp-previous>=32) {
      const delta = previous ? Math.min(timestamp-previous,64)/1000 : 0;
      time += delta;
      previous=timestamp;draw();
    }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    hero.classList.toggle('motion-paused',paused || !visible || !hero.open || document.hidden);
    button.setAttribute('aria-pressed',String(paused));
    button.setAttribute('aria-label',paused?'배경 애니메이션 재생':'배경 애니메이션 일시정지');
    button.querySelector('.motion-label').textContent=paused?'움직임 재생':'움직임 멈추기';
    button.firstElementChild.textContent=paused?'▷':'Ⅱ';
    if (frame) cancelAnimationFrame(frame);
    frame=0;previous=0;
    if (!paused && visible && hero.open && !document.hidden) frame=requestAnimationFrame(tick);
  }
  button.addEventListener('click',()=>{paused=!paused;sync();});
  motionPreference.addEventListener('change',event=>{paused=event.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  hero.addEventListener('close',sync);
  hero.addEventListener('coffeechat:open',()=>{resize();sync();});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(hero);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener('resize',resize,{passive:true});
  resize();sync();
  }
  hero.addEventListener('coffeechat:open',initialize,{once:true});
})();
