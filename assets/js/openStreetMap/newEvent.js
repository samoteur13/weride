const body = document.querySelector('body')
const formSubmit = document.querySelector('#formSubmit')


// On s'assure que la page est chargée
window.onload = function () {

    // On initialise la carte sur les coordonnées GPS de Marseille .setView([43.296482, 5.36978], 13,)
    let myCard = L.map('myCard', { keyboard: false }).setView([43.296482, 5.36978], 13,)

    // On charge les tuiles depuis un serveur au choix, ici OpenStreetMap France
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20,
    }).addTo(myCard)

    // Cette méthode est à insérer juste après avoir initialisé la carte
    L.Routing.control({
        geocoder: L.Control.Geocoder.nominatim(),
        lineOptions: {
            styles: [{
                color: 'green',
                opacity: 1,
                wheeight: 7
            }]
        },
        router: new L.Routing.osrmv1({
            language: 'fr',
            profile: 'car', // car, bike, foot
        }),
    }).addTo(myCard)

}



const tripDetails = document.getElementById('myCard')
function mySteps() {

    // recupère les informations des étapes de voyage
    let divComplet = document.querySelectorAll('.leaflet-routing-geocoder :first-child')

    // créer les input pour recupèrer les informations des étapes de voyage dans le formulaire
    for (let i = 0; i < divComplet.length; i++) {

        let newStep = document.createElement('input')
        newStep.setAttribute("type", "hidden")
        newStep.setAttribute("name", "steps" )
        tripDetails.appendChild(newStep)
        newStep.value = divComplet[i].value
    }

}