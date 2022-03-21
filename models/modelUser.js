import mongoose from "mongoose";

const userShema = mongoose.Schema({
    picture: {
        type:String
    },
    name: {
        type:String,
        required: [true, "Veuillez saisir votre prénom"]
    },
    firstName: {
        type:String,
        required: [true, "Veuillez saisir votre nom"]
    },
    pseudo: {
        type:String,
        required: [true, "Veuillez saisir votre pseudo"]
    },
    password: {
        type:String,
        required: [true, "Veuillez saisir votre mot de passe"]
    },
    mail: {
        type:String,
        required: [true, 'Veuillez saisir votre email']
    },
    status:{
        type: Number,
        
    },
    eventUser: Array,
    motoUser: Array

})

const User = mongoose.model('user', userShema) //premier argument nom de la sous-database

export default User
