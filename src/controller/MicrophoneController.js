import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent{

    constructor(){

        super();

        this._mimeType = 'audio/webm'

        this._available = false;

        navigator.mediaDevices.getUserMedia({ 
            audio: true 
        }).then(stream => {

            this._available = true;

            this._stream = stream;

            let audio = new Audio();

            audio.srcObject = stream;

            audio.play();

            this.trigger('play', audio)

        }).catch(err => {
            console.error(err);
        });
    }

    isaAvailable(){

        return this._available;

    }

    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    startRecorder() {

        if(this._available()) {

            this._mediaRecorde = new MediaRecorder(this._stream, this._mimeType);

            this._recordedChunks = [];

            this._mediaRecorde.addEventListener('dataavailable', e=>{

                if(e.data.size > 0) this._recordedChunks.push(e.data)

            })

            this._mediaRecorde.addEventListener('stop', e=>{

                let blob = new Blob(this._recordedChunks, {
                    type: yhis._mimeType
                })

                let filename = `rec${Date.now()}.webm`;
                
                let file = new File([blob], filename, {
                    type: this._mimeType,
                    lastModified: Date.now()
                });
            })
        }
    }

    stopRecorder(){

        if(this._available()) {


        }
    }
}