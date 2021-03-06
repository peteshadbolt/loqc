/*
   pete.shadbolt@gmail.com
   Draws the grid where bits and pieces of the circuit live
*/

function Grid() {
    var self=this;
    self.draw=function (ctx) {
        // Figure out the boundaries
        var topLeft = camera.fromScreen(new Vector(0,0));
        var bottomRight = camera.fromScreen(new Vector(ctx.canvas.width, ctx.canvas.height));

        var nx = Math.ceil(bottomRight.x - topLeft.x)+1;
        var ny = Math.ceil(bottomRight.y - topLeft.y)+1;
        var ox = Math.floor(topLeft.x);
        var oy = Math.floor(topLeft.y);

        // Draw the grid when we zoom in enough
        if (camera.z>50){
            ctx.lineWidth=0.01;
            ctx.strokeStyle= "#cccccc";
            ctx.beginPath();
            for (var i=ox; i<ox+nx; i++) { 
                ctx.moveTo(i, topLeft.y); 
                ctx.lineTo(i, bottomRight.y); 
            }
            for (var i=oy; i<oy+ny; i++) {
                ctx.moveTo(topLeft.x, i); 
                ctx.lineTo(bottomRight.x, i); 
            }
            ctx.stroke();
        }

        // Number the modes
        if (circuit.topLeft){
            for (var i=0; i <= circuit.nmodes; ++i) {
                fastNumber(ctx, i, circuit.topLeft.x-1, circuit.topLeft.y+i);
                fastNumber(ctx, i, circuit.bottomRight.x+1, circuit.topLeft.y+i);
            }
        }

    }


    // Find the cell containing a point in the world
    self.inside = function (worldPos) {
        return new Vector(Math.floor(worldPos.x), Math.floor(worldPos.y));
    }

    // Snap using knowledge of an object's width and height
    self.snap = function (worldPos, dimensions) {
        var w=dimensions.x;
        var h=dimensions.y;
        var temp=new Vector(worldPos.x+(1-w)/2, worldPos.y+(1-h)/2);
        return self.inside(temp);
    }
}

function drawGrid(ctx) {
}

