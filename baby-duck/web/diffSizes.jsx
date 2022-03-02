/**
* Remixer: @herkulano (http://www.herkulano.com)
* Thanks to: Niels Bosma (niels.bosma@motorola.com)
*/

var folder = Folder.selectDialog();
var document = app.activeDocument;

if (document && folder) {
$.writeln(document.width);
saveToRes (16, "ldpi");
saveToRes(32, "mdpi");
saveToRes(1280, "hdpi");
saveToRes(128, "xhdpi");
//saveToRes(300, "xxhdpi");
//saveToRes(400, "xxxhdpi");
}

function saveToRes(scaleTo, resFolderName) {


    scaleTo = scaleTo/document.width*100.0;
     $.writeln(scaleTo);
     $.writeln((scaleTo*document.width)/100.0);
    //return;

var i, layer,
    file, options,
    resFolder;

resFolder = new Folder(folder.fsName + "/drawable-" + resFolderName);

if (!resFolder.exists) {
    resFolder.create();
}

for (i = document.layers.length - 1; i >= 0; i--) {
    layer = document.layers[i];
    if (!layer.locked && layer.name.indexOf("!") === -1) {
        hideAllLayers();
        layer.visible = true;

        file = new File(resFolder.fsName+ "/" + layer.name + ".png");
        $.writeln(resFolder.fsName);
        $.writeln(file.fsName);
        $.writeln(layer.name);

        options = new ExportOptionsPNG();
        options.antiAliasing = true;
        options.transparency = true;
        options.artBoardClipping = true;
        options.verticalScale = scaleTo;
        options.horizontalScale = scaleTo;

        document.exportFile(file, ExportType.PNG24, options);
    }
}
}

function hideAllLayers() {
var i, layer;

for (i = document.layers.length - 1; i >= 0; i--) {
    layer = document.layers[i];
    if (!layer.locked && layer.name.indexOf("!") === -1) {
        layer.visible = false;
    }
}
}
