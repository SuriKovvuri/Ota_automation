export const specialChars = {
    all : ['~','!','@','#','$','^','&','*','(',')','_','+','{','}','|',':','"','<','>','?','`','-','=','[',']',';',"'",',','/'],
    delimiters : ['#','?','/'],
    allowedInEmail : ['.','!','#','$','%','&','*','+','-','/','=','?','^','_','`','{','|','}','~',"'"]
}

const commonFormConst = {
    "labelKey" : {
        "MAX_CHARACTERS_LABEL_KEY" : 63,
        "allowed" : [".","-","_"]
    },
    "labelValue" : {
        "MAX_CHARACTERS_LABEL_VALUE" : 63,
        "allowed" : [".","-","_"]
    }
}

export const addiNodeFormConst = {
    "name" : {
        "allowed" : [' ','.',',','&','-','_']
    },
    "labelKey" : {
        "MAX_CHARACTERS_LABEL_KEY" : 63,
        "allowed" : [".","-","_"]
    },
    "labelValue" : {
        "MAX_CHARACTERS_LABEL_VALUE" : 63,
        "allowed" : [".","-","_"]
    }
}

export const addNetworkFormConst = {
    "name" : {
        "allowed" : [' ','.','-','_']
    },
    "labelKey" : commonFormConst.labelKey,
    "labelValue" : commonFormConst.labelValue
}

export const addUserFormConst = {
    "name" : {
        "allowed" : [' ']
    },
    "email" : {
        "allowed" : ['.','!','#','$','%','&','*','+','-','/','=','?','^','_','`','{','|','}','~',"'"]
    },
    "password" : {
        "allowed" : ['!','@','#','$','&','*','_']
    }
}

export const addOrgFormConst = {
    "orgName" : {
        "allowed" : ['.',',','&','-','_']
    },
    "billingName" : {
        "allowed" : ['.',',','&','-','_']
    },    
    "billingEmail" : {
        "allowed" : ['.','!','#','$','%','&','*','+','-','/','=','?','^','_','`','{','|','}','~',"'"]
    }
}

export const addCSPFormConst = {
    "name" : {
        "allowed" : [' ','.','-','_','&',',']
    },
    "labelKey" : commonFormConst.labelKey,
    "labelValue" : commonFormConst.labelValue
}

export const addSerialFormConst = {
    "serialNumber" : {
        "allowed" : [' ',',',';','-']
    }
}

export const addSSHKeyFormConst = {
    "sshKeyName" : {
        "allowed" : ['.','-','_']
    },
    "sampleSSHPublicKey" : "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCnYhYAMUInYccQemt/OQXVWU2bVlnCkAtCEwQkPp3EX8kzjpcjFmO+n5qvteyaBRoSNRMvAs4RPHsITmWAyxvVtn42aZmZu3LlKYgyv0VeW9SQnTjY5kSMbgogysu6rBfYj2b21dpL2RTSZ3eXcOHsp7/IBW4uXRLQGiz62x5DOYH5R1w1h9MfO5l5GS4/RN0ieSGKtje0wRk9G7RCtKuqWwzHJwXD+2doNyumzze1oMUgg5lXVVNKzn24cFEdpOQSL/IEpxZQO5nVwH5DrEucxY3yVFqllatC4PKBx6jU7KF0BdfWDaH7lQtlpkSHmL7hJAz8CH1cGcLvJ03AY908"
}

export const addRoleFormConst = {
    "roleName" : {
        "allowed" : ['.',',','&','-','_']
    }
}

export const addClusterFormConst = {
    "clusterName" : {
        "allowed" : ['.','-','_']
    }
}

export const addPullSecretConst = {
    "pullSecretName" : {
        "allowed" : ['.',',','&','-','_']
    },
    "dockerConfig" : {
        "key" : "name"
    }
}

export const addVolumeConst = {
    "volumeName" : {
        "allowed" : ['.',',','&','-','_']
    },
    "fileName" : {
        "allowed" : ['.',',','&','-','_']
    },
    "filecontent" : "ABC"
}

export const addAlertFormConst = {
    "alertName" : {
        "allowed" : ['.',',','&','-','_']
    }
}