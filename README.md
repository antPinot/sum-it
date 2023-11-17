# sum-it
Projet réalisé dans le cadre du module Ionic de la formation CDA Diginamic

Le but de l'application est de permettre à son utilisateur de localiser sur une carte les sommets autour d'un lieu et/ou de sa position
# Cas d'utilisation
Un utilisateur peut :
 - Rechercher un lieu et la carte est centrée sur celui-ci
 - Se géolocaliser et la carte est centrée sur sa position (nécessite la localisation sur le périphérique mobile et demande la permission)
 - Choisir entre un fond de carte OpenStreetMap ou OpenTopoMap
 - Cliquer sur un marqueur pour afficher une fenêtre d'informations condensées du sommet
 - Afficher les informations détaillées d'un sommet depuis les informations condensées
 - Naviguer dans le menu pour afficher la liste des sommets et sélectionner un sommet pour afficher ses informations détaillées
 - Ajouter un sommet à ses favoris en cliquant sur l'icône "favoris" (icône coeur en haut à droite)
 - Naviguer dans le menu pour retrouver la liste de ses favoris
 - Afficher dans un navigateur interne à l'application depuis les informations détaillées d'un sommet:
    - La page wikipédia du sommet
    - Une randonnée Visorando liée au sommet
    - Une randonnée Altituderando liée au sommet
    - Un topo CampToCamp lié au sommet
 - Consulter une galerie photo sous forme de carousel et ajouter une photo à cette galerie soit :
    - En réalisant un nouveau cliché depuis l'appareil photo (sauvegarde la photo en local)
    - En choisissant une image depuis un répertoire de son périphérique mobile

# Plugins Capacitor utilisés dans ce projet
- Browser 
- Camera
- Geolocation
- Haptics

# Notes pour l'évaluateur
Les sommets avec des données "complètes" sont les suivants :
- Mont Clapier
- Mont Ténibre
- Cime de la Malédie
Les autres sommets possèdent des données incomplètes (seulement celles récupérées via des API)

Il subsite également un problème non résolu : Lors de l'ajout d'un sommet en favori via la liste des sommets, le clic ouvre également les informations détaillées du sommet

# API Externes
- Wikipedia
- Nominatim (via geocoder)
- OpenStreetMap
- OpenTopoMap

# Librairies/Dépendances
- Leaflet (via ngx-leaflet)
- Leaflet Geocoder
- Swiper

# Perspectives
- Affichage des sommets en fonction de la distance à la localisation ou au lieu recherché (et non affichage de tous les sommets dès le démarrage de l'application)
- Autocomplétion basée sur une API OSRM avec searchbar à façon (et non utilisation de geocoder)
- Résoudre le problème d'ajout des favoris / affichage des informations détaillées de manière simultanée depuis la liste des sommets
- Changement de l'icône de l'application
