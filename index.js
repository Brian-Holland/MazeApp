const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    //where the canvas will be drawn
    element: document.body,
    engine: engine,
    //dimensions of the canvas
    options: {
        width: 800,
        height: 600
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// pos x, pos y, width, height, options obj
const shape = Bodies.rectangle(200, 200, 50, 50, {
    isStatic: true
});
World.add(world, shape);
