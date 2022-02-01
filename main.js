let styles = {
  'Point': [new ol.style.Style({
      image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({
              color: [255, 255, 255, 0.3]
          }),
          stroke: new ol.style.Stroke({color: '#cb1d1d', width: 2})
      })
  })],
  'LineString': [new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: 'green',
          width: 1
      })
  })],
  'Polygon': [new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3
      }),
      fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)'
      })
  })],
  'Circle': [new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: 'red',
          width: 2
      }),
      fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0.2)'
      })
  })]
};

const container = document.getElementById('popup');
const content_element = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

let geojson_layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: './file.geojson',
}),style: styleFunction
});

const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

let x = new ol.Map({
    target: 'map-container',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      geojson_layer    
  ],
    overlays: [overlay],
    view: new ol.View({
      center: ([2119201.0509001324, 6020841.644010644]),
      zoom: 11,
      maxZoom:16,
      minZoom:10,
      extent: [762958.7313602014,5310108.422259997,3501412.7172102197,6576731.688082888]
    })
  });

var styleFunction = function(feature, resolution) {
    return styles[feature.getGeometry().getType()];
};

var fullscreen = new ol.control.FullScreen();
x.addControl(fullscreen);
  
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

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
  
  x.getViewport().style.cursor = hit ? 'pointer' : '';
});



