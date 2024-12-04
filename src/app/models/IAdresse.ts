import { Position } from "geojson"
import { Point } from "geojson"

/**
 * Modèle représentant une adresse (NON IMPLEMENTE)
 *
 */
export interface Adresse {
    id?:number,
    name?:string,
    ville?:string
    departement?: string,
    pays?: string,
    point?: Point
}
