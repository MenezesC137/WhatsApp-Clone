import { Format } from './../util/Format.js'
import { CameraController } from './CameraController.js'
import { MicrophoneController } from './MicrophoneController.js'
import { DocumentPreviewController } from './DocumentPreviewController.js'
import { Firebase } from '../util/Firebase.js'
import { User } from '../model/User.js'

export class WhatsAppController {

    constructor() {

        console.log('WhatsAppController OK')

        this._firebase = new Firebase();
        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();

    }

    //Autenticação do firebase
    initAuth() {

        this._firebase.initAuth()
            .then(response => {

                this._user = new User(response.user.email);

                this._user.on('datachange', data =>{

                    document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';

                    this.el.inputNamePanelEditProfile.innerHTML = data.name;

                    if (data.photo) {

                        let photo = this.el.imgPanelEditProfile;
                        photo.src = data.photo;
                        photo.show();
                        this.el.imgDefaultPanelEditProfile.hide();
                  
                        let photo2 = this.el.myPhoto.querySelector('img')
                        photo2.src = data.photo;
                        photo2.show();
                   
                    }
                })

                this._user.name = response.user.displayName;
                this._user.email = response.user.email;
                this._user.photo = response.user.photoURL;

                this._user.save().then(()=>{

                    this.el.appContent.css({
                        display: 'flex'
                    })
                }) 
            })
            .catch(err => {
                console.error(err);
            });
    }

    //Trás os elementos do projeto
    loadElements() {

        this.el = {};

        document.querySelectorAll('[id]').forEach(element => {

            this.el[Format.getCamelCase(element.id)] = element;

        })
    }

    //Elementos
    elementsPrototype() {

        Element.prototype.hide = function () {
            this.style.display = 'none';
            return this;
        }

        Element.prototype.show = function () {
            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function () {
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        }

        Element.prototype.on = function (events, fn) {
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
                return this;
            })
        }

        Element.prototype.css = function (styles) {
            for (let name in styles) {
                this.style[name] = styles[name];
                return this;
            }
        }

        Element.prototype.addClass = function (name) {
            this.classList.add(name);
            return this;
        }

        Element.prototype.removeClass = function (name) {
            this.classList.remove(name);
            return this;
        }

        Element.prototype.toggleClass = function (name) {
            this.classList.toggle(name);
            return this;
        }

        Element.prototype.hasClass = function (name) {
            return this.classList.contains(name);
        }

        HTMLFormElement.prototype.getForm = function () {

            return new FormData(this);

        }

        HTMLFormElement.prototype.toJSON = function () {

            let json = {};

            this.getForm().forEach((value, key) => {

                json[key] = value;

            })

            return json;

        }
    }

    initEvents() {

        //CONFIG. PERFIL
        this.el.myPhoto.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();
            setTimeout(() => {
                this.el.panelEditProfile.addClass('open');

            }, 300)

        })

        //Adicionar Contato
        this.el.btnNewContact.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelAddContact.show();
            setTimeout(() => {
                this.el.panelAddContact.addClass('open');

            }, 300)

        })

        //Fechar o menu config
        this.el.btnClosePanelEditProfile.on('click', e => {

            this.el.panelEditProfile.removeClass('open');

        })

        //Fechar o painel de contato
        this.el.btnClosePanelAddContact.on('click', e => {

            this.el.panelAddContact.removeClass('open');

        })

        //Input da foto de perfil
        this.el.photoContainerEditProfile.on('click', e => {

            this.el.inputProfilePhoto.click();

        })

        //Enter no nome do perfil
        this.el.inputNamePanelEditProfile.on('keypress', e => {

            if (e.key === 'Enter') {

                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();

            }

        })


        this.el.btnSavePanelEditProfile.on('click', e => {

            console.log(this.el.inputNamePanelEditProfile.innerHTML);

        })

        this.el.formPanelAddContact.on('submit'), e => {

            e.preventDefault();

            let formData = new FormData(this.el.formPanelAddContact);

        }

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

            item.on('click', e => {

                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'

                })
            })
        })

        this.el.btnAttach.on('click', e => {

            e.stopPropagation();
            this.el.menuAttach.addClass('open')
            document.addEventListener('click', this.closeMenuAttach.bind(this))

        })

        //Botão para abrir a camera
        this.el.btnAttachPhoto.on('click', e => {
            this.el.inputPhoto.click();
        })

        this.el.inputPhoto.on('change', e => {

            console.log(this.el.inputPhoto.files);

            [...this.el.inputPhoto.files].forEach(file => {

                console.log(file);

            });

        })

        //Painel de foto
        this.el.btnAttachCamera.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'height': '100%'

            });

            this._camera = new CameraController(this.el.videoCamera);
        });

        //Fechar o Painel da foto
        this.el.btnClosePanelCamera.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();

        });

        //Tirar foto
        this.el.btnTakePicture.on('click', e => {

            let dataUrl = this._camera.takePicture();

            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();

        });

        //Reiniciar o painel da foto
        this.el.btnReshootPanelCamera.on('click', e => {

            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();

        });

        //Enviar a foto
        this.el.btnSendPicture.on('click', e => {

            console.log(this.el.pictureCamera.src);

        })

        //Botão para selecionar documento
        this.el.btnAttachDocument.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open')
            this.el.panelDocumentPreview.css({
                'height': '100%',
            })

            this.el.inputDocument.click();

        })

        this.el.inputDocument.on('change', e => {
            if (this.el.inputDocument.files.length) {



                let file = this.el.inputDocument.files[0];

                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result => {

                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();



                }).catch(err => {


                    switch (file.type) {

                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.classname = 'jcxhw icon-doc-xls'
                            break;

                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;

                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;

                            break;

                        default:
                            this.el.iconPanelDocumentPreview.classname = 'jcxhw icon-doc-generic'
                    }


                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();

                })
            }
        })

        this.el.btnClosePanelDocumentPreview.on('click', e => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();

        })

        this.el.btnSendDocument.on('click', e => {

            console.log('send document');

        })

        this.el.btnAttachContact.on('click', e => {

            this.el.modalContacts.show();

        })

        this.el.btnCloseModalContacts.on('click', e => {

            this.el.modalContacts.hide();

        })

        //Botão do microfone
        this.el.btnSendMicrophone.on('click', e => {

            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('play', musica => {

                console.log('ready event');

                this._microphoneController.startRecorder();

            })

            this._microphoneController.on('recordtimer', timer => {

                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer)

            })
        })

        //Cancelar o microfone
        this.el.btnCancelMicrophone.on('click', e => {

            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone()

        })

        //Enviar o Audio
        this.el.btnFinishMicrophone.on('click', e => {

            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone()

        })

        //Enviar mensagem com o Enter
        this.el.inputText.on('keypress', e => {

            if (e.key === 'Enter' && !e.ctrlKey) {

                e.preventDefault();
                this.el.btnSend.click();

            }
        })

        //Input de texto
        this.el.inputText.on('keyup', e => {

            if (this.el.inputText.innerHTML.length) {

                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();

            } else {

                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();

            }

            this.el.btnSend.on('click', e => {

                console.log(this.el.inputText.innerHTML);

            })
        })

        //Botão de Emoji
        this.el.btnEmojis.on('click', e => {

            this.el.panelEmojis.toggleClass('open');

        })

        //Seletor de emoji
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {

            emoji.on('click', e => {

                console.log(emoji.dataset.unicode);

                let img = this.el.imgEmojiDefault.cloneNode();

                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name => {
                    img.classList.add(name);
                })

                let cursor = window.getSelection();

                if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {

                    this.el.inputText.focus();
                    let cursor = window.getSelection();

                }

                let range = document.createRange();

                range = cursor.getRangeAt(0);
                range.deleteContents();

                let frag = document.createDocumentFragment();

                frag.appendChild(img);

                range.insertNode(frag);

                range.setStartAfter(img);

                this.el.inputText.dispatchEvent(new Event('keyup'));

            })
        })
    }

    //Método para encerrar a gravação de audio
    closeRecordMicrophone() {

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();

    }

    //Método para fechar os paineis principais
    closeAllMainPanel() {

        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');
    }

    //Método para fechar os paines de envio de arquivo
    closeMenuAttach(e) {

        document.removeEventListener('click', this.closeMenuAttach)
        this.el.menuAttach.removeClass('open');

    }

    //Método para fechar os paineis na esquerda
    closeAllLeftPanel() {

        this.el.panelAddContact.hide()
        this.el.panelEditProfile.hide()


    }
}