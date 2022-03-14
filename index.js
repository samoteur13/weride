import express from 'express';
import mongoose from "mongoose";
import session from "express-session";
import { Config } from './Config.js';
import userRouter from './router/routerUser.js';
import eventRouter from './router/routerEvent.js';


const app = express();
const router = express.Router()
const database = "mongodb+srv://" + Config.dbUserName + ":" + Config.dbPassword + "@" + Config.dbClusterName + "/" + Config.dbNameDatabase + "?retryWrites=true&w=majority"

// ----------------------------------------connexion mongose
mongoose.connect(database, err => {
    if (err) {
        console.log("erreur de connexion" + err)
    } else {
        console.log('connected at mongodb')
    }
})


//-----------------------------------------création de session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))


//-------------------------------------------------remplace bodyParser
app.use(express.urlencoded({ extended: true }));

//-----------------------------------dossier static
app.use(express.static('./assets'));

//------------------------------------route initialisation
app.use(router)
app.use(userRouter) 
app.use(eventRouter)

//----------------------------------------lancement de serveur
app.listen(8080, () => {
    console.log('le serveur a démarré')
})
