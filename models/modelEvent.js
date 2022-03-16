import mongoose from "mongoose";


const eventShema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Saisir un titre"]
    },
    startDate: {
        type: String,
        required: [true, "Saisir une date départ"]
    },
    hour: {
        type: String,
        required: [true, "Saisir une heure de départ"]
    },
    endDate: {
        type: String,
        required: [true, "Saisir une date de retour"]
    },
    departureLocation: {
        type: String,
        required: [true, "Saisir un lieu de départ"]
    },
    backLocation: {
        type: String,
        required: [true, "Saisir un lieu de retour"]
    },
    step: {
        type: String,
        required: [true, "Saisir au moins une étape"]
    },
    type: {
        type: String,
        required: [true, "Choisissez le type de balade"]
    },
    description: {
        type: String,
        required: [true, "Une petite description !!"]
    },

})

const Event = mongoose.model('events', eventShema)
export default Event