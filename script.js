const { Engine, Render, Runner, World, Bodies, Body, Composite } = Matter;

const canvas = document.getElementById('world');
const cofreInner = document.getElementById('cofreInner');

let W = cofreInner.clientWidth;
let H = cofreInner.clientHeight;

canvas.width = W;
canvas.height = H;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: W,
    height: H,
    wireframes: false,
    background: 'transparent'
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

let walls = [];
function createWalls() {
  walls.forEach(w => Composite.remove(world, w));
  walls = [];

  const w = canvas.width;
  const h = canvas.height;
  const ground = Bodies.rectangle(w/2, h + 20, w, 40, { isStatic: true, render: { visible: false }});
  const left = Bodies.rectangle(-20, h/2, 40, h, { isStatic: true, render: { visible: false }});
  const right = Bodies.rectangle(w+20, h/2, 40, h, { isStatic: true, render: { visible: false }});
  walls.push(ground,left,right);
  World.add(world, walls);
}
createWalls();

window.addEventListener('resize', () => {
  W = cofreInner.clientWidth;
  H = cofreInner.clientHeight;
  canvas.width = W;
  canvas.height = H;
  render.options.width = W;
  render.options.height = H;
  createWalls();
});

const tokens = {
  combo: 'assets/combo-accesorio.png',
  himno: 'assets/himno-del-chat.png',
  susurros: 'assets/susurros-futuristas.png',
  speed: 'assets/speed-art.png',
  inspector: 'assets/inspector-de-motes.png'
};

function crearFicha(imgPath, x, y, size=64) {
  const body = Bodies.circle(x, y, size/2, {
    restitution: 0.2,
    friction: 0.08,
    density: 0.002,
    render: {
      sprite: {
        texture: imgPath,
        xScale: (size / 256),
        yScale: (size / 256)
      }
    }
  });
  Body.rotate(body, (Math.random()-0.5) * 1.2);
  return body;
}

function lanzarTotales() {
  const mapping = {
    combo: 'total-combo',
    himno: 'total-himno',
    susurros: 'total-susurros',
    speed: 'total-speed',
    inspector: 'total-inspector'
  };

  let totalCount = 0;
  for (const key in mapping) {
    const val = parseInt(document.getElementById(mapping[key]).value) || 0;
    totalCount += val;
    for (let i=0;i<val;i++) {
      const rect = cofreInner.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = -40 - Math.random()*100;
      const size = 48 + Math.random()*40;
      const body = crearFicha(tokens[key], x, y, size);
      World.add(world, body);
    }
  }

  const base = 320;
  const extra = Math.min(1800, totalCount * 28);
  cofreInner.style.height = Math.max(140, base + extra) + 'px';

  setTimeout(()=> {
    W = cofreInner.clientWidth;
    H = cofreInner.clientHeight;
    canvas.width = W;
    canvas.height = H;
    render.options.width = W;
    render.options.height = H;
    createWalls();
  }, 80);
}

function clearFichas() {
  const all = Composite.allBodies(world);
  all.forEach(b => {
    if (!b.isStatic) Composite.remove(world, b);
  });
  createWalls();
  cofreInner.style.height = '320px';
  W = cofreInner.clientWidth;
  H = cofreInner.clientHeight;
  canvas.width = W;
  canvas.height = H;
  render.options.width = W;
  render.options.height = H;
}

window.addEventListener('scroll', () => {
  const all = Composite.allBodies(world);
  all.forEach(b => {
    if (!b.isStatic) {
      Body.applyForce(b, b.position, { x: (Math.random()-0.5)*0.02, y: -0.03 });
    }
  });
});

document.getElementById('launchTotals').addEventListener('click', lanzarTotales);
document.getElementById('clearBtn').addEventListener('click', clearFichas);
