// original width of image
var imgWidth;
var imgHeight;
let windowHeight;
let windowWidth;

var maxBlur = 40,
  maxTileSize = 256,
  maxDispFactor = 2560,
  maxZoom = 8;

var minZoom;
var MAX_ZOOM = 6;
const ZOOM_SNAP = 0.25;

function imageWithLeaflet(imgWidth, imgHeight) {
  var map;
  var rc;

  minZoom = getMinZoom(
    window.innerWidth,
    window.innerHeight,
    imgWidth,
    imgHeight
  ); // Initial offset & scale

  function initializeMap(id) {
    map = L.map(id, {
      zoomSnap: ZOOM_SNAP,
      zoomControl: false,
      minZoom: minZoom,
    });
    map.addControl(L.control.zoom({ position: "bottomright" }));

    // the tile layer containing the image generated with `gdal2tiles --leaflet -p raster -w none <img> tiles`
    L.tileLayer("./tiles/{z}/{x}/{y}.png", {
      noWrap: true,
      attribution: "Mario Romera 2020",
    }).addTo(map);

    map.setMaxZoom(MAX_ZOOM);
  }

  function onResize() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    const mapDiv = document.querySelector("#map");

    mapDiv.style.width = `${windowWidth}px`;
    mapDiv.style.height = `${windowHeight}px`;

    if (map) {
      map.setMinZoom(minZoom);

      if (window.innerWidth > 476)
        map.setView([82.90411186468847, -146.5796799296965], 3.75);
      if (window.innerWidth > 976)
        map.setView([83.64176234718275, -137.06131590142647], 4.25);
      else map.setView([30.1993751412958, -114.3598927354169], 2);

      map.on("click", function (ev) {
        var latlng = map.mouseEventToLatLng(ev.originalEvent);
        console.log(latlng.lat + ", " + latlng.lng, map.getZoom());
      });
    }
  }

  initializeMap("map");

  window.addEventListener("resize", onResize);

  onResize();
}

function getMinZoom(wW, wH, imgW, imgH) {
  return Math.min(wW / imgW, wH / imgH);
}

imgWidth = 2480;
imgHeight = 7016;

imageWithLeaflet(imgWidth, imgHeight);

function getImageSize(image) {
  return new Promise(function (resolve, reject) {
    try {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = image;
    } catch (e) {
      reject(e);
    }
  });
}
