class Grid {

    // default values
    ROWS = 5;
    COLS = 5;
    WIDTH = 640;
    HEIGHT = 400;

    // holds the list of cells
    cells = [];

    constructor(rows, cols, width, height) {        
        
        this.rows = rows || this.ROWS;
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
        var cellUP = this.getIndex(this.i,this.j-1);
        var cellDOWN = this.getIndex(this.i,this.j+1);
        var cellLEFT = this.getIndex(this.i-1,this.j);
        var cellRIGHT = this.getIndex(this.i+1,this.j);

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
                (this.j-1)*this.parent.CELL_WIDTH,
                (this.i-1)*this.parent.CELL_HEIGHT,
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