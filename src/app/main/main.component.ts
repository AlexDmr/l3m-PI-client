import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { latLng, LatLngTuple, Layer, MapOptions, polyline, tileLayer } from 'leaflet';
import { Observable, BehaviorSubject } from 'rxjs';
import { FeatureLigneCollection } from '../defs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {
  upFile = '';
  iconMarker = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/585px-Map_marker.svg.png';
  options: MapOptions = {
      layers: [
          tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 12,
      center: latLng(45.188529, 5.724524)
  };
  private layersSubj = new BehaviorSubject<Layer[]>([]);
  readonly layers: Observable<Layer[]> = this.layersSubj.asObservable();

  constructor(http: HttpClient, private storage: AngularFireStorage) {
    http.get<FeatureLigneCollection>('https://data.metromobilite.fr/api/lines/json?types=ligne').subscribe( flc => {
      const layers: Layer[] = flc.features.reduce( (L, fl) => {
        if (fl.geometry.type === 'MultiLineString') {
          const poly = polyline(
            fl.geometry.coordinates.map( l => l.map( ([x, y]) => [y, x] as LatLngTuple ) ),
            {color: `rgb(${fl.properties.COULEUR})`}
          );
          L.push( poly );
        }
        return L;
      }, [] as Layer[] );
      console.log( layers );
      this.layersSubj.next(layers);
    });
  }

  ngOnInit(): void {
  }

  async send(evt: Event): Promise<void> {
    console.log('send', this.upFile);
    const Lf = (evt.target as EventTarget & HTMLInputElement)?.files;
    if (Lf && Lf.length > 0) {
      const file = Lf[0];
      const filePath = 'testFile';
      const task = this.storage.upload(filePath, file);
      task.then(
        r => console.log  ('OK!', r),
        e => console.error('err', e)
      );
    }
  }

}
