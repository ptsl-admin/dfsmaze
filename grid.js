class Grid {

    // default values
    ROWS = 10;
    COLS = 10;
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
                var cell = new Cell(i, j);
                this.cells.push(cell);
            }
        }        
    }


    /**
     * Draw cells
     */
    draw (context) {
        this.cells.forEach(cell => {
            cell.draw(context, this.CELL_WIDTH, this.CELL_HEIGHT);
        });
    }
}

/**
 * the inner class Cell 
 */
Cell = function(i,j)  {
                
    this.i = i;
    this.j = j;

    // cell is by default not visited
    this.visited = false;

    // the four walls of cell, exist or not
    this.walls = {top:true, left:true, bottom:true, right:true};


    this.draw = function(context, CELL_WIDTH, CELL_HEIGHT) {

        context.strokeStyle = "white";
        context.lineWidth = 2;

        // highlight cell

        
        // draw top line
        if (this.walls.top){
            context.beginPath();
            context.moveTo((this.i-1)*CELL_WIDTH,(this.j-1)*CELL_HEIGHT);
            context.lineTo(this.i*CELL_WIDTH,(this.j-1)*CELL_HEIGHT);
            context.stroke();
        }

        // draw left line
        if (this.walls.left){
            context.beginPath();
            context.moveTo((this.i-1)*CELL_WIDTH,((this.j-1))*CELL_HEIGHT);
            context.lineTo((this.i-1)*CELL_WIDTH,(this.j)*CELL_HEIGHT);
            context.stroke();   
        }   

        // draw bottom line
        if (this.walls.bottom){
            context.beginPath();
            context.moveTo((this.i-1)*CELL_WIDTH,((this.j))*CELL_HEIGHT);
            context.lineTo((this.i)*CELL_WIDTH,(this.j)*CELL_HEIGHT);
            context.stroke(); 
        }

        // draw left line
        if (this.walls.right){
            context.beginPath();
            context.moveTo((this.i)*CELL_WIDTH,((this.j-1))*CELL_HEIGHT);
            context.lineTo((this.i)*CELL_WIDTH,(this.j)*CELL_HEIGHT);
            context.stroke();     
        }
    }
}    

