import { Component, createRef } from 'preact';
import { connect } from 'react-redux';
import styles from './style.module.less';
import 'ol/ol.css';
import { Feature, Map as OpenLayersMap, Overlay, View } from 'ol';
import { GeoJSON, WKT } from 'ol/format';
import { Cluster, Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { apply } from 'ol-mapbox-style';
import type { Station } from '../../store/data';
import { OSM } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import { LineString } from 'ol/geom';
import { Style, Stroke, Fill, Circle, RegularShape } from 'ol/style';
import { Attribution } from 'ol/control';


export interface MapProps {
  shapes: unknown,
  stations: Station[],
}

export class DisconnectedMap extends Component<MapProps> {
  map = new OpenLayersMap();
  mapRef = createRef();
  routeVectorSource = new VectorSource();
  tooltipRef = createRef();
  tooltipOverlay = new Overlay({ positioning: 'bottom-left', offset: [10, -4] });
  watchPositionHandlerId: number | null = null;
  userPosition: GeolocationPosition | null = null;

  componentDidMount = (): void => {
    if ('ondeviceorientationabsolute' in window) {
      addEventListener('deviceorientationabsolute', this.onDeviceOrientationEvent);
    }
    else if ('ondeviceorientation' in window) {
      addEventListener('deviceorientation', this.onDeviceOrientationEvent);
    }
    this.watchPositionHandlerId = navigator.geolocation.watchPosition(this.updateUserPosition, null, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
    this.initOpenLayersMap();
  }

  componentWillReceiveProps = (nextProps: MapProps): void => {
    if (nextProps.shapes !== this.props.shapes) {
      this.showRouteShapes(nextProps.shapes);
    }
  }

  componentWillUnmount(): void {
    if (this.watchPositionHandlerId !== null) {
      navigator.geolocation.clearWatch(this.watchPositionHandlerId);
    }
  }

  onDeviceOrientationEvent = (event) => {
    if (event.absolute) {
      const theta = -event.alpha * Math.PI / 180;
      this.map.getView().setRotation(-theta);
    }
  }


  onPointerMove = (e) => {
    if (e.dragging) {
      return;
    }

    const clusterFeatures = this.map.getFeaturesAtPixel(e.pixel);
    let showTooltip = false;

    for (const clusterFeature of clusterFeatures) {
      const features = clusterFeature.get('features');

      if (!features) {
        continue;
      }
      else {
        showTooltip = true;
        if (features.length === 1) {
          const feature = features[0];
          const { stationId } = feature.getProperties();
          const station = stationId && this.props.stations.find(station => station.id === stationId);

          if (station) {
            this.tooltipOverlay.setPosition(feature.getGeometry().getCoordinates())
            this.tooltipRef.current.innerHTML = station.name;
          }
        }
        else {
          this.tooltipOverlay.setPosition(clusterFeature.getGeometry()?.getCoordinates())
          this.tooltipRef.current.innerHTML = `${features.length}&nbsp;features`
        }
      }
    }

    if (!showTooltip) {
      this.tooltipOverlay.setPosition(undefined);
    }
  }

  createUserLayer = () => {
    this.userPositionFeature = new Feature({
      geometry: new Point([0, 0])
    })

    this.userPositionFeature.setStyle([
      new Style({  // Circle centered on user position
        image: new Circle({
          radius: 5.5,
          stroke: new Stroke({ color: '#1976D2', width: 1 }),
          fill: new Fill({ color: '#42A5F5' })
        })
      }),
      new Style({  // Triangle pointing in direction user is facing
        image: new RegularShape({
          radius: 5,
          points: 3,
          displacement: [0, 10],
          stroke: new Stroke({ color: '#1976D2', width: 1 }),
          fill: new Fill({ color: '#42A5F5' }),
        })
      })
    ]);

    return new VectorLayer({
      source: new VectorSource({
        features: [this.userPositionFeature]
      })
    });

  }

  updateUserPosition = (position: GeolocationPosition) => {
    this.userPosition = position;
    const { longitude, latitude } = position.coords;
    const coords = fromLonLat([longitude, latitude]);
    this.userPositionFeature.getGeometry().setCoordinates(coords);
  }

  initOpenLayersMap = () => {
    const apiKey = 'KehTSs60zpBFRO1Mf9kv';

    this.userLayer = this.createUserLayer();

    this.tooltipOverlay.setElement(this.tooltipRef.current);
    this.map.addOverlay(this.tooltipOverlay);
    this.map.setTarget(this.mapRef.current);
    this.map.setView(
      // 48.518203377458434, -123.42296760993236
      new View({ center: fromLonLat([-123.42296760993236, 48.518203377458434]), zoom: 10 })
    );

    apply(this.map, `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`).then(() => {
      this.map.addLayer(
        new VectorLayer({
          source: this.routeVectorSource,
        })
      );
      this.map.on('pointermove', this.onPointerMove);
    });
  }

  clearRouteShapes = () => {
    this.routeVectorSource.clear();
  }

  showRouteShapes = (shapes, clear=true) => {
    if (clear) {
      this.clearRouteShapes();
    }

    const geojson = new GeoJSON();
    const style = new Style({
      stroke: new Stroke({ color: 'rgb(25, 118, 210)', width: 1 }),
    })

    //shapes.forEach(shape => {
      const shape = shapes[1]
      console.log(shape);
      const feature = geojson.readFeature(shapes[0], {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      feature.setStyle(style)
      console.log({ feature })
      this.routeVectorSource.addFeature(feature);

    //})
  }


  render() {
    return (
      <div class={styles.map} ref={this.mapRef}>
        <div class={styles.tooltip} ref={this.tooltipRef} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  shapes: state.data.shapes,
});

const mapDispatchToProps = {
};

export const Map = connect(mapStateToProps, mapDispatchToProps)(DisconnectedMap);

