import Event from "../models/modelEvent.js"
import User from "../models/modelUser.js"
import fetch from 'node-fetch'

export class EventController {

    static async newEvent(event, user, mySteps) {

        let objectError = {
            "error": true
        }

        const newEvent = new Event(event)

        //---------------------------- permet de récupérer les erreurs
        let err = await newEvent.validateSync()
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) {
                let path = Object.values(err.errors)[i].path //nom du champs en erreur
                objectError[path] = Object.values(err.errors)[i].message // insere l'erreur dans l'objet "objectError"
            }
            return objectError;
        } else {
            newEvent.mySteps = mySteps
            await user.eventUser.push(newEvent)
            await user.save()
            return newEvent
        }

    }

    static async deleteEvent(id, eventId) {
        const user = await User.findOne({ _id: id }) //pour sauvegarder ensuite sur l'utilisateur
        let index;
        for (let i = 0; i < user.eventUser.length; i++) {
            if (user.eventUser[i]._id == eventId) {
                index = i;
            }
        }
        user.eventUser.splice(index, 1) //supprimé l'élèment ciblé
        await user.save()
    }

    static async updateEvent(user, eventId, form) {

        let objectError = {
            "error": true
        }
        const newEvent = new Event(form)
        let err = await newEvent.validateSync()// verifie les erreures
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) {
                let path = Object.values(err.errors)[i].path //nom du champs en erreur
                objectError[path] = Object.values(err.errors)[i].message // insere l'erreur dans l'objet "objectError" [path == nom du champ]
            }
            return objectError;
        } else {
            for (let i = 0; i < user.eventUser.length; i++) {
                if (user.eventUser[i]._id == eventId) {
                    user.eventUser[i].startDate = form.startDate;
                    user.eventUser[i].hour = form.hour;
                    user.eventUser[i].endDate = form.endDate;
                    user.eventUser[i].departureLocation = form.departureLocation;
                    user.eventUser[i].backLocation = form.backLocation;
                    user.eventUser[i].step = form.step;
                    user.eventUser[i].type = form.type;
                    user.eventUser[i].title = form.title;
                    user.eventUser[i].description = form.description;
                }
            }
            await User.updateOne({ _id: user._id }, {
                eventUser: user.eventUser
            })

        }



    }

    static async eventJoin(idEvent, idUserEvent, userId) {

        let objectError = {
            errors: []
        }
        let err = ""

        const userEvent = await User.findOne({ _id: idUserEvent }, { password: 0 })

        const index = userEvent.eventUser.findIndex(eventUser => eventUser._id == idEvent)
        let event = userEvent.eventUser[index]

        let iParticipate;

        for (let i = 0; i < userEvent.eventUser[index].riderJoin.length; i++) {
            if (userEvent.eventUser[index].riderJoin[i] == userId) {
                console.log("Vous participez déjà a cette sortie")
                iParticipate = true
            }
        }

        if (userEvent.eventUser[index].riderJoin.length === 0) {

            await userEvent.eventUser[index].riderJoin.push(userId)
            await User.updateOne({ _id: userEvent._id }, { eventUser: userEvent.eventUser })
            await userEvent.save()

        } else if (iParticipate === true) {

            err = "Vous participez déjà à cette sortie"
            objectError.errors.push(err)
            return objectError

        } else {

            await userEvent.eventUser[index].riderJoin.push(userId)
            await User.updateOne({ _id: userEvent._id }, { eventUser: userEvent.eventUser })
            await userEvent.save()

        }

    }

    static async anullingParticipation(idEvent, idUserEvent, idUser) {
        const userEvent = await User.findOne({ _id: idUserEvent })
        const indexEvent = userEvent.eventUser.findIndex(eventUser => eventUser._id == idEvent)
        let event = userEvent.eventUser[indexEvent]
        let indexRider;

        for (let i = 0; i < event.riderJoin.length; i++) {
            if (event.riderJoin[i] === idUser) {
                indexRider = i
            }

        }

        userEvent.eventUser[indexEvent].riderJoin.splice(indexRider, 1) //supprimé l'élèment ciblé
        await User.updateOne({ _id: userEvent._id }, { eventUser: userEvent.eventUser })
        await userEvent.save() // pourquoi ceci ne suffit pas

    }

    static async mySteps(eventDetails) {

        let site = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q="

        let mySteps = []
        let badAddress = false

        async function coordinate(coordinate) {

            let stepDetails = {
                stepCity: String,
                adressComplement: String,
                stepLat: Number,
                stepLon: Number
            }

            const data = (await fetch(coordinate))
            const dataJson = await data.json()
            if (dataJson.length === 0) {
                return "false"
            }
            stepDetails.stepCity = dataJson[0].display_name.split(',')[0]
            stepDetails.adressComplement = dataJson[0].display_name
            stepDetails.stepLat = dataJson[0].lat
            stepDetails.stepLon = dataJson[0].lon


            return stepDetails

        }

        for (let i = 0; i < eventDetails.steps.length; i++) {
            if (await coordinate(site + encodeURI(eventDetails.steps[i])) === "false") {
                badAddress = true
            }
            mySteps.push(await coordinate(site + encodeURI(eventDetails.steps[i])))
        }
        console.log(badAddress);
        if (badAddress === true) {
            return "false"
        }else{
            return mySteps
        }

    }

}

