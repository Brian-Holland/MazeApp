const { Engine, Render, Runner, World, Bodies } = Matter;

const height = 600;
const width = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    //where the canvas will be drawn
    element: document.body,
    engine: engine,
    //dimensions of the canvas
    options: {
        wireframes: false,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
    Bodies.rectangle(400, 0, 800, 40, {
        isStatic: true
    }),
    Bodies.rectangle(400, 600, 800, 40, {
        isStatic: true
    }),
    Bodies.rectangle(0, 300, 40, 600, {
        isStatic: true
    }),
    Bodies.rectangle(800, 300, 40, 600, {
        isStatic: true
    })
];
World.add(world, walls);
