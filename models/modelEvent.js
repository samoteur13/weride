import mongoose from "mongoose";


const eventShema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Veuillez saisir un titre"]
    },
    startDate: {
        type: String,
        required: [true, "Veuillez saisir une date départ"]
    },
    hour: {
        type: String,
        required: [true, "Veuillez saisir une heure de départ"]
    },
    endDate: {
        type: String,
        required: [true, "Veuillez saisir une date de retour"]
    },
    departureLocation: {
        type: String,
        required: [true, "Veuillez saisir un lieu de départ"]
    },
    backLocation: {
        type: String,
        required: [true, "Veuillez saisir un lieu de retour"]
    },
    step: {
        type: String,
        required: [true, "Veuillez saisir au moins une étape"]
    },
    type: {
        type: String,
        required: [true, "Veuillez choisir le type de balade"]
    },
    description: {
        type: String,
        required: [true, "Veuillez saisir une description"]
    },
    riderJoin:  Array

})

const Event = mongoose.model('events', eventShema)
export default Event