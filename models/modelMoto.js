import mongoose from "mongoose";

const motoShema = mongoose.Schema({
    brand: {
        type:String,
        required: [true, "Veuillez saisir le nom du constructeur "]
    },
    model: {
        type:String,
        required: [true, "Veuillez saisir le model de votre moto"]
    },
    cylinder: {
        type:Number,
        required: [true, "Veuillez saisir la cylindrée"]
    }

})

const Moto = mongoose.model('moto', motoShema) //premier argument nom de la sous-database

export default Moto