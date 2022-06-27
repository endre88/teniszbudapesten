const styles = {
  'Point': [new ol.style.Style({
     /* image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
              color: [255, 255, 255, 0.8]
          }),
          stroke: new ol.style.Stroke({color: '#cb1d1d', width: 1})
      })*/
      image: new ol.style.Icon({
          fill:'#1111ff',
          anchor: [1, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          scale: 0.019,
          src: '310075.svg'
    })
  })],
  'LineString': [new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: '#fff',
          width: 41
      })
  })],
  'Polygon': [new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [4],
          width: 4
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
          color: 'rgba(255,0,0,0.8)'
      })
  })]
};

const container = document.getElementById('popup');
const content_element = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const styleFunction = function(feature, resolution) {
  if (feature.get('name') != null) { //ha null a név  mező tehát még nincs kitöltve akkor nem töltődik be a pont
  return styles[feature.getGeometry().getType()];}
};

let geojson_layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: './Teniszpalyak.geojson'
  }),
  style: styleFunction
});

const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 10,
    },
  },
});

const map = new ol.Map({
    target: 'map-container',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      geojson_layer    
  ],
    overlays: [overlay],
    interactions: ol.interaction.defaults({
      onFocusOnly:true,
      doubleClickZoom: true,
      dragPan: true
    }),
    view: new ol.View({
      center: ([2129201.0509001324, 6025841.644010644]),
      zoom: 12,
      maxZoom:18,
      minZoom:10,
      extent: [762958.7313602014,5310108.422259997,3501412.7172102197,6576731.688082888]
    })
  });



const fullscreen = new ol.control.FullScreen();
map.addControl(fullscreen);
  

closer.onclick = function() {
  overlay.setPosition(undefined);
  container.blur();
  return false;
};
map.on('click',function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
});

map.on('click', function(evt){
  let feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature, layer) {
      return feature;
    });
  if (feature) {
      let geometry = feature.getGeometry();
      let coord = geometry.getCoordinates();
      let content = ' <a target="_blank" href=' + feature.get('website') +'><h3>' + feature.get('name') + '</h3></a>';
      content += '<h5>' + '<p class="data-label">Pálya árak: </p>'+ '<p class="data">'+ feature.get('description') + '</p></h5>';
      content += '<h5>' + '<p class="data-label">Telefonszám: </p>'+  '<p class="data">'+feature.get('phone') + '</p></h5>';
      content += '<h5>' + '<p class="data-label">Nyitvatartási idő: </p>'+  '<p class="data">'+feature.get('opening_hours') + '</p></h5>';
      content += '<h5>' + '<p class="data-label">Email:  </p>'+  '<p class="data">'+feature.get('email') + '</p></h5>';
      content += '<h5>' + '<p class="data-label">Város: </p>'+  '<p class="data">'+feature.get('city') + '</p></h5>';
      content += '<h5>' + '<p class="data-label">Cím: </p>'+  '<p class="data">'+feature.get('address') + '</p></h5>';
      content += '<h5>' + '<p class="data-label">Pálya típusa: </p>'+  '<p class="data">'+feature.get('surface') + '</p></h5>';
      content += '<h5>' + '<p class="data-label">Pályák darabszáma: </p>'+  '<p class="data">'+feature.get('count') + '</p></h5>';
      content_element.innerHTML = content;
      overlay.setPosition(coord);
  }
});
map.on('pointermove', function(e) {
  if (e.dragging) return;
  let pixel = map.getEventPixel(e.originalEvent);
  let hit = map.hasFeatureAtPixel(pixel);
  map.getViewport().style.cursor = hit ? 'pointer' : '';
});
