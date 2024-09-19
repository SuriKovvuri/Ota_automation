export class NetworkAdd {

    constructor() {

    }
    setNetworkAdd(
    name, label, nw_addr, cidr, start_ip, end_ip, gw='', vlan='Disabled', vlan_id=0, default_destn='', service_addr='Dynamic') {
        this.name= name;
        this.label = label;
        this.nw_addr = nw_addr;
        this.cidr = cidr;
        this.start_ip = start_ip;
        this.end_ip = end_ip;
        this.gw = gw;
        this.vlan = vlan;
        this.vlan_id = vlan_id;
        this.default_destn = default_destn;
        this.service_addr = service_addr;
      }

    getname () {
        return this.name
    }
    getlabel () {
    return this.label
    }
    getnw_addr () {
        return this.nw_addr
    }
    getcidr () {
        return this.cidr
    }
    getstart_ip () {
        return this.start_ip
    }
    getend_ip () {
        return this.end_ip
    }
    getgw () {
        return this.gw
    }
    getvlan () {
        return this.vlan
    }
    getvlan_id () {
        return this.vlan_id
    }
    getdefault_destn () {
        return this.default_destn
    }
    getservice_addr () {
        return this.service_addr
    }
}