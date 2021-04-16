import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import firebase from 'firebase/app';
import { circle, latLng, LatLngTuple, Layer, MapOptions, polygon, Polyline, polyline, tileLayer } from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';
import { FeatureLigneCollection } from './defs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  dataIconGoogle = 'assets/images/iconGoogle.png';
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

  layersControl: LeafletControlLayersConfig = {
      baseLayers: {
          'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
          'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      },
      overlays: {
          'Big Circle': circle([ 45.188529, 5.724524 ], { radius: 500000 }),
          'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
      }
  };
  userToken = new BehaviorSubject<string>('');

  constructor(public auth: AngularFireAuth, private http: HttpClient) {
    auth.user.subscribe( async u => {
      const token = !u ? '' : await u.getIdToken();
      console.log(token);
      this.userToken.next( token );
    });

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
      }
    );
  }

  login(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    this.auth.signInWithPopup(provider);
  }

  logout(): void {
    this.auth.signOut();
  }

  async query(method: string = 'GET', URL: string = 'http://localhost:5000/test/auth'): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', this.userToken.value);
    const R = await fetch(URL, {method, headers, mode: 'cors'} );
    if (R.status === 200) {
      console.log( await R.text() );
    } else {
      console.log('ERROR', R.status);
    }
  }
}
