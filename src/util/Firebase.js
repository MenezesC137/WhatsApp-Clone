const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor(){

        this.firebaseConfig = {
            
            apiKey: "AIzaSyAqKNxR_voJ9OIUiYCZwxy9lbghj81LAgM",
            authDomain: "whatsapp-clone-656ee.firebaseapp.com",
            projectId: "whatsapp-clone-656ee",
            storageBucket: "whatsapp-clone-656ee.appspot.com",
            messagingSenderId: "74406977601",
            appId: "1:74406977601:web:a460486ee8cce1dfd3e6c0"
            
        }

        this.init();

    }

    init(){

        if (!window._initializedFirebase) {
            firebase.initializeApp(this.firebaseConfig);

            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            window._initializedFirebase = true;
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
            .then(result => {


                let token = result.credential.accessToken;
                let user = result.user;

                s({
                    user,
                    token
                });

            });
            
            
            }).catch(err=>{

                f(err);

            });

        

        }
    }