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

  minZoom = getMinZoom(
    window.innerWidth * 0.9,
    window.innerHeight,
    imgWidth,
    imgHeight
  ); // Initial offset & scale

  function initializeMap(id) {
    map = L.map(id, {
      zoomSnap: ZOOM_SNAP,
      zoomControl: false,
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
      map.invalidateSize();
      // map.setMinZoom(minZoom);

      if (window.innerWidth < 476) {
        var southWest = map.unproject([0, windowHeight]);
        var northEast = map.unproject([windowWidth, 0]);
      } else {
        var southWest = map.unproject([-windowWidth * 0.5, windowHeight * 0.5]);
        var northEast = map.unproject([windowWidth * 0.5, -windowHeight * 0.5]);
      }
      var bounds = L.latLngBounds(southWest, northEast);

      var wantedZoom = map.getBoundsZoom(bounds, true);
      map.setMaxBounds(bounds);

      map.setMinZoom(wantedZoom);
      /* [0,0] in pointCoords */
      map.setView([80, -180], wantedZoom);
    }
  }

  initializeMap("map");

  window.addEventListener("resize", onResize);

  onResize();
}

function getMinZoom(wW, wH, imgW, imgH) {
  return Math.min(imgW / wW, imgH / wH);
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
