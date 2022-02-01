import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';


let geojsonlayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: './OEVK_alap_jav.geojson',
})
});
let x = new Map({
    target: 'map-container',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      geojsonlayer,
    
  ],
    overlays: [overlay],
    view: new View({
      center: ([2149201.0509001324, 5952841.644010644]),
      zoom: 8,
      maxZoom:15,
      minZoom:6,
      extent: [762958.7313602014,5310108.422259997,3501412.7172102197,6576731.688082888]
    })
  });
  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');

  const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  x.on('singleclick', function (evt) {
    const coordinate = evt.coordinate;
    const hdms = toStringHDMS(toLonLat(coordinate));
  
    content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
    overlay.setPosition(coordinate);
  });




/*var
    container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new Overlay({
  element: container,
  autoPan: true,
  offset: [+100, +100]
});
x.addOverlay(overlay);

x.on('click', function(evt){
  var feature = x.forEachFeatureAtPixel(evt.pixel,
    function(feature, layer) {
      return feature;
    });
  if (feature) {
      var geometry = feature.getGeometry();
      var coord = geometry.getCoordinates();
      
      var content = '<h3>' + feature.get('name') + '</h3>';
      content += '<h5>' + feature.get('description') + '</h5>';
      
      content_element.innerHTML = content;
      overlay.setPosition(coord);
      
      console.info(feature.getProperties());
  }
});
x.on('pointermove', function(e) {
  if (e.dragging) return;
     
  var pixel = x.getEventPixel(e.originalEvent);
  var hit = x.hasFeatureAtPixel(pixel);
  
  x.getTarget().style.cursor = hit ? 'pointer' : '';
});*/