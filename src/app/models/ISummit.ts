import { Point } from "geojson"
import { LatLng } from "leaflet"

/**
 * Modèle représentant un sommet
 */
export interface Summit{
    id: string,
    name: string,
    elevation: number,
    massif?: string,
    geometry: Point,
    photoUrl?: string,
    wikipediaUri?:string,
    wikiDescription?: string,
    linksUrl?: string[]
    photoGallery?: string[],
    isFavorite?: boolean
}