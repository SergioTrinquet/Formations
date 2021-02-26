import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Hack pour Leaflet pour faire apparaitre le marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default (id, x, y) => {
    //console.log("Passage ds 'creationMap'"); //TEST
    var container = L.DomUtil.get(id); // Check si un élément du DOM avec cet id existe déjà...
    if(container != null){ container._leaflet_id = null } //...Si c'est le cas, on rend possible le fait de passer de nouveau le même id pour la création de la carte

    let carte = L.map(id).setView([x, y], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright" class="small">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr" class="small">OSM France</a>',
        minZoom: 5,
        maxZoom: 20
    }).addTo(carte);

    /* var marker = $L.marker([x, y]).addTo(carte);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();*/
    L.marker([x, y]).addTo(carte);
}