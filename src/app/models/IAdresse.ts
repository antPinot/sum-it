/**
 * Modèle représentant une adresse (NON IMPLEMENTE)
 * 
 */
export interface Adresse {
    
    id?:number,
    numero?: number,
    complementNumero?: string,
    voie?: string,
    codePostal?: number,
    ville?:string
    departement?: string,
    pays?: string,

}
