import { afterNextRender, afterRenderEffect, Directive, inject, input } from "@angular/core";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { OlMapDirective } from "./ol-map.directive";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle"; // Importa Circle en lugar de CircleStyle
import Stroke from "ol/style/Stroke";

@Directive({
    selector: 'ol-marker',
  })
  export class OlMarkerDirective {
    #olMap = inject(OlMapDirective); // Inyectamos Directiva del mapa (padre)
    coordinates = input.required<[number, number]>();
    color = input('red');
    fill = input('white');
    #marker!: Feature;
  
    constructor() {
      afterNextRender(() => {
        this.#marker = new Feature({
          geometry: new Point(this.coordinates()),
        });
        this.#marker.setStyle(
          new Style({
            image: new Circle({
              radius: 9,
              fill: new Fill({
                color: this.color(),
              }),
              stroke: new Stroke({
                color: this.fill(),
                width: 3,
              }),
            }),
          })
        );
  
        this.#olMap.vectorLayer.getSource()?.addFeature(this.#marker);
      });
  
      afterRenderEffect(() => { // Cada vez que cambien las coordenadas
        this.#marker.setGeometry(new Point(this.coordinates()))
      });
    }
  }
  