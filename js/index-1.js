$(document).ready(function () {
  $("body").css("display", "none");
  $("body").fadeIn(2000);
});

const audio = new Audio("songs/1.mp3");
const audio1 = new Audio("songs/audio-1.mp3");
const audio2 = new Audio("songs/audio-2.mp3");

$("#switch").click(function () {
  if (this.checked) {
    $(".switch").css("background", "#3F4E4F");
    $(".switch").css("transition", "2s");
    audio1.pause();
    audio2.pause();
    audio.play();
  } else {
    $(".switch").css("background", "#94b49f");
  }
});

$(".audio-1").click(function () {
  audio.pause();
  audio2.pause();
  audio1.play();
  $(".audio-1").css("color", "#816797");
  $(".audio-2").css("color", "#51557e");
});

$(".audio-2").click(function () {
  audio.pause();
  audio1.pause();
  audio2.play();
  $(".audio-2").css("color", "#816797");
  $(".audio-1").css("color", "#51557e");
});

$("#checkbox").click(function () {
  if (this.checked) {
    window.location.href = "index-2.html";
  }
});

let app = {
  colors: ["#FF874C", "#D8385E", "#FF4438", "#710252", "#FFB0A7"],

  instances: {},

  data: {
    sheet: [],
  },

  load: {
    sheet: () => {
      app.data.sheet = [
        {
          value: 200,
        },
        {
          value: 200,
        },
        {
          value: 200,
        },
      ];

      // Runs callback
      app.charts.initialize();
    },

    initialize: () => {
      app.load.sheet();
    },
  },

  charts: {
    clear: () => {
      for (let box in app.instances) {
        let instance = app.instances[box];

        console.log(instance);

        Composite.clear(instance.engine.world);
        Engine.clear(instance.engine);
        Render.stop(instance.render);
        Runner.stop(instance.runner);

        instance.render.canvas.remove();
        instance.render.canvas = null;
        instance.render.context = null;
        instance.render.textures = {};
      }
    },

    ballbars: {
      initialize: (box) => {
        let parent = document.querySelector(box);

        let width = parent.offsetWidth;
        let height = parent.offsetHeight;

        // Initializes object to house all instances
        let instance = (app.instances[box] = {});

        // Creates canvas
        instance.canvas = document.createElement("canvas");
        instance.canvas.style.position = "absolute"; // makes canvas be rendered on top of unbounce’s overlay
        parent.appendChild(instance.canvas);

        // Create engine
        instance.engine = Engine.create();

        // Creates renderer
        instance.render = Render.create({
          canvas: instance.canvas,
          engine: instance.engine,
          options: {
            width: width,
            height: height,
            wireframes: false,
            background: "transparent",
            pixelRatio: "auto", // Makes it crisp on retina
          },
        });

        // Creates walls
        let entries = app.data.sheet.length;
        let thickness = (width * 12) / 100;
        let gap = (width - (entries + 1) * thickness) / entries;
        let walls = Composites.stack(
          0,
          height * -15,
          entries + 1,
          1,
          gap,
          0,
          function (x, y) {
            return Bodies.rectangle(x, y, thickness, height * 10, {
              isStatic: true,
              render: {
                fillStyle: "transparent",
              },
            });
          }
        );

        // Creates ground
        let ground = Bodies.rectangle(
          (width * 1) / 3,
          height - thickness / 5,
          width,
          thickness,
          {
            isStatic: true,
            render: {
              fillStyle: "transparent",
            },
          }
        );

        Composite.add(instance.engine.world, [ground, walls]);

        // Creates balls
        for (const [index, entry] of app.data.sheet.entries()) {
          let radius = (width * 2.1) / 100;
          let emitter = thickness * (index + 1) + gap * index + gap / 2;
          let amount = parseInt(entry.value);

          for (let i = 0; i < amount; i++) {
            setTimeout(() => {
              let ball = Bodies.circle(
                emitter * Common.random(0.95, 1.05),
                radius * -1,
                radius,
                {
                  restitution: 0,
                  friction: 1,
                  slop: 0,
                  frictionStatic: 1,
                  render: {
                    //fillStyle : entry.color,
                    fillStyle:
                      app.colors[Math.floor(Math.random() * app.colors.length)],
                  },
                }
              );

              // Adds balls to world
              Composite.add(instance.engine.world, [ball]);
            }, i * 90);
          }
        }

        //Adds mouse control
        let mouse = Mouse.create(instance.render.canvas);
        let mouseConstraint = MouseConstraint.create(instance.engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false,
            },
          },
        });

        Composite.add(instance.engine.world, mouseConstraint);

        // Keeps mouse in sync with rendering
        instance.render.mouse = mouse;

        // Runs renderer
        Render.run(instance.render);

        // Creates runner
        instance.runner = Runner.create();

        // Runs engine
        Runner.run(instance.runner, instance.engine);
      },
    },

    initialize: () => {
      console.log(app.options.charts);

      for (let chart of app.options.charts) {
        let box = chart[0];
        let type = chart[1];

        // Creates each chart
        app.charts[type].initialize(box);
      }
    },
  },

  events: {
    resize: () => {
      window.addEventListener("resize", () => {
        // Sets width in which desktop and mobile versions are switched
        let threshold = 600;

        // Initializes width when resize occurs for the first time
        if (app.data.width === undefined) app.data.width = window.innerWidth;

        // Creates aliases
        let previous = app.data.width;
        let current = window.innerWidth;

        if (
          (current <= threshold && previous > threshold) ||
          (current > threshold && previous <= threshold)
        ) {
          // Handles switch between desktop and mobile versions

          // Clears all charts
          app.charts.clear();

          // Draws all charts again
          app.charts.initialize();
        }

        // Updates width
        app.data.width = window.innerWidth;
      });
    },

    initialize: () => {
      app.events.resize();
    },
  },

  initialize: (options) => {
    // Creates module aliases
    window.Engine = Matter.Engine;
    window.Render = Matter.Render;
    window.Runner = Matter.Runner;
    window.Bodies = Matter.Bodies;
    window.Composite = Matter.Composite;
    window.Composites = Matter.Composites;
    window.Mouse = Matter.Mouse;
    window.MouseConstraint = Matter.MouseConstraint;
    window.Common = Matter.Common;

    // Sets options
    app.options = options;

    // Loads dependencies
    app.load.initialize();

    // Attaches events
    app.events.initialize();
  },
};

let options = {
  charts: [["figure", "ballbars"]],
};

app.initialize(options);
