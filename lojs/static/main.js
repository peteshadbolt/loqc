/*
   pete.shadbolt@gmail.com
   This is the main JS file which runs the constructer/simulator
*/

var gc, gd;
var camera, renderer, grid, circuit, mouse, adjuster, constructer, editor;
var instructionBox;

// Run on startup
window.onload=main;

function Renderer(ctx, canv) {
   var self=this; 
   self.ctx=ctx;
   self.canvas=canv;
   self.change=false;

   self.loop=function () {
        setInterval(self.redraw, 20);
   }

   self.requestDraw=function () {
       requestAnimationFrame(self.redraw);
   }

   self.redraw= function () {
        if (!self.change){return;}
        self.change=false;
        //console.log("redraw");

        // Clear canvas
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        // Transform into camera-space
        self.ctx.save();
        camera.contextToWorld(self.ctx);

        // Draw the grid, circuit, constructer
        grid.draw(self.ctx);
        editor.draw(self.ctx);
        circuit.draw(self.ctx);

        // Back to screen-space
        self.ctx.restore();

        //self.ctx.drawImage(gCouplerCache, 0, 0);
    }

    self.needFrame=function () {
        self.change=true;
    }

}

function resize() {
    gc.width  = Math.floor(window.innerWidth);
    gc.height = Math.floor(window.innerHeight);
    renderer.needFrame();
}

function construct() {
    document.getElementById("construct").className="hi";
    document.getElementById("adjust").className="nothing";
    adjuster.moving=undefined;
    editor=constructer;
    renderer.needFrame();
}

function adjust() {
    document.getElementById("adjust").className="hi";
    document.getElementById("construct").className="nothing";
    editor=adjuster;
    renderer.needFrame();
}

// Change mode by pressing keys
function bindKeys() {
    window.addEventListener('keydown', function (evt) {
        if (evt.keyCode == 9) {
           if (editor.label=="constructer"){ adjust(); } else { construct(); }
           evt.preventDefault();
           return false;
        }
    }, true);
}

function recievedFile(evt) {
    var text = evt.target.result;
    var j = JSON.parse(text);
    circuit.fromJSON(j);
}

function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var fr = new FileReader();
    fr.onload = recievedFile;
    fr.readAsText(file);
}


function main() {
    // Set up the drawing environment an-d fit to window
    gc=document.getElementById('canvas');
    instructionBox = document.getElementById('instructions');
    //instructionBox.setAttribute('style', 'display:none');
    document.getElementById('fileinput').addEventListener('change', handleFileSelect, false);


    gd=gc.getContext('2d');

    // Create a grid, camera, and mouse
    grid=new Grid();
    camera=new Camera();
    mouse=new Mouse();
    renderer=new Renderer(gd, gc);
    mouse.bind(gd);
    bindKeys();
    makeNumberCache();
    //makeCouplerCache();

    // Create the circuit, simulator, and constructer
    circuit = new Circuit();
    simulator = new Simulator(circuit);
    constructer = new Constructer(circuit);
    adjuster = new Adjuster(circuit);
    construct();


    // Update when the filter changes
    $('#filter_input').on("input",simulator.update);

    // Away we go
    window.onresize=resize;
    resize();
    camera.center(gc);
    camera.loop();
    renderer.loop();
    simulator.update();
}
