jQuery(document).ready(()=>{
    /**
     * Initialize Canvas
     */    
    // now initiaize canvas and get 2D context
    canvas = jQuery("canvas")[0];
    context = this.canvas.getContext("2d");

    /** Initialize the grid */
    var grid = new Grid(20,20);
    canvas.width = grid.WIDTH;
    canvas.height = grid.HEIGHT;

    //grid.generateMazeIterative();
    
    /**
     * The Canvas GameLoop
     */
    function gameLoop(){
        // the updates
        grid.updateMazeGenerationIterative();

        // the drawings
        draw();

        // request next frame
        requestAnimationFrame(gameLoop);
    }

    /**
     * Invoke the gameLoop() once to get started
     */
    gameLoop();




    /**
     * THIS method invokes the draw method available in all objects as per the necessity
     */
    function draw() {

        // clearing the context
        context.clearRect(0,0,canvas.width, canvas.height);

        // draw canvas BG color
        context.fillStyle = 'black';
        context.fillRect(0,0,canvas.width, canvas.height);

        // draw cells
        grid.draw(this.context);
        
  

    }
});