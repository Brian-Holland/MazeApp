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
        wireframes: true,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 40, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 40, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 40, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 40, height, {
        isStatic: true
    })
];
World.add(world, walls);

//Maze generation

//create array of 3
const grid = Array(3)
    //fill each index with false
    .fill(false)
    //fill each index with an array of 3 with false
    .map(() => Array(3).fill(false));
