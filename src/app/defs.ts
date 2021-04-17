import {Feature, FeatureCollection} from 'geojson';

export interface FeatureLigne extends Feature {
  // type: 'Feature';
  geometry: GeometryMultiLineString;
  properties: {
    CODE: string; // "SEM_C1"
    COULEUR: string; // "253,234,0"
    COULEUR_TEXTE: string; // "0,0,0"
    LIBELLE: string; // "GRENOBLE Cité Jean Macé / MEYLAN Maupertuis"
    NUMERO: string; // "C1"
    PMR: number; // 1
    ZONES_ARRET: string[];
    id: string; // "SEM_C1"
    type: string; // "ligne" 'arret'
  };
}

export interface FeatureLigneCollection extends FeatureCollection {
  // type: 'FeatureCollection';
  features: FeatureLigne[];
}

export interface GeometryMultiLineString {
  type: 'MultiLineString';
  coordinates: GeoPoint[][];
}

export type GeoPoint = [lng: number, lat: number];
