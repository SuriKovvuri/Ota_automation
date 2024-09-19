export class NodeAdd {

    constructor() {

    }
    setNodeAdd(
    name, label, profile, serial_number, ssh_key, virtual_platform, adv_settings) {
        this.name= name;
        this.label = label;
        this.profile = profile;
        this.serial_number = serial_number;
        this.ssh_key = ssh_key;
        this.virtual_platform = virtual_platform;
        this.adv_settings = adv_settings;
      }

    getname () {
        return this.name
    }
    getlabel () {
    return this.label
    }
    getprofile () {
        return this.profile
    }
    getserial_number () {
        return this.serial_number
    }
    getssh_key () {
        return this.ssh_key
    }
    getvirtual_platform () {
        return this.virtual_platform
    }
    getadv_settings () {
        return this.adv_settings
    }
}