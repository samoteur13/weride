import express from 'express';
import bodyParser from 'body-parser'; //permet de décoder une requette http et recupéré les donnée
import mongoose from "mongoose";
import { Twig } from "twig";
import session from "express-session";

const app = express();
// const database = "mongodb+srv://samoteur13:022394Samy@cluster0.jwcdd.mongodb.net/pokemon?retryWrites=true&w=majority"

//----------------------------------------connexion mongose
// mongoose.connect(database, err => {
//     if (err) {
//         console.log("erreur de connexion" + err)
//     } else {
//         console.log('connected at mongodb')
//     }
// })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./assets'));


//-----------------------------------------création de session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

//----------------------------------------lancement de serveeur
app.listen(8080, () => {
    console.log('le serveur a démarré')
})

//-----------------------------------------main page
app.get('/', async (req, res) => {
    // let user = await User.findOne({ _id: req.session.userId })
    // const listUser = await User.find()
    res.render('./template/inscription/connexion.html.twig', {
    })
})

//ceci est un test