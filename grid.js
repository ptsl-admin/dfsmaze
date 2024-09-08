class Grid {

    // default values
    ROWS = 5;
    COLS = 5;
    WIDTH = 640;
    HEIGHT = 400;
    stack = [];    

    // maze generation constants
    MAZE_NOT_GENERATED = 0;
    MAZE_GENERATING = 1;
    MAZE_GENERATED = 2;
    mazeStatus = this.MAZE_NOT_GENERATED; // 0 means maze has not been generated yet, 1 means it is being generated and 2 means has already been generated

    // holds the list of cells
    cells = [];

    constructor(rows, cols, width, height) {
        
        this.ROWS = rows || this.ROWS;
        this.COLS = cols || this.COLS;

        this.WIDTH = width || this.WIDTH;
        this.HEIGHT = height || this.HEIGHT;

        // the calculatoins for row width and col width
        this.CELL_WIDTH = Math.floor(this.WIDTH/this.ROWS);
        this.CELL_HEIGHT = Math.floor(this.HEIGHT/this.COLS);

        /**
         * We now need to initialize cells 
        */
        for (var i=1; i<= this.ROWS; i++) {
            for (var j=1; j<= this.COLS; j++) {
                var cell = new Cell(this,i, j);
                this.cells.push(cell);
            }
        }
    }


    /**
     * Draw cells
     */
    draw (context) {
        this.cells.forEach(cell => {
            cell.draw(context);
        });
    }

    setCurrentCell(id){
        for(var i=0; i<this.cells.length; i++){
            this.cells[i].current = false;
        }
        this.cells[id].current = true;
    }

    /**
     * this function generates the maze with same DFS iterative algorithm as well as draws each step change on the canvas
     */
    updateMazeGenerationIterative() {
        
        if (this.mazeStatus == this.MAZE_GENERATED)
            return;

        if (this.mazeStatus == this.MAZE_NOT_GENERATED){

            // update the mazeStatus
            this.mazeStatus = this.MAZE_GENERATING;
            
            // Step 1: select random initial cell
            var id = Math.floor(Math.random() * this.cells.length);
            
            // and mark it has visited
            this.cells[id].visited = true; 
            this.setCurrentCell(id); 
            
            // push the random cell to the stack
            this.stack.push(this.cells[id]);
            
            console.log("Maze generation started...");
            return;
            
        }        

        
        if (this.stack.length <= 0) {
            // update the mazeStatus
            this.mazeStatus = this.MAZE_GENERATED;

            console.log("Maze generation completed...");
            return;
        }                                
        
        // get the current cell
        var current = this.stack.pop();            
        
        // get the neighbours
        var unvisitedNeighbourIDs = current.neighbours();
        
        if (unvisitedNeighbourIDs.length > 0) {

            var currCellID = current.getIndex();
            var randomCellID = unvisitedNeighbourIDs[Math.floor(Math.random()*unvisitedNeighbourIDs.length)];
            
            this.stack.push(this.cells[currCellID]);

            // break the walls
            this.breakWalls(currCellID, randomCellID);

            // mark the choosen (random) cell as visited
            this.cells[randomCellID].visited = true;
            this.stack.push(this.cells[randomCellID]);

            // set this randomCellID active
            this.setCurrentCell(randomCellID);
        }                            
                
    }


    /**
     * this function generates the maze
    */
    generateMazeIterative() {

        // 1 select random initial cell
        var id = Math.floor(Math.random() * this.cells.length);
        
        // and mark it has visited
        this.cells[id].visited = true;   
        
        // push the random cell to the stack
        this.stack.push(this.cells[id]);        
        
        while (this.stack.length > 0) {
            
            // get the current cell
            var current = this.stack.pop();            
            
            // get the neighbours
            var unvisitedNeighbourIDs = current.neighbours();
            
            if (unvisitedNeighbourIDs.length > 0) {

                var currCellID = current.getIndex(current.i, current.j);
                var randomCellID = unvisitedNeighbourIDs[Math.floor(Math.random()*unvisitedNeighbourIDs.length)];
                
                this.stack.push(this.cells[currCellID]);

                // break the walls
                this.breakWalls(currCellID, randomCellID);

                // mark the choosen (random) cell as visited
                this.cells[randomCellID].visited = true;
                this.stack.push(this.cells[randomCellID]);
            }                            
        }
    }

    /**
     * Breaks the wall between two neighbouring cells
     * @param {*} cellCurr the id of the current cell 
     * @param {*} cellNext id of the neighbouring cell or nextCell 
     */
    breakWalls (cellCurr, cellNext) {
        // remove wall between current cell and random cellID
        // in order to break the wall we check the difference between current and next cellID
        // if distance is +1
        if (cellCurr - cellNext == 1) {
            // break top wall of curr and bottom wall of random
            this.cells[cellCurr].walls.top = false;
            this.cells[cellNext].walls.bottom = false
        }

        if (cellCurr - cellNext == -1){
                // break bottom wall of curr and top wall of random
                this.cells[cellCurr].walls.bottom = false;
                this.cells[cellNext].walls.top = false                   
        }

        if (cellCurr - cellNext > 1) {
            // break left wall of current and right wall of random
            this.cells[cellCurr].walls.left = false;
            this.cells[cellNext].walls.right = false                      
        }

        if (cellCurr - cellNext < -1) {
            // break right wall of current and left wall of random
            this.cells[cellCurr].walls.right = false;
            this.cells[cellNext].walls.left = false                      
        }        
    }
}

/**
 * the inner class Cell 
 */
Cell = function(parent, i,j)  {
    this.parent = parent;
    this.i = i;
    this.j = j;

    // cell is by default not visited
    this.visited = false;

    // is cell current ?
    this.current = false;

    // the four walls of cell, exist or not
    this.walls = {top:true, left:true, bottom:true, right:true};

    // method to get unvisited neighbours
    this.neighbours = function() {
        var cellUP = this.getIndex(this.i-1,this.j);
        var cellDOWN = this.getIndex(this.i+1,this.j);
        var cellLEFT = this.getIndex(this.i,this.j-1);
        var cellRIGHT = this.getIndex(this.i,this.j+1);

        var neigh = [];
        if (cellUP)
            if (!this.parent.cells[cellUP].visited)
                neigh.push(cellUP);

        if (cellLEFT)
            if(!this.parent.cells[cellLEFT].visited)
                neigh.push(cellLEFT);

        if (cellDOWN)
            if (!this.parent.cells[cellDOWN].visited)
                neigh.push(cellDOWN);

        if (cellRIGHT)
            if (!this.parent.cells[cellRIGHT].visited)
                neigh.push(cellRIGHT);

        return neigh;
    }

    // get index from row, col
    this.getIndex = function(i, j) {
        i = i || this.i;
        j = j || this.j;
        // 
        if (i<1 || j<1 || i>this.parent.COLS || j>this.parent.ROWS)
            return undefined;
        // index starts at 0
        // i-1 and j-1 becuase i, j start at 1
        return (j-1)  + (i-1) * this.parent.COLS;                
    }


    this.draw = function(context) {

        // highlight cell
        if (this.current){            
            context.fillStyle = "purple";
            context.fillRect(
                (this.i-1)*this.parent.CELL_WIDTH,
                (this.j-1)*this.parent.CELL_HEIGHT,
                this.parent.CELL_WIDTH ,
                this.parent.CELL_HEIGHT
            );
        }

        context.strokeStyle = "white";
        context.lineWidth = 2;
        
        // draw top line
        if (this.walls.top){
            context.beginPath();
            context.moveTo((this.i-1)*this.parent.CELL_WIDTH,(this.j-1)*this.parent.CELL_HEIGHT);
            context.lineTo(this.i*this.parent.CELL_WIDTH,(this.j-1)*this.parent.CELL_HEIGHT);
            context.stroke();
        }

        // draw left line
        if (this.walls.left){
            context.beginPath();
            context.moveTo((this.i-1)*this.parent.CELL_WIDTH,((this.j-1))*this.parent.CELL_HEIGHT);
            context.lineTo((this.i-1)*this.parent.CELL_WIDTH,(this.j)*this.parent.CELL_HEIGHT);
            context.stroke();   
        }   

        // draw bottom line
        if (this.walls.bottom){
            context.beginPath();
            context.moveTo((this.i-1)*this.parent.CELL_WIDTH,((this.j))*this.parent.CELL_HEIGHT);
            context.lineTo((this.i)*this.parent.CELL_WIDTH,(this.j)*this.parent.CELL_HEIGHT);
            context.stroke(); 
        }

        // draw left line
        if (this.walls.right){
            context.beginPath();
            context.moveTo((this.i)*this.parent.CELL_WIDTH,((this.j-1))*this.parent.CELL_HEIGHT);
            context.lineTo((this.i)*this.parent.CELL_WIDTH,(this.j)*this.parent.CELL_HEIGHT);
            context.stroke();     
        }
    }
}  