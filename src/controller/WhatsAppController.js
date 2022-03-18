class WhatsAppController {

    constructor(){

        console.log('WhatsAppController OK')
        
        this.elementsPrototype();
        this.loadElements();

    }

    loadElements(){

        this.el = {};

        document.querySelectorAll('[id]').forEach(element => {

            this.el[Format.getCamelCase(element.id)] = element;

        })
    }

    elementsPrototype(){

        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        }

        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        }
       
        Element.prototype.on = function(events, fn){
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
                return this;
            })
        }

        Element.prototype.css = function(styles){
            for (let name in styles) {
                this.style[name] = styles[name];
                return this;
            }
        }

        Element.prototype.addClass = function(name) {
            this.ClassList.add(name);
            return this;
        }

        Element.prototype.removeClass = function(name) {
            this.ClassList.remove(name);
            return this;
        }

        Element.prototype.toggleClass = function(name) {
            this.ClassList.toggle(name);
            return this;
        }

        Element.prototype.hasClass = function(name) {
            return this.ClassList.contains(name);
        }
    }
}