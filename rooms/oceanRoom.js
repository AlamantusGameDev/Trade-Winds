function oceanRoom () {
    if (Oversimplified.DEBUG.showMessages) console.log("Ran oceanRoom()");
}

rm_Ocean.waveTimer = Math.round(Math.randomRange(30, 150));
rm_Ocean.clockTimerCount = 1;   // Set it to 1 so it doesn't check for player illness immediately!

rm_Ocean.DoFirst = function () {
    mus_title.Play();

    // G.player and G.oceanParticle are created in loadPrefabs.js

    rm_Ocean.GenerateMap();

    console.log("player xBound: " + G.player.xBound);
    G.player.x = (this.squareSize * (this.squaresX / 2)) - (this.squareSize / 2) - G.player.xBound;
    G.player.y = (this.squareSize * (this.squaresY / 2));
    // console.log(G.player.name + " created at " + G.player.x + ", " + G.player.y);

    G.oceanParticle.x = G.player.x + randomSmidge();
    G.oceanParticle.y = G.player.y + randomSmidge();

    // Reset camera whenever room starts
    OS.SetCamera({
        x: G.player.x - (OS.camera.width / 2),
        y: G.player.y - (OS.camera.height / 2),
        objectToFollow: G.player
    });

    this.mapLeftTrigger = OS.camera.hBorder;
    this.mapLeftTriggerTarget = this.width - (OS.camera.width - OS.camera.hBorder);
    this.mapRightTrigger = this.width - OS.camera.hBorder;
    this.mapRightTriggerTarget = OS.camera.width - OS.camera.hBorder;
    this.mapUpTrigger = OS.camera.vBorder;
    this.mapUpTriggerTarget = this.height - (OS.camera.height - OS.camera.vBorder);
    this.mapDownTrigger = this.height - OS.camera.vBorder;
    this.mapDownTriggerTarget = OS.camera.height - OS.camera.vBorder;

    // G.economy.UpdateEconomy();
}
rm_Ocean.Do = function () {
    if (G.gameStarted) {
        if (guiControl && guiControl.inventory && guiControl.map && guiControl.trade) {   // Force it to wait until loaded.
            if (!guiControl.inventory.show && !guiControl.map.show && !guiControl.trade.show) {
                // Move G.oceanParticle around based on player's movement.
                if (G.oceanParticle.CheckPosition) G.oceanParticle.CheckPosition(G.player.x, G.player.y, G.player.direction);

                if (ct_cancel().down) {
                    snd_select.Play();
                    guiControl.inventory.activateDelay = 5;
                    guiControl.inventory.show = true;
                }
                if (ct_m.down) {
                    snd_select.Play();
                    guiControl.map.activateDelay = 5;
                    guiControl.map.show = true;
                }
            }
        }

        this.RunClock();
    }
    // Make waves even if the game hasn't started, but not when on trade screen.
    if (guiControl && guiControl.trade) {   // Force it to wait until loaded.
        if (!guiControl.trade.show) {
            this.waveTimer--;
            if (this.waveTimer <= 0) {
                var wave = this.AddObject(OS.P["Wave Particle"]);
                wave.x = G.player.x + (randomSmidge() * 4);
                wave.y = G.player.y + (randomSmidge() * 4);

                this.waveTimer = Math.round(Math.randomRange(30, 150));
            }
        }
    }
}

rm_Ocean.DrawAbove = function () {
    if (G.gameStarted) {
        this.DrawNightDarkness();

        guiControl.drawSpeedGauge();

        guiControl.drawEnergyBar();

        guiControl.drawClock();

        guiControl.inventory.Draw();
        guiControl.map.Draw();
        guiControl.trade.Draw();
    } else {
        guiControl.title.Draw();
    }
}

rm_Ocean.DoLast = function () {
    // Clear Objects on room exit. This is best practice unless you need persistent objects.
    //rm_Ocean.objects = {};
}

rm_Ocean.RunClock = function () {
    if (guiControl.trade && !guiControl.trade.show) {   // Only advance time when not trading.
        rm_Ocean.clockTimerCount++;
        if (rm_Ocean.clockTimerCount > rm_Ocean.clockTimerCutoff) {
            rm_Ocean.clockTimerCount = 0;
            // Play New_Day sound.
            G.economy.UpdateEconomy();

            for (var i = 0; i < G.map.length; i++) {
                G.map[i].island.NewDay();
            }

            G.SaveGame();
        }

        if (rm_Ocean.clockTimerCount == 0 ||
            rm_Ocean.clockTimerCount == Math.round(rm_Ocean.clockTimerCutoff * 0.33) ||
            rm_Ocean.clockTimerCount == Math.round(rm_Ocean.clockTimerCutoff * 0.66)) {
            G.player.CheckIllnessIncrease();
        }
    }
}

rm_Ocean.DrawNightDarkness = function () {
    var alphaFormula = (Math.sin((((this.clockTimerCount / (this.clockTimerCutoff * Math.PI)) * 10) * 1.5) - 2) - 0.4);
    if (alphaFormula < 0) alphaFormula = 0;
    
    if (alphaFormula > 0) {
        var saveGlobalAlpha = OS.context.globalAlpha;
        var tmp = Oversimplified.context.fillStyle;
        OS.context.globalAlpha = alphaFormula;
        Oversimplified.context.fillStyle = "#112189";
        Oversimplified.context.fillRect(0, 0, Oversimplified.camera.width, Oversimplified.camera.height);
        Oversimplified.context.fillStyle = tmp;
        Oversimplified.context.globalAlpha = saveGlobalAlpha;
    }
}

rm_Ocean.GenerateMap = function () {
	var xSquares = [25];
	var ySquares = [22];
	while (xSquares.length < this.numberOfIslands) {
		var randomNumber = Math.round(Math.randomRange(2, this.squaresX - 2));
		var found = false;
		for (var i = 0; i < xSquares.length; i++) {
			if (xSquares[i] - ((this.squaresX / this.numberOfIslands) / 2) < randomNumber && randomNumber < xSquares[i] + ((this.squaresX / this.numberOfIslands) / 2)) {
				found = true;
				break;
			}
		}
		if (!found) xSquares.push(randomNumber);
	}
	while (ySquares.length < this.numberOfIslands) {
		var randomNumber = Math.round(Math.randomRange(2, this.squaresY - 2));
		var found = false;
		for (var i = 0; i < ySquares.length; i++) {
			if (ySquares[i] - ((this.squaresY / this.numberOfIslands) / 2) < randomNumber && randomNumber < ySquares[i] + ((this.squaresY / this.numberOfIslands) / 2)) {
				found = true;
				break;
			}
		}
		if (!found) ySquares.push(randomNumber);
	}
	
	for (var i = 0; i < this.numberOfIslands; i++) {
		G.map[i] = {
			island: rm_Ocean.AddObject(OS.P["Island"], {
				x: this.squareSize * xSquares[i],
				y: this.squareSize * ySquares[i]
			}),
			drawX: xSquares[i],
			drawY: ySquares[i],
			drawWidth: 1,
			drawHeight: 1
		};
	}
}
