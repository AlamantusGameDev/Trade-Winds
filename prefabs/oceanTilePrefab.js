var ani_ocean = OS.A.Add("Ocean", 256, 256, {columns: 10, speed: 1/120});

function oceanTilePrefab() {}

var pr_ocean = OS.P.Add("Ocean Particle", {
	imageSrc: "images/ocean_sheet.png",
	animations: [ani_ocean],
	depth: -100,	// Draw below everything.

	positionCheckStep: 30,
	positionCheckProgress: 30,
	doCheckPosition: false
});

pr_ocean.BeforeDo = function () {
	this.positionCheckProgress++;
	if (this.positionCheckProgress >= this.positionCheckStep) {
		this.positionCheckProgress = 0;
		doCheckPosition = true;
	}
}
pr_ocean.Do = function () {
	// Move around randomly.
}

pr_ocean.CheckPosition = function (checkX, checkY) {
	if (this.doCheckPosition) {
		// If it's completely off the screen, then update position.
		if ((Math.abs(this.x - checkX) > (OS.camera.width + this.xBound)) ||
			(Math.abs(this.y - checkY) > (OS.camera.height + this.yBound)))
		{
			switch (pr_ship.direction) {
				case 0:
					this.x = G.player.x + (OS.camera.width + this.xBound) + randomSmidge();
					this.y = G.player.y + randomSmidge();
					break;
				case 45:
					this.x = G.player.x + (OS.camera.width + this.xBound) + randomSmidge();
					this.y = G.player.y - (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 90:
					this.x = G.player.x + randomSmidge();
					this.y = G.player.y - (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 135:
					this.x = G.player.x - (OS.camera.width + this.xBound) + randomSmidge();
					this.y = G.player.y - (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 180:
					this.x = G.player.x - (OS.camera.width + this.xBound) + randomSmidge();
					this.y = G.player.y + randomSmidge();
					break;
				case 225:
					this.x = G.player.x - (OS.camera.width + this.xBound) + randomSmidge();
					this.y = G.player.y + (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 270:
					this.x = G.player.x + randomSmidge();
					this.y = G.player.y + (OS.camera.height + this.yBound) + randomSmidge();
					break;
				case 315:
					this.x = G.player.x + (OS.camera.width + this.xBound) + randomSmidge();
					this.y = G.player.y + (OS.camera.height + this.yBound) + randomSmidge();
					break;
				default:
					console.log("No valid direction");
					break;
			}
		}

		this.doCheckPosition = false;
	}
}