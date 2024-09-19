


export class UserAdd {

    constructor() {

    }
    setUserAdd(
    fullname, email, password, confirmpsw, role,timezone) {
        this.fullname= fullname;
        this.email = email;
        this.password = password;
        this.confirmpsw = confirmpsw;
        this.role = role;
        this.timezone = timezone;
      }

    getfullname () {
        return this.fullname
    }
    getemail () {
    return this.email
    }
    getpassword () {
        return this.password
    }
    getconfirmpsw () {
        return this.confirmpsw
    }
    getrole () {
        return this.role
    }
    gettimezone () {
        return this.timezone
    }
    

    getAlertType(alert)
    {
        var alert_selection
        if (alert == "Node") {
            alert_selection = 'iNode Status'
            } else if (alert == "Upgrade") {
                alert_selection = 'iNode Upgrade Status'
                } else if (alert == "IP") {
                    alert_selection = 'iNode IP Address Change'
                    } else if (alert == "Tunnel") {
                        alert_selection = 'Remote Network Connection Status'
                        } else if (alert == "Service") {
                            alert_selection = 'Service Status'
                            } //To add 'iNode Certificate Expiry' and 'Standalone Mode Expiry'

        return alert_selection
    }

    
}