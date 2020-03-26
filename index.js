const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cells = 5;
const height = 600;
const width = 600;

const unitLength = width / cells;

const engine = Engine.create();
engine.world.gravity.y = 0;
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
    Bodies.rectangle(width / 2, 0, width, 2, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 2, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 2, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 2, height, {
        isStatic: true
    })
];
World.add(world, walls);

//Maze generation

const shuffle = arr => {
    let counter = arr.length;

    while (counter > 0) {
        //create random index inside array
        const index = Math.floor(Math.random() * counter);
        //decrease counter
        counter--;
        //swap neighbors in array
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
};

//create array of 3
const grid = Array(cells)
    //fill each index with null
    .fill(null)
    //fill each index with an array of 3 with false
    .map(() => Array(cells).fill(false));

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
    //if visited cell at [row,column], return
    if (grid[row][column]) {
        return;
    }
    //mark cell as visited
    grid[row][column] = true;
    //assemble random-ordered list of neighbors
    const neighbors = shuffle([
        //top
        [row - 1, column, "up"],
        //right
        [row, column + 1, "right"],
        //bottom
        [row + 1, column, "down"],
        //left
        [row, column - 1, "left"]
    ]);

    //for each neighbors
    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;
        //see if neighbor is out of bounds
        if (
            nextRow < 0 ||
            nextRow >= cells ||
            nextColumn < 0 ||
            nextColumn >= cells
        ) {
            continue;
        }
        //check if visted neighbor, continue to next neighbor
        if (grid[nextRow][nextColumn]) {
            continue;
        }
        //remove wall from either horiz or vert
        if (direction === "left") {
            verticals[row][column - 1] = true;
        } else if (direction === "right") {
            verticals[row][column] = true;
        } else if (direction === "up") {
            horizontals[row - 1][column] = true;
        } else if (direction === "down") {
            horizontals[row][column] = true;
        }
        stepThroughCell(nextRow, nextColumn);
    }
};

stepThroughCell(startRow, startColumn);

//create horizontal walls
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            10,
            {
                label: "wall",
                isStatic: true
            }
        );
        World.add(world, wall);
    });
});

//create vertical walls
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            10,
            unitLength,
            { label: "wall", isStatic: true }
        );
        World.add(world, wall);
    });
});

//create goal to reach
const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * 0.7,
    unitLength * 0.7,
    {
        label: "goal",
        isStatic: true
    }
);
World.add(world, goal);

//create ball for game
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 4, {
    label: "ball"
});
World.add(world, ball);

const { x, y } = ball.velocity;

document.addEventListener("keydown", event => {
    if (event.keyCode === 87) {
        Body.setVelocity(ball, { x, y: y - 5 });
    }
    if (event.keyCode === 68) {
        Body.setVelocity(ball, { x: x + 5, y });
    }
    if (event.keyCode === 83) {
        Body.setVelocity(ball, { x, y: y + 5 });
    }
    if (event.keyCode === 65) {
        Body.setVelocity(ball, { x: x - 5, y });
    }
});

//win condition

Events.on(engine, "collisionStart", event => {
    event.pairs.forEach(collision => {
        const labels = ["ball", "goal"];
        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ) {
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === "wall") {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});
