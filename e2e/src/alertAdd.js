export class AlertAdd {

    constructor() {

    }
    setAlertAdd(
    name, org_name, node_name, tunnel_name, service_name,label, alert_if, alert_is, alert_for, scope, channel) {
        this.name= name;
        this.label = label;
        this.org_name = org_name;
        this.node_name = node_name;
        this.tunnel_name = tunnel_name;
        this.service_name = service_name;
        this.alert_if = alert_if;
        this.alert_is = alert_is;
        this.alert_for = alert_for;
        this.scope = scope;
        this.channel = channel;
      }

    getname () {
        return this.name
    }
    getlabel () {
    return this.label
    }
    getorg_name () {
        return this.org_name
    }
    getnode_name () {
        return this.node_name
    }
    gettunnel_name () {
        return this.tunnel_name
    }
    getservice_name () {
        return this.service_name
    }
    getalert_if () {
        return this.alert_if
    }
    getalert_is () {
        return this.alert_is
    }
    getalert_for () {
        return this.alert_for
    }
    getscope () {
        return this.scope
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

    getchannel () {
        return this.channel
    }
    
}