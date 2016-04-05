OS.S.defaultStep = 1 / 120;
OS.S.pixelScale = 4;
OS.S.SetCamera(64 * OS.S.pixelScale, 64 * OS.S.pixelScale);

function start()
{
    OS.AddScript("loadControls.js");
    OS.AddScript("loadGamemanager.js");
    OS.AddScript("loadPrefabs.js");
    OS.AddScript("loadRooms.js");
}
