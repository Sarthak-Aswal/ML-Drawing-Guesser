const canvas = document.getElementById("sketchPad");
const context = canvas.getContext('2d');
let isDrawing = false;
let paths = [];


const guess = document.getElementById("guessButton");


function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return [Math.round(e.clientX - rect.left), Math.round(e.clientY - rect.top)
  ];
}

function startDrawing(e) {
  isDrawing = true;
  const mouse = getMousePos(e);
  paths.push([mouse]);
}

function draw(e) {
  if (isDrawing) {

    const mouse = getMousePos(e);
    const lastPath = paths[paths.length - 1];
    lastPath.push(mouse);


    drawAllPaths();

  }

}
function stopDrawing() {
  isDrawing = false;
}
function redraw(path) {

  context.strokeStyle = 'black';
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(...path[0]);
  for (let i = 1; i < path.length; i++) {
    context.lineTo(...path[i]);
  }
  context.stroke();
}

function drawAllPaths() {
  for (const path of paths) {
    redraw(path);
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  paths = [];
}

function undo() {
  if (paths.length > 0) {
    paths.pop();
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawAllPaths();
  }
  else {
    return;
  };


}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearCanvas);

const undoButton = document.getElementById("undoButton");
undoButton.addEventListener("click", undo);

guess.addEventListener('click', startGuess);

function startGuess() {
  let neighbours = [];
  const drawing = ["car", "fish", "house", "tree", "bicycle", "guitar", "pencil", "clock"];
  const xandy = getXandY(paths.flat());
  const width = xandy.Xmax - xandy.Xmin;
  const height = xandy.Ymax - xandy.Ymin;
  const aspect = width / height;
  const neighbourCount = 5;
  //console.log("width= " + width + " height= " + height + " aspect= " + aspect);

  fetch('./final.json')
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < drawing.length; j++) {
          const point = data[i][drawing[j]];
          let x2 = point["width"];
          let y2 = point["height"];
          let z2 = point["aspect"];
          let distance = calculateDistance(x2, y2, z2, width, height, aspect);
          if (neighbours.length < neighbourCount) {
            neighbours.push([drawing[j], distance]);
          }
          else {

            for (let k = 0; k < neighbourCount; k++) {
              if (neighbours[k][1] > distance) {
                neighbours[k] = [drawing[j], distance];
                break;
              }
            }

          }



        }
      }


      console.log(neighbours);
      let answer = calculateMaxDrawing(neighbours);
      const welcomeMessage = document.getElementById("welcomeMessage");
      welcomeMessage.textContent = "Is it a " + answer + "?";
    })
    .catch(error => {
      console.error('Error ', error);
    });
}

function calculateMaxDrawing(neighbours) {

  const drawingCounts = {};


  for (let i = 0; i < neighbours.length; i++) {
    const drawing = neighbours[i][0];
    drawingCounts[drawing] = (drawingCounts[drawing] || 0) + 1;
  }


  let maxDrawing = null;
  let maxCount = 0;

  for (const drawing in drawingCounts) {
    if (drawingCounts[drawing] > maxCount) {
      maxDrawing = drawing;
      maxCount = drawingCounts[drawing];
    }
  }

  return maxDrawing;
}

function calculateDistance(x2, y2, z2, width, height, aspect) {
  let x = x2 - width;
  let y = y2 - height;
  let z = z2 - aspect;
  let distance = Math.sqrt(x * x + y * y + z * z);

  return distance;

}

function getXandY(path) {
  let maxX = path[0][0];
  let maxY = path[0][1];
  let minX = path[0][0];
  let minY = path[0][1];
  for (let i = 0; i < path.length; i++) {
    if (path[i][0] > maxX) {
      maxX = path[i][0];
    }
    if (path[i][0] < minX) {
      minX = path[i][0];
    }
    if (path[i][1] > maxY) {
      maxY = path[i][1];
    }
    if (path[i][1] < minY) {
      minY = path[i][1];
    }

  }
  return {
    Xmax: maxX,
    Ymax: maxY,
    Xmin: minX,
    Ymin: minY
  };
}
