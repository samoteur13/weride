
//pour récupérer la longueur du nombre de mes cartes
const myCards = document.querySelectorAll('.myCards')



for (let i = 0; i < myCards.length; i++) {

    

    //donne une dimension a mes cartes
    myCards[i].style.height = "300px"
    myCards[i].style.width = "100%"

    
    
        //ajoute un nom de classe à la carte dans chaque itération 
        myCards[i].classList.add('myCard' + [i])

        //utilise le nouveaux nom de classe pour récupérer seulement les latitudes et longitudes de la classe/Carte voulue
        const stepsLat = document.querySelectorAll('.myCard' + [i] + ' .stepsLat')
        const stepsLon = document.querySelectorAll('.myCard' + [i] + ' .stepsLon')
        

        let myWaypoints = []


        for (let j = 0; j < stepsLat.length; j++) {
            myWaypoints.push(L.latLng(stepsLat[j].value, stepsLon[j].value))
        }

        // carte principal
        let map = L.map(myCards[i])

        // On charge les tuiles depuis un serveur au choix, ici OpenStreetMap France
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20,
        }).addTo(map)

        L.Routing.control({

            waypoints: myWaypoints,
            draggableWaypoints : false,// empeche de bouger le marker une fois placer
            lineOptions: {
                addWaypoints : false, // empeche de génerer de nouveux point par la route
                styles: [{
                    color: 'red',
                    opacity: 1,
                    wheeight: 7
                }]
            },
            router: new L.Routing.osrmv1({
                language: 'fr',
                profile: 'car', // car, bike, foot
            }),

        }).addTo(map);




}



const myDetailsOfSteps = document.querySelectorAll('div .leaflet-right .leaflet-bar')
for (let i = 0; i < myDetailsOfSteps.length; i++) {
    myDetailsOfSteps[i].style.display = "none"
    
}
   



