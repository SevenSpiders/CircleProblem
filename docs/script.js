document.getElementById('numberInput').addEventListener('change', generateCircle);
document.getElementById('shiftInput').addEventListener('change', generateCircle);
document.getElementById('sortButton').addEventListener('click', sortPointers);
document.getElementById('randomizeButton').addEventListener('click', randomizePointers);
document.getElementById('checkBoxUnique').addEventListener('change', updateUniqueness);


let numNodes = 3;
let pointers = []
let pointersAreUnique = true;


function generateCircle() {
    const canvas = document.getElementById('circleCanvas');
    const ctx = canvas.getContext('2d');
    numNodes = parseInt(document.getElementById('numberInput').value, 10);
    const shift = parseInt(document.getElementById('shiftInput').value, 0);
    
    // Resize the canvas
    const size = 500;
    canvas.width = size;
    canvas.height = size;

    // Center and radius for the circle
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2.5;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate positions of the numbers
    const positions = [];
    for (let i = 0; i < numNodes; i++) {
        const angle = (2 * Math.PI * i) / numNodes;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.push({ x, y });
        ctx.fillText(i + 1, x - 5, y + 5);
    }

    // Generate random loops
    const loops = [];
    if (pointers.length != numNodes) {
        pointers = generateArray(numNodes);
    }
    const colors = ['red', 'blue', 'green', 'purple', 'orange', 'brown'];

    
    for (let i = 0; i < numNodes; i++) {
        if (!loops.some(loop => loop.includes(i))) {
            let loop = [];
            let startingIndex = i;
            let pointer = i;
            let index = i;

            while (true) {
                pointer = shiftPointer(pointers[index], shift);
                if (loop.includes(pointer)) break;
                else {
                    loop.push(pointer);
                    index = pointer;
                }                
                if (loop.length > numNodes) {
                    console.log("fail");
                    break;
                }
            }

            loops.push(loop);
        }
    }

    updateLoopInfo(loops);

    // Draw arrows
    loops.forEach((loop, index) => {
        const color = colors[index % colors.length];
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        loop.forEach((num, idx) => {
            const nextNum = loop[(idx + 1) % loop.length];
            const startPos = positions[num];
            const endPos = positions[nextNum];

            drawArrow(ctx, startPos.x, startPos.y, endPos.x, endPos.y);
        });
    });
}

function generateArray(n) {
    const array = [];
    for (let i = 0; i < numNodes; i++) {
        array.push(i);
    }
    return array;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}


function shiftPointer(pointer, s) {
    return (pointer + s) % numNodes;
}

function sortPointers() {
    pointers = generateArray(numNodes);
    generateCircle();
}


function randomizePointers() {
    if (pointersAreUnique) pointers = shuffleArray(generateArray(numNodes));
    else pointers = nonUniquePointers(numNodes);
    generateCircle();
}

function nonUniquePointers(n) {
    let array = []
    for (let i=0; i< n; i++) {
        array.push(Math.floor(Math.random() * n));
    }
    return array;
}

function updateUniqueness() {
    pointersAreUnique = this.checked;
    if (pointersAreUnique) sortPointers();
    else randomizePointers();
}



function copyAndSort(array) {
    const copiedArray = [...array];
    copiedArray.sort((a, b) => b.length - a.length);
    return copiedArray;
  }

function updateLoopInfo(loops) {
    const info = document.getElementById("loopInfo");
    text = "Loops: [";
    loops = copyAndSort(loops);
    loops.forEach(loop => {
        text += " "+loop.length;
    });
    info.innerText = text + " ]";
}

function drawArrow(ctx, fromX, fromY, toX, toY) {
    const headlen = 10; // length of arrow head
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.closePath();
    ctx.fill();
}

// Generate the initial circle
generateCircle();
