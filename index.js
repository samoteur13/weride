import express from 'express';
import mongoose from "mongoose";
import session from "express-session";
import { Config } from './Config.js';
import userRouter from './router/routerUser.js';


const app = express();
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

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./assets'));
app.use(userRouter) 

//----------------------------------------lancement de serveur
app.listen(8080, () => {
    console.log('le serveur a démarré')
})








