import { Firebase } from "../util/Firebase";
import { Model } from "./Model";

export class User extends Model {

    constructor(id) {

        super();

        if (id) this.getById(id);

    }

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get chatID(){return this._data.chatID}
    set chatID(value){this._data.chatID = value}

    getById(id) {

        return new Promise((s, f) => {

            User.findByEmail(id).onSnapshot(doc => {
                this.fromJSON(doc.data());
                s(doc);
            });

        });

    }

    save() {

        return User.findByEmail(this.email).set(this.toJSON());

    }

    //Puxar referencias pelo metodo statico fixo
    static getRef() {
        //retorna do firebase com o metodo db da coleção('/user')
        return Firebase.db().collection('/users');

    }

    //Puxar contato pela referencia id
    static getContactRef(id) {

        //retorna o metodo getRef
        return User.getRef()
            .doc(id)
            .collection('contacts');
    }

    static findByEmail(email) {

        return User.getRef().doc(email);

    }
    addContact(contact) {

        return User.getContactRef(this.email)
            .doc(btoa(contact.email))
            .set(contact.toJSON())

    }

    //Metodo getContacts gerando uma promesa
    getContacts(filter = '') {

        return new Promise((s, f) => {

            //Na classe User chamar o metodo getContactRef com elemento this.email
            User.getContactRef(this.email).where('name', '>=', filter).onSnapshot(docs => {

                let contacts = [];

                docs.forEach(doc => {

                    let data = doc.data();
                    data.id = doc.id;
                    contacts.push(data);

                });

                this.trigger('contactschange', docs);

                s(contacts);
            });

        });

    }

}