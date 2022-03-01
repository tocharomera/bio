var processor = {};
var r1, r2, r3, r4;

var time;
$(document).ready(function () {
  processor.doLoad = function doLoad(screens) {
    var c2 = document.getElementById("canvas2");
    var ctx2 = c2.getContext("2d");
    var c3 = document.getElementById("canvas3");
    var ctx3 = c3.getContext("2d");
    let img2 = document.getElementById("img2");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var c1 = document.getElementById("canvas1");
    var ctx1 = c1.getContext("2d");
    let img1 = document.getElementById("img");
    var light = 0.49;
    var light2 = 0.39;

    r1 = light;
    r2 = light;
    r3 = light;
    r4 = light2;
    r5 = light2;
    r6 = light2;

    time = setTimeout(function () {
      if (screens <= 1) {
        sobel1();
      } else {
        sobel1();
        sobel2();
      }

      doLoad(screens);
    }, 1000 / 24);
    ctx1.drawImage(img1, 0, 0, c1.width, c1.height);
    var imageData = c1.toDataURL("image/jpeg");

    ctx3.drawImage(img2, 0, 0, c3.width, c3.height);
    var imageData2 = c3.toDataURL("image/jpeg");

    function sobel1() {
      imageData = ctx1.getImageData(0, 0, c1.width, c1.height);
      imageData = sobel(imageData);
      ctx1.putImageData(imageData, 0, 0);
      var data = c1.toDataURL("image/jpeg");
      img1.setAttribute("src", data);
    }
    function sobel2() {
      imageData2 = ctx3.getImageData(0, 0, c3.width, c3.height);
      imageData2 = sobel2nd(imageData2);
      ctx3.putImageData(imageData2, 0, 0);
      var data2 = c3.toDataURL("image/jpeg");
      img2.setAttribute("src", data2);
    }
  };
  ///////////////////////////////////////////////
  //  FROM : https://www.html5rocks.com/en/tutorials/canvas/imagefilters/#toc-convolution

  processor.grayscale = function grayscale(px) {
    var d = px.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      // CIE luminance for the RGB
      var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v;
    }

    return px;
  };

  processor.convoluteFloat32 = function (pixels, weights, opaque) {
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);

    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    var w = sw;
    var h = sh;
    var output = {
      width: w,
      height: h,
      data: new Float32Array(w * h * 4),
    };
    var dst = output.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y * w + x) * 4;
        var r = 0,
          g = 0,
          b = 0,
          a = 0;
        for (var cy = 0; cy < side; cy++) {
          for (var cx = 0; cx < side; cx++) {
            var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
            var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
            var srcOff = (scy * sw + scx) * 4;
            var wt = weights[cy * side + cx];
            r += src[srcOff] * wt;
            g += src[srcOff + 1] * wt;
            b += src[srcOff + 2] * wt;
            a += src[srcOff + 3] * wt;
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        dst[dstOff + 3] = a + alphaFac * (255 - a);
      }
    }
    return output;
  };
  processor.tmpCanvas = document.createElement("canvas");
  processor.tmpCtx = processor.tmpCanvas.getContext("2d");

  processor.createImageData = function (w, h) {
    return this.tmpCtx.createImageData(w, h);
  };
  processor.identity = function (pixels, args) {
    var output = processor.createImageData(pixels.width, pixels.height);
    var dst = output.data;
    var d = pixels.data;
    for (var i = 0; i < d.length; i++) {
      dst[i] = d[i];
    }
    return output;
  };
  //https://github.com/kig/canvasfilters/blob/master/filters.js
  var sobel2nd = function sobel(px2) {
    this.px = px2;

    var vertical = processor.convoluteFloat32(px, [
      -r4,
      -r5,
      -r6,
      0,
      0,
      0,
      r4,
      r5,
      r6,
    ]);
    var horizontal = processor.convoluteFloat32(px, [
      -r6,
      0,
      r6,
      -r5,
      0,
      r5,
      -r4,
      0,
      r4,
    ]);
    var id = processor.createImageData(vertical.width, vertical.height);
    for (var i = 0; i < id.data.length; i += 4) {
      var v = Math.abs(vertical.data[i]);
      id.data[i] = v;
      var h = Math.abs(horizontal.data[i]);
      id.data[i + 1] = h;
      id.data[i + 2] = (v + h) / 4;
      id.data[i + 3] = 255;
    }

    return id;
  };

  var sobel = function sobel(px) {
    px = processor.grayscale(px);
    var vertical = processor.convoluteFloat32(px, [
      -r1,
      -r2,
      -r3,
      0,
      0,
      0,
      r1,
      r2,
      r3,
    ]);
    var horizontal = processor.convoluteFloat32(px, [
      -r3,
      0,
      r3,
      -r2,
      0,
      r2,
      -r1,
      0,
      r1,
    ]);
    var id = processor.createImageData(vertical.width, vertical.height);
    for (var i = 0; i < id.data.length; i += 4) {
      var v = Math.abs(vertical.data[i]);
      id.data[i] = v;
      var h = Math.abs(horizontal.data[i]);
      id.data[i + 1] = h;
      id.data[i + 2] = (v + h) / 4;
      id.data[i + 3] = 255;
    }

    return id;
  };
  var screens = 2;
  if (window.innerWidth < 476) screens = 1;
  processor.doLoad(screens);
});
