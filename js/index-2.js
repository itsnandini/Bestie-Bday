var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Body = Matter.Body,
  Bodies = Matter.Bodies;

var worldW = window.innerWidth;
var worldH = window.innerHeight;

var engine;
var render;

// bodies
var blocks = [];
var walls = [];
var ground;

// DOM elements
var hBlocks = document.getElementsByClassName("anarchy");

var pageWidth = 0;

window.onload = function () {
  pageWidth = window.innerWidth;
};

window.onresize = function () {
  var newpageWidth = window.innerWidth;
  if (newpageWidth < pageWidth) {
    for (var i = 0; i < blocks.length; i++) {
      Body.setPosition(blocks[i].body, {
        x: newpageWidth / 2,
        y: window.innerHeight + 500 + 50 * i,
      });
    }
  }
  pageWidth = newpageWidth;
};

function Box(x, y, w, h) {
  var options = {
    density: 0.00005,
    friction: 0.5,
    restitution: 0,
  };
  this.body = Bodies.rectangle(x, y, w, h, options);
  xVel = 10 * Math.random() - 5;
  Body.setVelocity(this.body, { x: xVel, y: 0 });
  World.add(engine.world, [this.body]);
}

function Ball(x, y, r) {
  var options = {
    density: 0.00005,
    friction: 0.5,
    restitution: 0,
  };
  this.body = Bodies.circle(x, y, r, options);
  xVel = 10 * Math.random() - 5;
  Body.setVelocity(this.body, { x: xVel, y: 0 });
  World.add(engine.world, [this.body]);
}

function setup() {
  engine = Engine.create();
  engine.world.gravity.y = -0.5;

  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      showAngleIndicator: true,
    },
  });
  Render.run(render);
  for (var i = 0; i < hBlocks.length; i++) {
    var startHeight = window.innerHeight;
    if (hBlocks[i].classList.contains("prio1")) {
      startHeight += 500;
    } else if (hBlocks[i].classList.contains("prio2")) {
      startHeight += 1500;
    } else if (hBlocks[i].classList.contains("prio3")) {
      startHeight += 2000;
    } else if (hBlocks[i].classList.contains("prio4")) {
      startHeight += 2500;
    } else if (hBlocks[i].classList.contains("prio5")) {
      startHeight += 3000;
    } else {
      startHeight += 3000;
    }
    if (hBlocks[i].classList.contains("ball")) {
      blocks.push(
        new Ball(window.innerWidth / 2, startHeight, hBlocks[i].offsetWidth / 2)
      );
    } else if (hBlocks[i].classList.contains("block")) {
      blocks.push(
        new Box(
          window.innerWidth / 2,
          startHeight,
          hBlocks[i].offsetWidth,
          hBlocks[i].offsetHeight
        )
      );
    }
  }
  ground = Bodies.rectangle(10000, -50, 20000, 100, { isStatic: true });
  ceiling = Bodies.rectangle(10000, 40050, 20000, 100, { isStatic: true });
  walls[0] = Bodies.rectangle(-50, 20000, 100, 40000, { isStatic: true });
  walls[1] = Bodies.rectangle(window.innerWidth + 50, 20000, 100, 40000, {
    isStatic: true,
  });
}

function draw() {
  // for(var i=0;i<boxes.length;i++){
  //   boxes[i].show();
  // }
  World.add(engine.world, [ground, ceiling, walls[0], walls[1]]);
}

setup();
draw();

(function render() {
  Engine.update(engine, 20);
  Body.setPosition(walls[1], { x: document.body.clientWidth + 50, y: 0 });
  for (var i = 0; i < blocks.length; i++) {
    var xTrans = blocks[i].body.position.x - hBlocks[i].offsetWidth / 2;
    var yTrans = blocks[i].body.position.y - hBlocks[i].offsetHeight / 2;
    hBlocks[i].style.transform =
      "translate(" +
      xTrans +
      "px, " +
      yTrans +
      "px) rotate(" +
      blocks[i].body.angle +
      "rad)";
    hBlocks[i].style.visibility = "visible";
  }
  window.requestAnimationFrame(render);
})();
