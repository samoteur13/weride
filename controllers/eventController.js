import Event from "../models/modelEvent.js"
import User from "../models/modelUser.js"

export class EventController {
    static async newEvent(event, user){

        let objectError = {
            errors: []
        }

        const newEvent = new Event(event)
        
        //---------------------------- permet de récupérer les erreurs
        let err = await newEvent.validateSync()
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) {
                objectError.errors.push(Object.values(err.errors)[i].message);
            }
            return objectError;
        }else{
            await user.eventUser.push(newEvent)
            await user.save()
            return ""
        }

    }

    static async deleteEvent(e, a){
        const user = await User.findOne({ _id: e }) //pour sauvegarder ensuite sur l'utilisateur
        let index;
        let eventId = a //recup param de l'event
        for (let i = 0; i < user.eventUser.length; i++) {
            if (user.eventUser[i]._id == eventId) {
                 index = i;
            }
        }
        user.eventUser.splice(index, 1) //supprimé l'élèment ciblé
        await user.save()
    }

}