import { logger } from "../log.setup";

export class GroupAdd {
    constructor() { }

    setGroupAdd(name , desc) {
        this.name = this._generateName(name);
        this.description = this._generateDescription(desc);
    }

    setName (name) {
        this.name = name
    }

    getName () {
        return this.name
    }

    getDescription () {
        return this.description
    }

    _generateName(name){
        // Generate name with given contidion
        if (name.split(",")[0] === "null") {
            return ""
        } else if (name.split(",")[0] === "char") {
            if(name.split(",")[1] === undefined) {
                // Adding name prefix for identification
                return "Automationtest_" + this.makeid(5)
            } else {
                return this.makeid(name.split(",")[1])
            }
        } else if (name.split(",")[0] === "splChar") {
            return "$%#"
        } else if (name.split(",")[0] === "space") {
            return " "
        } else if (name.split(",")[0] === "digitOnly") {
            return this.makeid(15, "digitOnly")
        }
    }

    _generateDescription(desc){
        if (desc.split(",")[0] === "null") {
            return ""
        } else if (desc.split(",")[0] === "char") {
            if(desc.split(",")[1] === undefined) {
                return this.makeid(15)
            } else {
                return this.makeid(desc.split(",")[1])
            }
        } else if (desc.split(",")[0] === "digitOnly") {
            if(desc.split(",")[1] === undefined) {
                return this.makeid(15, "digitOnly")
            } else {
                return this.makeid(desc.split(",")[1], "digitOnly")
            }
        }
    }

    makeid(length, contidion="char") {
        var result  = ""   
        if (contidion === "digitOnly") {
            var characters       = '0123456789';
        } else if (contidion === "spaceVarWithSpace") {
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        } else {
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        }
        
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result.trim();
     }
     
}
