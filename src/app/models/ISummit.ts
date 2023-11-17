import { LatLng } from "leaflet"

export interface Summit{
    id: string,
    name: string,
    altitude: number,
    massif: string,
    coordinates?: LatLng
    photoUrl?: string,
    wikiDescription?: string,
    linksUrl?: string[]
    photoGallery?: string[],
    isFavorite?: boolean
}