$(document).ready(function () {
  $("body").css("display", "none");
  $("body").fadeIn(2000);
});

const audio = new Audio("songs/3.mp3");
$(".audio").click(function () {
  audio.play();
});

$("#switch").click(function () {
  if (this.checked) {
    $("html").css("background-color", "#ffeeee");
    $("html").css("transition", "3s");
    $(".switch").css("transition", "3s");
    $(".switch").css("background", "#F2789F");
  } else {
    $(".switch").css("background", "#8443c1");
    $("html").css("background-color", "#eaf6f6");
  }
});

let Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

let engine = Engine.create();

function init() {
  let numm = Math.random();
  $("canvas").remove();

  let width = $(window).width();
  let height = $(window).height();
  let vmin = Math.min(width, height);

  engine.events = {};
  World.clear(engine.world);
  Engine.clear(engine);

  engine = Engine.create();

  let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      wireframes: false,
      background: "transparent",
      width: width,
      height: height,
    },
  });

  World.add(engine.world, [
    Bodies.rectangle(width / 2, height + 50, width, 100, {
      isStatic: true,
    }),
    Bodies.rectangle(width / 2, -50, width, 100, {
      isStatic: true,
    }),
    Bodies.rectangle(-50, height / 2, 100, height, {
      isStatic: true,
    }),
    Bodies.rectangle(width + 50, height / 2, 100, height, {
      isStatic: true,
    }),

    Bodies.circle(width / 2 - vmin * 0.182, (height / 4) * 3, vmin * 0.065, {
      isStatic: true,
      render: {
        fillStyle: "white",
      },
    }),
    Bodies.circle(width / 2 + vmin * 0.182, (height / 4) * 3, vmin * 0.065, {
      isStatic: true,
      render: {
        fillStyle: "white",
      },
    }),
  ]);

  for (let i = 0; i < 150; i++) {
    let radius = Math.round(10 + (Math.random() * vmin) / 200);
    World.add(
      engine.world,
      Bodies.circle(
        Math.random() * width,
        (Math.random() * height) / 4,
        radius,
        {
          render: {
            fillStyle: [
              "#EDEDED",
              "#FEE3EC",
              "#F9C5D5",
              "#F2789F",
              "#D47AE8",
              "#F4BEEE",
            ][Math.round(Math.random() * 6 - 0.5)],
          },
        }
      )
    );
  }

  Engine.run(engine);

  Render.run(render);
  let num = 0;
  function update() {
    engine.world.gravity.x = Math.sin(num / 100);
    engine.world.gravity.y = Math.cos(num / 100);
    num += 1.7;
    idRAF = requestAnimationFrame(update.bind(this));
  }
  update();
}

init();

$(window).resize(function () {
  init();
});
