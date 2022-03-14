import Event from "../models/modelEvent.js"
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
}