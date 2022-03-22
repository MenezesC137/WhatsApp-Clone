import { ClassEvent } from "../util/ClassEvent";
import { Firebase } from "../util/Firebase";

export class User extends ClassEvent {

    static getRef(){

        return Firebase.db().collection('/users');

    }

    static findByEmail(email) {

        return User.getRef().doc(email);

    }
}