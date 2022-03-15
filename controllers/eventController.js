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

    static async deleteEvent(id, eventId){
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

    static async updateEvent(user, userId, form) {
        for (let i = 0; i<user.eventUser.length; i++){
            if(user.eventUser[i]._id == userId){
              user.eventUser[i].startDate = form.startDate;
              user.eventUser[i].hour = form.hour;
              user.eventUser[i].endDate = form.endDate;
              user.eventUser[i].departureLocation = form.departureLocation;
              user.eventUser[i].backLocation = form.backLocation;
              user.eventUser[i].step = form.step;
              user.eventUser[i].type = form.type;
              user.eventUser[i].description = form.description;
            }
        }
        await User.updateOne({_id: user._id}, {eventUser: user.eventUser
        })

       
    }
    
    
}