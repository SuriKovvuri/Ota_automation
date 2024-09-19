export class NetworkConnect {

    constructor() {

    }
    setNetworkConnect(
        local_networkname, peer_nodename, peer_networkname, peer_repnetwork) {
        this.local_networkname = local_networkname;
        this.peer_nodename= peer_nodename;
        this.peer_networkname = peer_networkname;
        this.peer_repnetwork = peer_repnetwork;
      }
    
    getlocal_networkname () {
        return this.local_networkname
    }
    getpeer_nodename () {
        return this.peer_nodename
    }
    getpeer_networkname () {
    return this.peer_networkname
    }
    getpeer_repnetwork () {
        return this.peer_repnetwork
    }
}