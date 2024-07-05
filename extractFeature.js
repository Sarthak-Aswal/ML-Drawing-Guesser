const fs = require('fs');
const { type } = require('os');
const path = require('path');
const drawings= ["car", "fish", "house", "tree", "bicycle", "guitar", "pencil", "clock"];
let finalData=[];

const inputDirectory = 'drawing-data/json'; // Replace with the path to your directory
const outputFile = 'aggregateData.json'; // Replace with the path where you want to save the aggregated data



fs.readdir(inputDirectory, (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }

    files.forEach((file) => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(inputDirectory, file);

            // Read the JSON file
            const jsonString = fs.readFileSync(filePath, 'utf-8');

            try {
                const data = JSON.parse(jsonString);
                let output={};
                for(const drawing of drawings){
                const drawingdata=data[drawing].flat();
                const maxAndMin=getXandY(drawingdata);
                const width=maxAndMin.Xmax-maxAndMin.Xmin;
                const height=maxAndMin.Ymax-maxAndMin.Ymin;
                 output[drawing]={
                    "width":width,
                    "height":height
                 }
                }
                finalData.push(output);
                
            } catch (jsonParseErr) {
                console.error(`Error parsing JSON in file ${file}:`, jsonParseErr);
            }
        }
    });

    // Write the aggregatedData to a new JSON file
    const aggregatedJsonString = JSON.stringify(finalData, null, 2);
    fs.writeFile(outputFile, aggregatedJsonString, 'utf-8', (writeErr) => {
        if (writeErr) {
            console.error(`Error writing aggregated file ${outputFile}:`, writeErr);
        } else {
            console.log(`Aggregated file ${outputFile} has been successfully created!`);
        }
    });
});

function getXandY(path){
    let maxX=path[0][0];
    let maxY=path[0][1];
    let minX=path[0][0];
    let minY=path[0][1];
    for(let i=0;i<path.length;i++){
        if(path[i][0]>maxX){
            maxX=path[i][0];
        }
        if(path[i][0]<minX){
            minX=path[i][0];
        }
        if(path[i][1]>maxY){
            maxY=path[i][1];
        }
        if(path[i][1]<minY){
            minY=path[i][1];
        }

    }
    return{
        Xmax:maxX,
        Ymax:maxY,
        Xmin:minX,
        Ymin:minY
    };
}
