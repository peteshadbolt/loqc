/*
   pete.shadbolt@gmail.com
   Keeps track of the mouse position in various reference frames, and handles events.
   TODO: Pretty hacky at the moment!
*/


function Mouse() {
    var self = this;
    self.pressed = false;
    self.wasClick = false;
    self.screenPos = {"x":0, "y":0};
    self.screenPosOld = {"x":0, "y":0};
    self.screenDelta = {"x":0, "y":0};
    self.worldPos = {"x":0, "y":0};
    self.worldPosOld = {"x":0, "y":0};
    self.worldDelta = {"x":0, "y":0};
    self.gridPos = {"x":0, "y":0};

    self.update = function (evt) {
        self.screenPosOld.x=self.screenPos.x; self.screenPosOld.y=self.screenPos.y;
        self.worldPosOld.x=self.worldPos.x; self.worldPosOld.y=self.worldPos.y;
        self.screenPos.x = evt.offsetX || (evt.pageX - gc.offsetLeft);
        self.screenPos.y = evt.offsetY || (evt.pageY - canvas.offsetTop);
        self.worldPos = camera.fromScreen(self.screenPos);
        self.gridPos = grid.inside(self.worldPos);
        self.screenDelta.x = self.screenPos.x - self.screenPosOld.x;
        self.screenDelta.y = self.screenPos.y - self.screenPosOld.y;
        self.worldDelta.x = self.worldPos.x - self.worldPosOld.x;
        self.worldDelta.y = self.worldPos.y - self.worldPosOld.y;
    }

    self.bind = function (evt) {
        gc.addEventListener("mousemove", self.onMove);
        gc.addEventListener("mousedown", self.onDown);
        gc.addEventListener("mouseup", self.onUp);
        gc.addEventListener("mousewheel", self.onScroll, false);
        gc.addEventListener('DOMMouseScroll', self.onScroll, false);
    }

    self.onMove = function (evt) {
        self.update(evt);
        editor.update();
        if (self.pressed){
            camera.translate(self.screenDelta);
            requestAnimationFrame(redraw);
            if (Math.abs(self.screenDelta.x)>1 || Math.abs(self.screenDelta.y)>1){self.wasClick=false;}
        }
    }

    self.onDown = function (evt) {
        self.update(evt);
        self.wasClick=true;
        self.pressed=true;
    }

    self.onUp = function (evt) {
        self.update(evt);
        self.pressed=false;
        if (self.wasClick) {editor.click(mouse.ax, mouse.ay);}
    }

    self.onScroll = function (evt) {
        self.update(evt);
        var delta = -evt.detail;
        camera.zoom(delta*.05);
        requestAnimationFrame(redraw);
        return false;
    }
}


