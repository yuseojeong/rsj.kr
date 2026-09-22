/* Automatic meadow and fingertip motion only. The image supplies its own sky
   colors; hair, neck and shoulders stay still. No pointer input or color grading. */
window.createMeadowLandscape = (hero, onReady) => {
  const canvas = hero.querySelector('.landscape-motion');
  const image = hero.querySelector('.meadow-image');
  const nightImage = hero.querySelector('.meadow-night-image');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
  if (!gl) return null;
  let program, texture, nightTexture, buffer, uniforms, ready = false;
  const vertexSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = vec2((a_position.x + 1.0) * .5, (1.0 - a_position.y) * .5);
      gl_Position = vec4(a_position, 0.0, 1.0);
    }`;
  const fragmentSource = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_image;
    uniform sampler2D u_nightImage;
    uniform vec2 u_view, u_imageSize, u_position;
    uniform float u_time;
    uniform float u_nightMix;
    float patch(vec2 p, vec2 center, vec2 radius) {
      vec2 delta = (p - center) / radius;
      float distance = dot(delta, delta);
      return 1.0 - smoothstep(0.0, 1.0, distance);
    }
    void main() {
      float scale = max(u_view.x / u_imageSize.x, u_view.y / u_imageSize.y);
      vec2 crop = (u_imageSize * scale - u_view) * u_position;
      vec2 uv = (v_uv * u_view + crop) / (u_imageSize * scale);
      vec2 p = uv * vec2(1536.0, 1024.0);
      float breeze = sin(u_time * 1.25) + .38 * sin(u_time * 2.1 + .8);
      // Two offset typing rhythms; wrist edges feather into the still image.
      float leftHand = patch(p, vec2(955.0, 799.0), vec2(22.0, 13.0));
      float rightHand = patch(p, vec2(983.0, 808.0), vec2(28.0, 12.0));
      float typing = .55 + .45 * sin(u_time * .85);
      p.y += (leftHand * sin(u_time * 8.5) + rightHand * sin(u_time * 7.2 + 1.8)) * 1.7 * typing;
      p.x += rightHand * sin(u_time * 4.1) * .7 * typing;
      // Coherent wind travels through the actual meadow, protecting the figure.
      float person = smoothstep(770.0, 805.0, p.x) * (1.0 - smoothstep(1145.0, 1180.0, p.x)) * (1.0 - smoothstep(875.0, 900.0, p.y));
      float grass = smoothstep(735.0, 1000.0, p.y) * (1.0 - person);
      p.x += grass * (sin(u_time * 1.3 + p.x * .012) * 3.5 + breeze * 3.0);
      p.y += grass * sin(u_time * .95 + p.x * .016) * 1.3;
      vec2 samplePoint = clamp(p / vec2(1536.0, 1024.0), .001, .999);
      vec3 color = mix(texture2D(u_image, samplePoint).rgb, texture2D(u_nightImage, samplePoint).rgb, u_nightMix);
      gl_FragColor = vec4(color, 1.0);
    }`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('Landscape shader unavailable');
    }
    return shader;
  }
  function init() {
    if (!image.naturalWidth || gl.isContextLost()) return;
    try {
      program = gl.createProgram();
      const shaders = [compile(gl.VERTEX_SHADER, vertexSource), compile(gl.FRAGMENT_SHADER, fragmentSource)];
      shaders.forEach(shader => gl.attachShader(program, shader));
      gl.linkProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Landscape program unavailable');
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);
      nightTexture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, nightTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, nightImage?.naturalWidth ? nightImage : image);
      gl.uniform1i(gl.getUniformLocation(program, 'u_nightImage'), 1);
      gl.activeTexture(gl.TEXTURE0);
      uniforms = Object.fromEntries(['view', 'imageSize', 'position', 'time', 'nightMix'].map(name => [name, gl.getUniformLocation(program, `u_${name}`)]));
      gl.uniform2f(uniforms.imageSize, image.naturalWidth, image.naturalHeight);
      ready = true;
      onReady();
      hero.classList.add('landscape-ready');
    } catch {
      ready = false;
      hero.classList.remove('landscape-ready');
      if (texture) gl.deleteTexture(texture);
      if (nightTexture) gl.deleteTexture(nightTexture);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    }
  }
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); ready = false; hero.classList.remove('landscape-ready');
  });
  canvas.addEventListener('webglcontextrestored', init);
  if (image.complete) queueMicrotask(init);
  else image.addEventListener('load', init, { once: true });
  nightImage?.addEventListener('load', () => {
    if (!ready || gl.isContextLost()) return;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, nightTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, nightImage);
    gl.activeTexture(gl.TEXTURE0);
  });
  return {
    resize(width, height) {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    },
    draw(time) {
      if (!ready) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.view, hero.clientWidth, hero.clientHeight);
      const position = getComputedStyle(image).objectPosition.split(' ').map(parseFloat);
      gl.uniform2f(uniforms.position, position[0] / 100, position[1] / 100);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.nightMix, nightImage ? parseFloat(getComputedStyle(nightImage).opacity) : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };
};
