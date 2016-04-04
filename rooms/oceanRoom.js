function oceanRoom () {
    // When room is loaded, explicitly set room to rm_Ocean, just in case "Default" doesn't work/is loaded too slowly
    OS.SetRoom(rm_Ocean);
}

rm_Ocean.DoFirst = function () {
    //Hide cursor when playing (only use if masking the cursor with another object)
    //OS.canvas.style.cursor = "none";
    
    // Create objects on room start. This is best practice unless you need persistent objects.
    Game.player = this.AddObject(OS.P["UFO"]);
    Game.ball = this.AddObject(OS.P["Ball"]);
    Game.cowboys = Math.floor(RandomRange(5, 50));
    for (var i = 0; i < Game.cowboys; i++) {
        this.AddObject(OS.P["Cowboy"]);
    }
}
rm_Ocean.Do = function () {
    if (Game.cowboys <= 0) {
        OS.SetRoom(rm_Ocean);
    }
}
rm_Ocean.DrawAbove = function () {
    // Draw the number of cowboys remaining
    if (Game.ball !== null) {
        OS.context.font = "18px Impact";
        OS.context.fillText(Game.cowboys, 15, 30);
    }
}
rm_Ocean.DoLast = function () {
    // Clear Objects on room exit. This is best practice unless you need persistent objects.
    rm_Ocean.objects = {};
}