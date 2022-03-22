import { typeIsObject } from 'pdfjs-dist';

const firebase = require('firebase')
require('firebase/firestore')

export class Firebase {

    constructor(){

        this._config = {
            apiKey: "AIzaSyCQsrC6NFR45d2lyjW1j__U7Hpj2SXlXA4",
            authDomain: "whatsapp-clone-2bee2.firebaseapp.com",
            projectId: "whatsapp-clone-2bee2",
            storageBucket: "whatsapp-clone-2bee2.appspot.com",
            messagingSenderId: "652586951103",
            appId: "1:652586951103:web:dc0b1535ae15564d8e010a"
        }

        this.init();

    }

    init(){

        if(!this._initialized) {

            // Initialize Firebase
            firebase.initializeApp(this._config);

            firebase.firestore().settings({
                timestampsInSnapshots: true
            })

            this._initialized = true;

        }
    }

    static db(){

        return firebase.firestore();

    }

    static hd(){

        return firebase.storage();

    }

    initAuth(){

        return new Promise((s, f)=>{

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
            .then(result =>{

                let token = result.credential.accessToken;
                let user = result.user;

                s({
                    user,
                    token
                })

            }).catch(err =>{
                f(err);
            })
        })
    }
}