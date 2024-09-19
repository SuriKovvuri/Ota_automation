export const leftpane = { 
    "aside" : "//a[@href='http://www.iotium.io']//ancestor::aside",
    "a" : {
        "logo" : "//a[@href='http://www.iotium.io']"
    },
    "button" : {
        "search" : "//button[@title='Search']",
        "add" : "//button[@title='Add']",
        "download" : "//button[@title='Download']",
        "help" : "//button[@title='Help']",
        "myAccount" : "//button[@title='My Account']",
        "addOrg" : "//button//span[contains(text(),'Add Org')]",
        "addUser" : "//button//span[contains(text(),'Add User')]",
        "addInode" : "//button//span[contains(text(),'Add iNode')]",
        "logout" : "//button[@title='Logout']"
    },
    "li" : {
        "dashboard" : '//span[text()="Dashboard"]//ancestor::li[@role="menuitem"]',
        "orgs" : "//span[text()='Orgs']//ancestor::li[@role='menuitem']",
        "clusters" : "//span[text()='Clusters']//ancestor::li[@role='menuitem']",
        "inodes" : "//span[text()='iNodes']//ancestor::li[@role='none']",
        "networks" : "//span[text()='Networks']//ancestor::li[@role='none']",
        "services" : "//span[text()='Services']//ancestor::li[@role='none']",
        "users" : "//span[text()='Users']//ancestor::li[@role='none']",
        "allInodes" : "//span[text()='All iNodes']//ancestor::li[@role='menuitem'][1]",
        "serialNumbers" : "//span[text()='Serial Numbers']//ancestor::li[@role='menuitem'][1]",
        "sshKeys" : "//span[text()='SSH Keys']//ancestor::li[@role='menuitem'][1]",
        "allNetworks" : "//span[text()='All Networks']//ancestor::li[@role='menuitem'][1]",
        "customSecurityPolicy" : "//span[text()='Custom Security Policy']//ancestor::li[@role='menuitem'][1]",
        "allServices" : "//span[text()='All Services']//ancestor::li[@role='menuitem'][1]",
        "serviceSecrets" : "//span[text()='Service Secrets']//ancestor::li[@role='menuitem'][1]",
        "allUsers"  : "//span[text()='All Users']//ancestor::li[@role='menuitem'][1]",
        "allRoles" : "//span[text()='All Roles']//ancestor::li[@role='menuitem'][1]",
        "activity" : "//span[text()='Activity']//ancestor::li[@role='menuitem'][1]",
        "apiKeys" : "//span[text()='API Keys']//ancestor::li[@role='menuitem'][1]",
        "downloadSoftware" : "//span[text()='Download Software']//ancestor::li[@role='menuitem']",
        "downloadEvents" : "//span[text()='Download Events']//ancestor::li[@role='menuitem']",
        "downloadActivity" : "//span[text()='Download Activity']//ancestor::li[@role='menuitem']",
        "manageAlerts" : "//span[text()='Manage Alerts']//ancestor::li[@role='menuitem'][1]",
        "myProfile" : "//span[text()='My Profile']//ancestor::li[@role='menuitem'][1]",
        "myAccount" : "//div[@role='menuitem']//span[text()='My Account']",
        "manageWebhooks" : "//span[text()='Manage Webhooks']//ancestor::li[@role='menuitem'][1]",
        "events": "//span[text()='Events']//ancestor::li[@role='menuitem']",
        "allEvents" : "//span[text()='All Events']//ancestor::li[@role='menuitem'][1]",
    },
    "_i" : {
        "collapse" : "//ul[contains(@class,'ant-menu-vertical')]//span[@eventkey='tmp_key-3']",
        "expand" : "//ul[contains(@class,'ant-menu-inline-collapsed')]//span[@eventkey='tmp_key-3']"
    }
}

export const dashboard = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "widget" : {
        "counts" : "//a[@title='Orgs' and starts-with(@href, '/dashboard') and contains(@href, 'orgs')]",
        "inodesByProfile" : "//div[text()='iNodes by Profile']//ancestor::div[contains(@class,'dashboard-widget-wrapper')]",
        "inodesByStatus" : "//div[text()='iNodes by Status']//ancestor::div[@class='dashboard-widget-wrapper']",
        "recentActivity" : "//span[text()='Recent Activity']//ancestor::div[contains(@class,'ant-card act-card-hovering')]"    
    },
    "button" : {
        //"manageDashboard" : "//span[text()='Manage Dashboard ']//ancestor::button[contains(@class, 'ant-btn ant-dropdown-trigger')]",
        "_count" : 6
    },
    "numberCard" : {
        "orgs" : "//a[@title='Orgs' and starts-with(@href, '/dashboard') and contains(@href, 'orgs')]//child::div[contains(@class, 'numberCard')]",
        "clusters" : "//a[@title='Clusters' and starts-with(@href, '/dashboard') and contains(@href, 'clusters')]//child::div[contains(@class, 'numberCard')]",
        "inodes" : "//a[@title='iNodes' and starts-with(@href, '/dashboard') and contains(@href, 'inodes')]//ancestor::div[contains(@class, 'numberCard')]",
        "networks" : "//a[@title='Networks' and starts-with(@href, '/dashboard') and contains(@href, 'networks')]//ancestor::div[contains(@class, 'numberCard')]",
        "customSecurityPolicyValue" : "//a[@title='Custom Security Policy' and starts-with(@href, '/dashboard') and contains(@href, 'securitypolicies')]",
        "services" : "//a[@title='Services' and starts-with(@href, '/dashboard') and contains(@href, 'services')]//ancestor::div[contains(@class, 'numberCard')]",
        "users" : "//a[@title='Users' and starts-with(@href, '/dashboard') and contains(@href, 'users')]//ancestor::div[contains(@class, 'numberCard')]",
        "_count" : 7
    },
    "li" : {
        "orgSelectorMenu" : "//span[contains(@class,'org-selector-menu')]//preceding-sibling::*[name()='svg']//ancestor::li[@role='menuitem']"
    },
    "a" : {
        "orgsValue" : "//a[@title='Orgs' and starts-with(@href, '/dashboard') and contains(@href, 'orgs')]",
        "clustersValue" : "//a[@title='Clusters' and starts-with(@href, '/dashboard') and contains(@href, 'clusters')]",
        "inodesValue" : "//a[@title='iNodes' and starts-with(@href, '/dashboard') and contains(@href, 'inodes')]",
        "serialNumbersValue" : "//a[@title='Serial Numbers' and starts-with(@href, '/dashboard') and contains(@href, 'serials')]",
        "networksValue" : "//a[@title='Networks' and starts-with(@href, '/dashboard') and contains(@href, 'networks')]",
        "customSecurityPolicyValue" : "//a[@title='Custom Security Policy' and starts-with(@href, '/dashboard') and contains(@href, 'securitypolicies')]",
        "servicesValue" : "//a[@title='Services' and starts-with(@href, '/dashboard') and contains(@href, 'services')]",
        "serviceSecretsValue" : "//a[@title='Service Secrets' and starts-with(@href, '/dashboard') and contains(@href, 'licenses')]",
        "usersValue" : "//a[@title='Users' and starts-with(@href, '/dashboard') and contains(@href, 'users')]",
        "rolesValue" : "//a[@title='Roles' and starts-with(@href, '/dashboard') and contains(@href, 'roles')]"     
    }
}

export const clusters = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//div[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'clusterList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'clusterList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'clusterList')]//div[@class='ant-table-body']//tr"
    },
    "span" : {
        "master" : "//td//span[@class='ant-tag iot-tag-label-color' and text()='Master']"
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    },
    "label" : {
        "childOrg" : '//span[text()="Also show child orgs\' Clusters"]'
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter Cluster by name']"
    },
    "button" : {
        "deleteClusters" : "//input[@placeholder='Filter Cluster by name']//ancestor::div[1]//following-sibling::div//button[@title='Delete Clusters']",
        "addCluster" : "//input[@placeholder='Filter Cluster by name']//ancestor::div[1]//following-sibling::div//button[@title='Add Cluster']"
    },
    "_delete_modal" : {
        "delete" : "//div[@class='ant-modal-header']//span[text()='Delete Clusters']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()='Delete Clusters']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    }
}

export const allInodes = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'inodeList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']",

    },
    "input" : {
        "filter" : "//input[@placeholder='Filter iNodes by name']"
    },
    "button" : {
        "deleteInode" : "//input[@placeholder='Filter iNodes by name']//ancestor::div[1]//following-sibling::div//button[@title='Delete iNode']",
        "rebootInodes" : "//input[@placeholder='Filter iNodes by name']//ancestor::div[1]//following-sibling::div//button[@title='Reboot iNodes']",
    },
    "_delete_modal" : {
        "delete" : "//div[@class='ant-modal-header']//span[text()='Delete iNode']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()='Delete iNode']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    }
}

export const serialNumbers = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@class='ant-table-container']//div[@class='ant-table-body']",
        "tableHeader" : "//div[contains(@class, 'serialNumberList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'serialNumberList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'serialNumberList')]//div[@class='ant-table-body']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    // "a" : {
        // "expandAll": "//span[text()='Expand All']//ancestor::a"
    // },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']"
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter serial numbers']"
    },
    "_button" : {
        "add" : "//button[@title='Add Serial']",
        "delete" : "//button[@title='Delete Certificate']",
        "addSerial" : "//div[@class='ant-modal-footer']//button//span[text()='Add Serial']",
        "cancel" : "//div[@class='ant-modal-footer']//button//span[text()='Cancel']"
    },
    "_textarea" : {
        "serialNumbers" : "//textarea[@placeholder='Enter serial numbers. Please use comma, semicolon, or space to separate multiple serial numbers.']"
    },
    "_span" : {
        "1serialNumberSuccess" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span//text()='1 Serial numbers created successfully'"
    },
    _delete_modal : {
        "delete" : "//div[@class='ant-modal-header']//span[text()='Delete Certificate']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()=' Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()='Delete Certificate']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    },
    "_errors" : {
        "serialNumber" : {
            "invalid" : "//textarea[@placeholder='Enter serial numbers. Please use comma, semicolon, or space to separate multiple serial numbers.']//ancestor::span[@class='ant-form-item-children']//following-sibling::div[text()='Invalid serial number']",
            "empty" : "//textarea[@placeholder='Enter serial numbers. Please use comma, semicolon, or space to separate multiple serial numbers.']//ancestor::span[@class='ant-form-item-children']//following-sibling::div[text()='Please enter your serial number.']",
            "closeCircleIcon" : "//textarea[@placeholder='Enter serial numbers. Please use comma, semicolon, or space to separate multiple serial numbers.']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        }
    }
}

export const allNetworks = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@class='ant-table-body']//tbody[@class='ant-table-tbody']//tr[@aria-hidden='true']",
        "tableHeader" : "//div[@class='ant-table-header']//thead[@class='ant-table-thead']//div[@class='ant-table-column-sorters']",
        "tableBody" : "//div[contains(@class, 'nwk-table-container')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'nwk-table-container')]//tbody[(@class='ant-table-tbody')]//tr"
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']",
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter networks by name']"
    }
}

export const allServices = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@class='ant-table-body']//tbody[@class='ant-table-tbody']",
        "tableHeader" : "//div[contains(@class, 'serviceList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'serviceList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[@class='ant-table-wrapper serviceList']//tbody[@class='ant-table-tbody']"
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']"
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter Services by name']"
    }
}

export const clusterDetails = {
    div : {
        clusteriNodesTab : "//span[text()='iNodes']//ancestor::div[contains(@class, 'ant-tabs-tab')]",
        clusterNetworksTab : "//span[text()='Networks']//ancestor::div[contains(@class, 'ant-tabs-tab')]",
        servicesTab : "//span[text()='Services']//ancestor::div[contains(@class, 'ant-tabs-tab')]",
        eventsTab : "//span[text()='Events']//ancestor::div[contains(@class, 'ant-tabs-tab')]"
    },
    button : {
        manageCluster : "//span[text()='Manage Cluster ']//parent::button",
        edit : "//span[text()='Edit']//ancestor::button[@title='Edit Cluster']",
        view : "//span[text()='View']//ancestor::button[@title='View Cluster']",
        delete : "//span[text()='Delete']//ancestor::button[@title='Delete Clusters']",
    },
    tab : {
        events : "//div[@class='ant-tabs-bar ant-tabs-top-bar']//div[contains(@class,'ant-tabs-tab')][4]",
        services : "//div[@class='ant-tabs-bar ant-tabs-top-bar']//div[contains(@class,'ant-tabs-tab')][3]",
        networks : "//div[@class='ant-tabs-bar ant-tabs-top-bar']//div[contains(@class,'ant-tabs-tab')][2]",
        inodes : "//div[@class='ant-tabs-bar ant-tabs-top-bar']//div[contains(@class,'ant-tabs-tab')][1]"
    },
    _adminOnly : ['edit', 'delete']
}

export const inodeDetails = {
    div : {
        systemInfoHead : "//span[text()='System Info']//ancestor::div[@class='ant-card-head']//following-sibling::div[@class='ant-card-body']",
        systemInfoBody : "//span[text()='System Info']//ancestor::div[@class='ant-card-head']//following-sibling::div[@class='ant-card-body']",
        systemInfoValue : "//strong[text()='Name']//parent::div//following-sibling::div/div",
        networksTab : "//span[text()='Networks']//ancestor::div[contains(@class, 'ant-tabs-tab')]",
        servicesTab : "//span[text()='Services']//ancestor::div[contains(@class, 'ant-tabs-tab')]",
        imagesTab : "//span[text()='Images']//ancestor::div[contains(@class, 'ant-tabs-tab')]",
        interfacesTab : "//span[text()='Interfaces']//ancestor::div[contains(@class, 'ant-tabs-tab')]",
        eventsTab : "//span[text()='Events']//ancestor::div[contains(@class, 'ant-tabs-tab')]"
    },
    button : {
        sendDiagnosticData : "//span[contains(text(),'Send Diagnostic Data')]//parent::button",
        manageInode : "//span[text()='Manage iNode ']//parent::button",
        aggregatedSecurityPolicy : "//span[text()='Aggregated Security Policy']//parent::button[@title='Aggregated Security Policy']",
        edit : "//span[text()='Edit']//ancestor::button[@title=' Edit iNode']",
        view : "//span[text()='View']//ancestor::button[@title='View iNode']",
        delete : "//span[text()='Delete']//ancestor::button[@title=' Delete iNode']",
        reboot : "//span[contains(text(),'Reboot')]//ancestor::button[@title='Reboot iNode']",
        _viewInodeLogs : "//span[text()='View Logs']//parent::button[@title='iNode Logs']",
        _addNetwork_skipnow : "//button//span[text()='Skip Now']",
        _addNetwork_addNetwork : "//button//span[text()='Yes - Add Network']",
        _manageInode : {
            deleteInode : {
                delete : "//div[@class='ant-modal-footer']//button//span[text()=' Delete']",
                cancel : "//div[@class='ant-modal-footer']//button//span[text()='Cancel']",
                delete_success_message : "//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
            }
        },
        _networksTab : {
            add : "//button[@title='Add Network']"
        }
    },
    a : {
        moreInfo : "//a[@title='More Info']"
    },
    tab : {
        images : "//div[@class='ant-tabs-bar ant-tabs-top-bar']//div[contains(@class,'ant-tabs-tab')][3]",
        interfaces : "//div[@class='ant-tabs-bar ant-tabs-top-bar']//div[contains(@class,'ant-tabs-tab')][4]",
        events : "//div[@class='ant-tabs-bar ant-tabs-top-bar']//div[contains(@class,'ant-tabs-tab')][5]"
    },
    _adminOnly : ['sendDiagnosticData', 'edit', 'delete', 'reboot'],
    _iNodeStatus : {
        alive : "//div//strong[text()='Health / Status']//ancestor::div//span[text()='ALIVE']"
    }
}

export const pullSecrets = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "tab" : {
        "pullSecrets" :"//div[@class='ant-tabs ant-tabs-left']//div[@class='ant-tabs-nav-list']//div[text()='Pull Secrets']"
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "pullSecrets" : "//div[@class='ant-tabs ant-tabs-left']//div[@class='ant-tabs-nav-list']//div[text()='Pull Secrets']",
        "volumes" : "//div[@class='ant-tabs-tab-btn'][text()='Volumes']",
        "scrollbar" : "//div[@class='ant-table-wrapper secretSSHList']//div[@class='ant-table-body']",
        "tableHeader" : "//div[contains(@class, 'secretSSHList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'secretSSHList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[(@class='ant-table-wrapper secretSSHList')]//div[@class='ant-table-body']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']/span[@class='ant-checkbox ant-checkbox-disabled']",
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter Pull Secrets by name']"
    },
    "button" : {
        "addPullSecret" : "//input[@placeholder='Filter Pull Secrets by name']//ancestor::div[1]//following-sibling::div//button[@title='Add Pull Secret']",
        "deletePullSecret" : "//input[@placeholder='Filter Pull Secrets by name']//ancestor::div[1]//following-sibling::div//button[@title='Delete Pull Secret']"
    },
    "span" : {
        "theadCheckbox" : "//thead[@class='ant-table-thead']//th[1]//span[@class='ant-checkbox']",
        "theadName" : "//thead[@class='ant-table-thead']//th[2]//span[text()='Name']",
        "theadAssignedServices" : "//thead[@class='ant-table-thead']//th[3]//span[text()='Assigned Services']",
        "theadUploadedFiles" : "//thead[@class='ant-table-thead']//th[4]//span[text()='Uploaded Files']"
    },
    "_delete_modal" : {
        "delete" : "//div[@class='ant-modal-header']//span[text()=' Delete Pull Secrets']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()=' Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()=' Delete Pull Secrets']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    }
}

export const addPullSecretsForm = {
    "input" : {
        "pullSecretName" : "//input[@placeholder='Pull Secret Name']"
    },
    "textarea" : {
        "dockerConfig" : "//textarea[@placeholder='Paste contents of Docker config.json file here']"
    },
    "button" : {
        "create" : "//div[@class='ant-modal-footer']//button[@class='ant-btn ant-btn-primary']//span[text()='  Create']",
        "cancel" : "//div[@class='ant-modal-footer']//button[@class='ant-btn']//span[text()='Cancel']"
    },
    "_errors" : {
        "pullSecretName" : {
            "specialCharacters" : "//input[@placeholder='Pull Secret Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Pull Secret Name should start with alphabet or number character and can contain only the following special characters . , & - _']",
            "length" : "//input[@placeholder='Pull Secret Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Pull Secret Name cannot be longer than 60 characters.']",
            "empty" : "//input[@placeholder='Pull Secret Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()=' Please enter Pull Secret Name']",
            "closeCircleIcon" : "//input[@placeholder='Pull Secret Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "dockerConfig" : {
            "empty" : "//textarea[@placeholder='Paste contents of Docker config.json file here']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please enter a valid docker configuration schema ']"
        }
    }
}

export const volumes = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "tab" : {
        "volumes" : "//div[@class='ant-tabs-tab-btn'][text()='Volumes']"
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "pullSecrets" : "//div[@class='ant-tabs ant-tabs-left']//div[@class='ant-tabs-nav-list']//div[text()='Pull Secrets']",
        "volumes" : "//div[@class='ant-tabs-tab-btn'][text()='Volumes']",
        "scrollbar" : "//div[@class='ant-table-wrapper secretLicenseList']//div[@class='ant-table-body']",
        "tableHeader" : "//div[contains(@class, 'secretLicenseList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'secretLicenseList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'secretLicenseList')]//div[@class='ant-table-body']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']",
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter Volumes by name']"
    },
    "button" : {
        "addVolume" : "//input[@placeholder='Filter Volumes by name']//ancestor::div[1]//following-sibling::div//button[@title='Add Volume']",
        "deleteVolume" : "//input[@placeholder='Filter Volumes by name']//ancestor::div[1]//following-sibling::div//button[@title='Delete Volume']"
    },
    "span" : {
        "theadCheckbox" : "//thead[@class='ant-table-thead']//th[1]//span[@class='ant-checkbox']",
        "theadName" : "//thead[@class='ant-table-thead']//th[2]//span[text()='Name']",
        "theadAssignedServices" : "//thead[@class='ant-table-thead']//th[3]//span[text()='Assigned Services']",
        "theadUploadedFiles" : "//thead[@class='ant-table-thead']//th[4]//span[text()='Uploaded Files']"
    },
    "_delete_modal" : {
        "delete" : "//div[@class='ant-modal-header']//span[text()='Delete Volumes']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()=' Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()='Delete Volumes']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    }
}

export const addVolumesForm = {
    "input" : {
        "volumeName" : "//input[@placeholder='volume Name']",
        "fileName" : "//input[@placeholder='File Name']"
    },
    "textarea" : {
        "fileContent" : "//textarea[@placeholder='Your file contents.']"
    },
    "checkbox" : {
        "showFileContentChecked" : "//span[@class='ant-checkbox ant-checkbox-checked']//following::span[text()='Show File Contents']",
        "showFileContent" : "//span[@class='ant-checkbox']//following::span[text()='Show File Contents']"
    },
    "button" : {
        "addFile" : "//button//span[text()=' Add File']",
        "addVolume" : "//div[@class='ant-modal-footer']//button[@class='ant-btn ant-btn-primary']//span[text()='  Add Volume']",
        "cancel" : "//div[@class='ant-modal-footer']//button[@class='ant-btn']//span[text()='Cancel']"
    },
    "_errors" : {
        "volumeName" : {
            "specialCharacters" : "//input[@placeholder='volume Name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Volume name should start with alphabet or number character and may contain following special characters  . , & - _']",
            "length" : "//input[@placeholder='volume Name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Volume name cannot be longer than 60 characters.']",
            "empty" : "//input[@placeholder='volume Name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Volume name should be unique and is a required field.It should start with alphabet or number character and may also contain following special characters . , & - _']"
        },
        "fileName" : {
            "specialCharacters" : "//input[@placeholder='File Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='File name is a required field and may contain following special characters . , & - _']",
            "length" : "//input[@placeholder='File Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='File name cannot be longer than 60 characters.']",
            "empty" : "//input[@placeholder='File Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='File name is a required field and may contain following special characters . , & - _']",
            "closeCircleIcon" : "//input[@placeholder='File Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "fileContents" : {
            "empty" : "//textarea[@placeholder='Your file contents.']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='File content is a required field.']"
        }
    }
}

export const modals = {
    div : {
        content : "//div[@class='ant-modal-content']",
        header : "//div[@class='ant-modal-header']",
        title : "//div[@class='ant-modal-header']//div[@class='ant-modal-title']",
        body: "//div[@class='ant-modal-body']",
        footer : "//div[@class='ant-modal-footer']"
    },
    button:{
        primary: "//div[@class='ant-modal-footer']//button[contains(@class,'ant-btn-primary')]",
        secondary : "//div[@class='ant-modal-footer']//button[not(contains(@class,'ant-btn-primary'))]",
        close : "//div[@class='ant-modal-content']//button[@class='ant-modal-close']"
    }
}

export const clusteriNodesTab = {
    "table" : {
        "tableHeader" : "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Candidate']//ancestor::thead",        
        "tableBody" : "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Candidate']//ancestor::div[contains(@class,'ant-table-header')]//following-sibling::div/table//tbody",
        "tableBodyRows" : "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Candidate']//ancestor::div[contains(@class,'ant-table-header')]//following-sibling::div/table//tbody//tr"
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    },
    "b" : {
        "MasterTag" : "//div[contains(@class, 'ant-tabs-tabpane-active')]//span[contains(@class, 'ant-tag')][text()='Master']", 
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter iNodes by name']"
    }
}


export const clusterNetworksTab = {
    table: {
        clusterNetworks: "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Network CIDR']//ancestor::div[contains(@class,'ant-table-header')]//following-sibling::div/table",
        clusterNetworksHead: "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Network CIDR']//ancestor::table//thead",
        clusterNetworksBody: "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Network CIDR']//ancestor::div[contains(@class,'ant-table-header')]//following-sibling::div/table/tbody"


    },
    a: {
        expandAll : "//div[contains(@class, 'ant-tabs-tabpane-active')]//span[text()='Expand All']//ancestor::a",
        collapseAll : "//div[contains(@class, 'ant-tabs-tabpane-active')]//span[text()='Collapse All']//ancestor::a"
    },
    button : {
        deleteNetworks : "//div[contains(@class, 'ant-tabs-tabpane-active')]//button[@title='Delete Network']"
    }
}

export const networksTab = {
    table: {
        networks: "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Network CIDR']//ancestor::table",
        remoteNetworks: "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Connection Status']//ancestor::table[1]"
    },
    a: {
        expandAll : "//div[contains(@class, 'ant-tabs-tabpane-active')]//span[text()='Expand All']//ancestor::a",
        collapseAll : "//div[contains(@class, 'ant-tabs-tabpane-active')]//span[text()='Collapse All']//ancestor::a"
    },
    button : {
        addNetwork: "//div[contains(@class, 'ant-tabs-tabpane-active')]//button[@title='Add Network'][contains(@class,'ant-btn-primary')]",
        deleteNetworks : "//div[contains(@class, 'ant-tabs-tabpane-active')]//button[@title='Delete Network']",
        wanNetworkMoreDots : "//tr[contains(@class,'is-wan-network')]//button[@class='ant-btn ant-dropdown-trigger']",
        _editNetwork : "//button[@title='Edit Network']"
    }
}

export const servicesTab = {
    _admin : {
        "options" : "//button[@class='ant-btn ant-dropdown-trigger']",
        "serviceLogs" : "//button[@title='Service Logs']"
    },
    table: {
        servicesHaed: "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Running Containers']//ancestor::thead",
        servicesBody: "//div[contains(@class, 'ant-tabs-tabpane-active')]//th[span='Running Containers']//ancestor::table/parent::div//following-sibling::div/table/tbody",
        scrollbar: "//div[contains(@class, 'ant-tabs-tabpane-active')]//div[@tabindex='-1']"
    },
    a: {
        expandAll : "//div[contains(@class, 'ant-tabs-tabpane-active')]//span[text()='Expand All']//ancestor::a",
        collapseAll : "//div[contains(@class, 'ant-tabs-tabpane-active')]//span[text()='Collapse All']//ancestor::a"
    },
    button : {
        addNetwork: "//div[contains(@class, 'ant-tabs-tabpane-active')]//button[@title='Add Service'][contains(@class,'ant-btn-primary')]",
        deleteNetworks : "//div[contains(@class, 'ant-tabs-tabpane-active')]//button[@title='Delete Service']"
    },
    div : {
        "scrollbar" : "//div[contains(@class, 'iNodeServiceList')]//div[@tabindex='-1']",
        "rows" : "//div[contains(@class, 'iNodeServiceList')]//div[@class='ant-table-body']//tr"
    }
}

export const csp = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'firewallGroupList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'firewallGroupList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'firewallGroupList')]//div[@class='ant-table-body']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']",
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter by custom security policy name']"
    },
    button : {
        addCustomSecurityPolicy : "//div[@class='action-btn ']//button[@class='ant-btn ant-btn-primary']",
        deleteCustomSecurityPolicy : "//div[@class='action-btn ']//button[@title='Delete Custom Security Policy']"
    },
    _delete_modal : {
        "delete" : "//div[@class='ant-modal-header']//span[text()='Delete Custom Security Policy']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()=' Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()='Delete Custom Security Policy']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    }
}

export const allUsers = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'userList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'userList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'userList')]//div[@class='ant-table-body']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']",
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter users by full name']"
    },
    button : {
        addUser : "//div[@class='action-btn ']//button[@class='ant-btn ant-btn-primary']",
        deleteUser : "//button[@title='Delete User?']"
    },
    a : {
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    }
}

export const allRoles = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']",
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'roleList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'roleList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'roleList')]//div[@class='ant-table-body']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']",
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter roles by name']"
    },
    button : {
        addRole : "//div[@class='action-btn ']//button[@class='ant-btn ant-btn-primary']"
    },
    a : {
        expandAll: "//span[text()='Expand All']//ancestor::a"
    }
}

export const OnlineHelp = {
    h1: {
        pageTitle : "//h1[strong='ioTium Documentation']"
    },
    img : {
        logo : "//img[@src='media/iotium_logo.png']"
    },
    a : {
        releaseNotes : "//a[@href='release-notes.html'][em='Release Notes']",
        gettingStartedGuide : "//a[@href='user-guide.html'][em='Getting Started Guide']",
        serviceReleseContent : "//a[@href='services.html'][em='Services Release Content']",
        iotiumServiceSpecGuide : "//a[@href='service_spec_guide.html'][em='ioTium Service Specification Guide']",
        iotiumOrchDeveloperGuide : "//a[@href='developer-api.html'][em='ioTium Orchestrator Developer Guide']",
        iotiumRestApiRefernce : "//a[contains(@href, '/apidoc/')][em='ioTium Orchestrator REST API Reference']"
    }
}

export const eventsTab = {
    "_active" : {
        "eventsTab" : "//div[@class='ant-tabs-tab-active ant-tabs-tab']//span[text()='Events']",
        "tableHeader" : "//div[@class='ant-spin-container']//span[contains(text(),'Event Type')]//ancestor::table",
        "_parent" : "//div[@class='ant-spin-container']//span[contains(text(),'Event Type')]//ancestor::div[@class='ant-tabs-content ant-tabs-content-animated ant-tabs-top-content']"
    },
    "div" : {
        "tableBody" : "//div[@class='ant-spin-container']//span[contains(text(),'Event Type')]//ancestor::table",
        "tableHeader" : "//div[@class='ant-spin-container']//span[contains(text(),'Event Type')]//ancestor::thead"        ,
        "tableBodyRows" : "//div[@class='ant-spin-container']//span[contains(text(),'Event Type')]//ancestor::table//tr"
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a",
        "moreEvents": "//strong[text()='More Events']//ancestor::a"
    },
    "span" : {
        "theadTime" : "//thead[@class='ant-table-thead']//th[2]//span[@class='ant-table-column-title'][text()='Time']",
        "theadSource" : "//thead[@class='ant-table-thead']//th[3]//span[@class='ant-table-column-title'][text()='Source']",
        "theadEventType" : "//thead[@class='ant-table-thead']//th[4]//span[@class='ant-table-column-title'][text()='Event Type']",
        "theadStatus" : "//thead[@class='ant-table-thead']//th[5]//span[@class='ant-table-column-title'][text()='Status']"
    }
}

export const imagesTab = {
    "_active" : {
        "imagesTab" : "//div[@class='ant-tabs-tab-active ant-tabs-tab']//span[text()='Images']",
        "tableHeader" : "//div[contains(@class, 'imageList')]//div[contains(@class, 'ant-table-header')]//table",
        "_parent" : "//div[contains(@class, 'imageList')]//div[contains(@class, 'ant-table-header')]//ancestor::div[@class='ant-tabs-content ant-tabs-content-animated ant-tabs-top-content']"
    },
    "div" : {
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'imageList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'imageList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'imageList')]//div[@class='ant-table-body']//tr"
    },
    "a" : {
        "moreImages": "//strong[text()='More Images']//ancestor::a"
    },
    "span" : {
        "theadCheckbox" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[1]//span[@class='ant-checkbox']",
        "theadName" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[2]//span[@class='ant-table-column-title'][text()='Name']",
        "theadSize" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[3]//span[@class='ant-table-column-title'][text()='Size']"
    },
    "i" : {
        "up" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[3]//i[contains(@class,'anticon-caret-up ant-table-column-sorter-up')]",
        "down" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[3]//i[contains(@class,'anticon-caret-down ant-table-column-sorter-down')]"
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter images by name']"
    },
    "button" : {
        "deleteImage" : "//input[@placeholder='Filter images by name']//ancestor::div[1]//following-sibling::div//button[@title='Delete Images']"
    }
}

export const images = {
    "_active" : {
        "images" : "//h2[@class='page-title'][text()='Images']",
        "tableHeader" : "//div[contains(@class, 'imageList')]//div[contains(@class, 'ant-table-header')]//table"
    },
    "h2" : {
        "pageTitle" : "//h2[@class='page-title'][text()='Images']",
        "_count" : 1
    },
    "div" : {
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'imageList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'imageList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'imageList')]//div[@class='ant-table-body']//tr"
    },
    "span" : {
        "theadCheckbox" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[1]//span[@class='ant-checkbox']",
        "theadName" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[2]//span[@class='ant-table-column-title'][text()='Name']",
        "theadSize" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[3]//span[@class='ant-table-column-title'][text()='Size']"
    },
    "i" : {
        "up" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[3]//i[contains(@class,'anticon-caret-up ant-table-column-sorter-up')]",
        "down" : "//div[contains(@class, 'imageList')]//thead[@class='ant-table-thead']//th[3]//i[contains(@class,'anticon-caret-down ant-table-column-sorter-down')]"
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter images by name']"
    },
    "button" : {
        "deleteImage" : "//input[@placeholder='Filter images by name']//ancestor::div[1]//following-sibling::div//button[@title='Delete Images']"
    },
    "a" : {
        "breadcrumb" : "//div[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='Images']"
    }
}

export const interfacesTab = {
    "_active" : {
        "interfacesTab" : "//div[@class='ant-tabs-tab-active ant-tabs-tab']//span[text()='Interfaces']",
        "tableHeader" : "//div[@class='ant-spin-container']//span[contains(text(),'Hardware Address')]//ancestor::thead",
        "_parent" : "//div[@class='ant-spin-container']//span[contains(text(),'Hardware Address')]//ancestor::div[@class='ant-tabs-content ant-tabs-content-animated ant-tabs-top-content']"
    },
    "div" : {
        "tableBody" : "//table",
        "tableHeader" : "//thead",
        "tableBodyRows" : "//table//tr"
    },
    "span" : {
        "theadName" : "//div[@class='ant-spin-container']//thead[@class='ant-table-thead']//span[@class='ant-table-column-title'][text()='Name']",
        "theadType" : "//div[@class='ant-spin-container']//thead[@class='ant-table-thead']//span[@class='ant-table-column-title'][text()='Type']",
        "theadHardwareAaddress" : "//div[@class='ant-spin-container']//thead[@class='ant-table-thead']//span[@class='ant-table-column-title'][text()='Hardware Address']",
        "theadLinkStatus" : "//div[@class='ant-spin-container']//thead[@class='ant-table-thead']//span[@class='ant-table-column-title'][text()='Link Status']"
    },
    "i" : {
        "up" : "//table//span[@class='ant-table-column-title'][text()='Name']//ancestor::span//i[contains(@class,'anticon-caret-up ant-table-column-sorter-up')]",
        "down" : "//table//span[@class='ant-table-column-title'][text()='Name']//ancestor::span//i[contains(@class,'anticon-caret-down ant-table-column-sorter-down')]"
    },
    "ethernet" : {
        "eth0_button" : "//table//tr//code[text()='eth0' or text()='em1' or text()='p4p1' or text()='enp3s0']//ancestor::tr//div[@class='ant-table-row-expand-icon ant-table-row-collapsed']",
        "eth0_name" : "//table//tr//code[text()='eth0' or text()='em1' or text()='p4p1' or text()='enp3s0']",
        "eth0_type" : "//table//tr//code[text()='eth0' or text()='em1' or text()='p4p1' or text()='enp3s0']//ancestor::tr//span[@title='Ethernet']",
        "eth0_hardware_address" : "//table//tr//code[text()='eth0' or text()='em1' or text()='p4p1' or text()='enp3s0']//ancestor::tr//td[4]//code",
        "eth0_link_status" : "//table//tr//code[text()='eth0' or text()='em1' or text()='p4p1' or text()='enp3s0']//ancestor::tr//strong[text()='UP']",
        "eth1_button" : "//table//tr//code[text()='eth1' or text()='em2' or text()='p4p2' or text()='enp3s1']//ancestor::tr//div[@class='ant-table-row-expand-icon ant-table-row-collapsed']",
        "eth1_name" : "//table//tr//code[text()='eth1' or text()='em2' or text()='p4p2' or text()='enp3s1']",
        "eth1_type" : "//table//tr//code[text()='eth1' or text()='em2' or text()='p4p2' or text()='enp3s1']//ancestor::tr//span[@title='Ethernet']",
        "eth1_hardware_address" : "//table//tr//code[text()='eth1' or text()='em2' or text()='p4p2' or text()='enp3s1']//ancestor::tr//td[4]//code",
        "eth1_link_status" : "//table//tr//code[text()='eth1' or text()='em2' or text()='p4p2' or text()='enp3s1']//ancestor::tr//strong[text()='UP']",
        "mgmt_button" : "//table//tr//code[text()='Management']//ancestor::tr//div[@class='ant-table-row-expand-icon ant-table-row-collapsed']",
        "mgmt_name" : "//table//tr//code[text()='Management']",
        "mgmt_type" : "//table//tr//code[text()='Management']//ancestor::tr//span[@title='Ethernet']",
        "mgmt_hardware_address" : "//table//tr//code[text()='Management']//ancestor::tr//td[4]//code",
        "mgmt_link_status" : "//table//tr//code[text()='Management']//ancestor::tr//strong[text()='-']"
    }
}

export const events = {
    "_active" : {
        "Events" : "//h2[@class='page-title'][text()='Events']",
        "tableHeader" : "//div[contains(@class, 'eventList')]//div[contains(@class, 'ant-table-header')]//table"
    },
    "_verify" : {
        "row1Status" : "//div[contains(@class, 'eventList')]//div[@class='ant-table-body']//tr[1]//strong[text()='REBOOTED' or text()='ALIVE' or text()='UNREACHABLE']",
        "row2Status" : "//div[contains(@class, 'eventList')]//div[@class='ant-table-body']//tr[2]//strong[text()='REBOOTED' or text()='ALIVE' or text()='UNREACHABLE']",
        "row3Status" : "//div[contains(@class, 'eventList')]//div[@class='ant-table-body']//tr[3]//strong[text()='REBOOTED' or text()='ALIVE' or text()='UNREACHABLE']"
    },
    "h2" : {
        "pageTitle" : "//h2[@class='page-title'][text()='Events']",
        "_count" : 1
    },
    "div" : {
        "filterBySource" : "//div[@class='ant-select-selection__placeholder'][text()='Filter by Source']",
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'eventList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'eventList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'eventList')]//div[@class='ant-table-body']//tr"
    },
    "span" : {
        "theadTime" : "//thead[@class='ant-table-thead']//th[2]//span[@class='ant-table-column-title'][text()='Time']",
        "theadSource" : "//thead[@class='ant-table-thead']//th[3]//span[@class='ant-table-column-title'][text()='Source']",
        "theadEventType" : "//thead[@class='ant-table-thead']//th[4]//span[@class='ant-table-column-title'][text()='Event Type']",
        "theadStatus" : "//thead[@class='ant-table-thead']//th[5]//span[@class='ant-table-column-title'][text()='Status']",
        "eventsCount" : "//span[@class='number-circle']//strong"
    },
    "input" : {
        "startDate" : "//input[@placeholder='Start Date' and @class='ant-calendar-picker-input ant-input']",
        "endDate" : "//input[@placeholder='End Date' and @class='ant-calendar-picker-input ant-input']"
    },
    "i" : {
        "startDateCalendar" : "//input[@placeholder='Start Date' and @class='ant-calendar-picker-input ant-input']//following-sibling::i[@class='anticon anticon-calendar ant-calendar-picker-icon']",
        "endDateCalendar" : "//input[@placeholder='End Date' and @class='ant-calendar-picker-input ant-input']//following-sibling::i[@class='anticon anticon-calendar ant-calendar-picker-icon']"
    },
    "button" : {
        "applyFilters" : "//div//button[@title='Apply Filters']",
        "refreshEvents" : "//div//button[@title='Refresh Events']"
    },
    "a" : {
        "breadcrumb" : "//div[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='Events']"
    }
}

export const apiKeys = {
    "_active" : {
        "apiKeys" : "//h2[@class='page-title'][text()='API Keys']",
        "tableHeader" : "//div[contains(@class, 'userApiList')]//div[contains(@class, 'ant-table-header')]//table"
    },
    "h2" : {
        "pageTitle" : "//h2[@class='page-title'][text()='API Keys']",
        "_count" : 1
    },
    "div" : {
        "tableHeader" : "//div[contains(@class, 'userApiList')]//thead[@class='ant-table-thead']",
        "tableBody" : "//div[contains(@class, 'userApiList')]//tbody[@class='ant-table-tbody']",
        "tableBodyRows" : "//div[contains(@class, 'userApiList')]//tbody[@class='ant-table-tbody']//tr"
    },
    "span" : {
        "theadCheckbox" : "//div[contains(@class, 'userApiList')]//thead[@class='ant-table-thead']//th[2]//span[@class='ant-checkbox']",
        "theadName" : "//thead[@class='ant-table-thead']//th[3][text()='Name']",
        "theadKey" : "//thead[@class='ant-table-thead']//th[4][text()='Key']",
        "theadCreated" : "//thead[@class='ant-table-thead']//th[5]//span[@class='ant-table-column-title'][text()='Created']",
        "theadLastUsed" : "//thead[@class='ant-table-thead']//th[6]//span[@class='ant-table-column-title'][text()='Last Used']",
        "theadExpiry" : "//thead[@class='ant-table-thead']//th[7]//span[@class='ant-table-column-title'][text()='Expiry']"
    },
    "i" : {
        "upCreated" : "//div[@class='ant-table-wrapper userApiList']//thead[@class='ant-table-thead']//th[5]//span[@class='anticon anticon-caret-up ant-table-column-sorter-up']",
        "downCreated" : "//div[contains(@class, 'userApiList')]//thead[@class='ant-table-thead']//th[5]//span[@class='anticon anticon-caret-down ant-table-column-sorter-down']",
        "upLastUsed" : "//div[@class='ant-table-wrapper userApiList']//thead[@class='ant-table-thead']//th[6]//span[@class='anticon anticon-caret-up ant-table-column-sorter-up']",
        "downLastUsed" : "//div[contains(@class, 'userApiList')]//thead[@class='ant-table-thead']//th[6]//span[@class='anticon anticon-caret-down ant-table-column-sorter-down']",
        "upExpiry" : "//div[contains(@class, 'userApiList')]//thead[@class='ant-table-thead']//th[7]//span[@class='anticon anticon-caret-up ant-table-column-sorter-up']",
        "downExpiry" : "//div[contains(@class, 'userApiList')]//thead[@class='ant-table-thead']//th[7]//span[@class='anticon anticon-caret-down ant-table-column-sorter-down']"
    },
    "button" : {
        "addApiKey" : "//div[contains(@style,'justify-content: flex-end')]//button//span[text()='Add API Key']",
        "deleteApiKey" : "//div[contains(@style,'justify-content: flex-end')]//button[@title='Delete API Key']"
    },
    "a" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='API Keys']",
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    }
}

export const sshKeys = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "tableHeader" : "//div[contains(@class, 'CertificateList')]//thead[@class='ant-table-thead']",
        "tableBody" : "//div[contains(@class, 'CertificateList')]//tbody[@class='ant-table-tbody']",
        "tableBodyRows" : "//div[contains(@class, 'CertificateList')]//tbody[@class='ant-table-tbody']//tr[not(contains(@aria-hidden, 'true'))]"
    },
    "span" : {
        "theadCheckbox" : "//div[contains(@class, 'CertificateList')]//thead[@class='ant-table-thead']//th[2]//span[@class='ant-checkbox']",
        "theadKeyName" : "//div[@class='ant-table-wrapper CertificateList']//thead[@class='ant-table-thead']//th[3]//span[text()='Key Name']"
    },
    "label" : {
        "childOrg" : "//label[@class='ant-checkbox-wrapper ant-checkbox-wrapper-disabled']//span[@class='ant-checkbox ant-checkbox-disabled']",
    },
    "input" : {
        "filter" : "//input[@placeholder='Filter SSH Keys']"
    },
    "button" : {
        "addSSHKey" : "//input[@placeholder='Filter SSH Keys']//ancestor::div[1]//following-sibling::div//button[@title='Add SSH Key']",
        "deleteSSHKey" : "//input[@placeholder='Filter SSH Keys']//ancestor::div[1]//following-sibling::div//button[@title='Delete SSH Key']"
    },
    "a" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='SSH Keys']",
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    },
    _delete_modal : {
        "delete" : "//div[@class='ant-modal-header']//span[text()=' Delete SSH Key']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()=' Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()=' Delete SSH Key']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    }
}

export const downloadSoftware = {
    button : {
        sortByDate : "//button[span='Sort By Date']"
    },
    input : {
        filter : "//input[@placeholder='Filter by version']"
    },
    div :{
        releaseCard: "//div[contains(@class, 'releases-card')]",
        releaseCardHead : "//div[contains(@class, 'releases-card')]/div[@class='ant-card-head']",
        releaseCardBody : "//div[contains(@class, 'releases-card')]/div[@class='ant-card-body']",
        latestReleaseCard : "//div/*[text()='latest']//ancestor::div[contains(@class, 'releases-card')]",
        latestReleaseCardHead : "//div/*[text()='latest']//ancestor::div[@class='ant-card-head']",
        latestReleaseCardBody : "//div/*[text()='latest']//ancestor::div[@class='ant-card-head']//following-sibling::div[@class='ant-card-body']",
        _latestOva : "//div[span='nodeos_production_image.ova.bz2']",
        _latestAzureLauncher : "//div[starts-with(span,'ioTium Azure iNode Launcher')]",
        modifiedDate : "//div[@class='releases_last_modified_date'][span]"
    },
    svg : {
        downloadIcon : "//span[@class='releases_download_icon']//*[name()='svg'][@type='FaDownload']"
    },

}

export const downloadEvents = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title'][text()='Download Events']",
        "_count" : 1
    },
    "div" : {
        "filterBySource" : "//div[@class='ant-select-selection__placeholder'][text()='Filter by Source']",
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'inodeList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr",
        "filterBySource" : "//div[@class='ant-card download-top-pane']//span[@class='ant-select-selection-placeholder'][text()='Filter by Source']",
        "expandRow" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr[2]//button[@class='ant-table-row-expand-icon ant-table-row-expand-icon-collapsed']",
        "checkboxRow" : "//div[@class='ant-table-body']//input[@type='checkbox']",
        "statusRow" : "//div[contains(@class, 'inodeList')]//th[@class='ant-table-cell'][text()='Status']"
    },
    "span" : {
        "theadCheckbox" : "//div[contains(@class, 'inodeList')]//thead[@class='ant-table-thead']//th[2]//span[@class='ant-checkbox']",
        "theadCreatedOn" : "//div[contains(@class, 'inodeList')]//th[@class='ant-table-cell']//span[text()='Created on']",
        "theadStatus" : "//div[contains(@class, 'inodeList')]//thead[@class='ant-table-thead']//th[4][text()='Status']",
        "requestEventReport" : "//div[@class='ant-card download-top-pane']//strong[@class='download-top-pane-input'][text()='Request Event Report:']",
        "infoRequestReport" : "//div[@class='ant-popover-content']//span[@class='help-content'][text()='Your report is limited to a maximum of 10,000 records. The report will typically be available within a few minutes after your request, depending on the size of your data.']",
        "infoCratedOn" : "//div[@class='ant-popover-content']//span[@class='help-content'][text()='Your reports are automatically deleted after 24 hours and no longer available for download.']"
    },
    "input" : {
        "filterByOrg" : "//div[@class='ant-select-selector']//span[@class='ant-select-selection-placeholder'][text()='Filter by Org / iNode / Cluster']",
        "startDate" : "//div[@class='ant-picker-input']//input[@placeholder='Start Date']",
        "endDate" : "//div[@class='ant-picker-input']//input[@placeholder='End Date']"
    },
    "i" : {
        "startDateCalendar" : "//div[@class='ant-picker-input']//input[@placeholder='Start Date']",
        "endDateCalendar" : "//div[@class='ant-picker-input']//input[@placeholder='End Date']"
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a",
        "breadcrumb" : "//nav[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='Download Events']"
    },
    "button" : {
        "requestReport" : "//div[@class='ant-card download-top-pane']//button[@title='Request Report']",
        "_cancelRequest" : "//div[@class='action-btn ']//button[@title='Cancel Request']",
        "infoRequestReport" : "//div[@class='ant-card download-top-pane']//button[@class='ant-btn ant-btn-circle ant-btn-default popover-help-button']",
        "infoCreatedOn" : "//thead[@class='ant-table-thead']//button[@class='ant-btn ant-btn-circle ant-btn-default popover-help-button']",
        "_deleteReports" : "//span[@style='float: right;']//button[@title='Delete Report(s)']",
        "downloadReport" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr//button[@title='Download Report']",
        "deleteReport" : "//div[@class='ant-table-body']//button[@title='Delete Report']",
        "downloadReportFirst" : "(//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr//button[@title='Download Report'])[1]",
        "deleteReportFirst" : "(//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr//button[@title='Delete Report'])[1]",
        "_yesDeleteReport" : "//span[text()=' Yes - Delete Report']",
        "_noKeepReport" : "//button//span[text()='No - Keep Report']",
        "_yesCancelRequest" : "//button//span[text()=' Yes - Cancel Request']",
        "_noProcessRequest" : "//button//span[text()='No - Process Request']",
    },
    "li" : {
        "_filterBySourceInode" : "//li[text()='iNode']",
        "_filterBySourceNetwork" : "//li[text()='Network']",
        "_filterBySourceService" : "//li[text()='Service']",
        "_ilterBySourceWebhook" : "//li[text()='Webhook']"
    }
}

export const downloadActivity = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title'][text()='Download Activity']",
        "_count" : 1
    },
    "div" : {
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'inodeList')]//div[contains(@class, 'ant-table-header')]//table",
        "tableBody" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//table",
        "tableBodyRows" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr",
        "expandRow" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//button[@class='ant-table-row-expand-icon ant-table-row-expand-icon-collapsed']",
        "checkboxRow" : "//div[@class='ant-table-body']//input[@type='checkbox']",
        "statusRow" : "//div[@class='ant-table-body']//td[@class='ant-table-cell']//strong[text()='COMPLETED']"  
    },
    "span" : {
        "theadCheckbox" : "//div[contains(@class, 'inodeList')]//thead[@class='ant-table-thead']//th[2]//span[@class='ant-checkbox']",
        "theadCreatedOn" : "//thead[@class='ant-table-thead']//th[@class='ant-table-cell']//span[text()='Created on']",
        "theadStatus" : "//thead[@class='ant-table-thead']//th[@class='ant-table-cell'][text()='Status']",
        "requestEventReport" : "//div[@class='ant-card download-top-pane']//strong[text()='Request Activity Report:']",
        "infoRequestReport" : "//div[@class='ant-popover-content']//span[@class='help-content'][text()='Your report is limited to a maximum of 10,000 records. The report will typically be available within a few minutes after your request, depending on the size of your data.']",
        "infoCratedOn" : "//div[@class='ant-popover-content']//span[@class='help-content'][text()='Your reports are automatically deleted after 24 hours and no longer available for download.']"
    },
    "input" : {
        "filterByOrg" : "//span[@class='ant-select-selection-placeholder'='Filter by organization']",   
        "startDate" : "//div[@class='ant-picker-input']//input[@placeholder='Start Date']",
        "endDate" : "//div[@class='ant-picker-input']//input[@placeholder='End Date']"
        //input[@placeholder='End Date' and @class='ant-calendar-picker-input ant-input']
    },
    "i" : {
        "startDateCalendar" : "//div[@class='ant-picker-input']//input[@placeholder='Start Date']",
        "endDateCalendar" : "//div[@class='ant-picker-input']//input[@placeholder='End Date']" 
        //following-sibling::i[@class='anticon anticon-calendar ant-calendar-picker-icon']
        //following-sibling::i[@class='anticon anticon-calendar ant-calendar-picker-icon']
    },
    "a" : {
        "expandAll": "//span[text()='Expand All']//ancestor::a",
        "breadcrumb" : "//nav[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='Download Activity']",
        //"endDateNow" : "//input[@placeholder='End Date' and @class='ant-calendar-input ']//ancestor::div[@class='ant-calendar-input-wrap']//following-sibling::div//a[text()='Now']"
    },
    "button" : {
        "requestReport" : "//div[@class='ant-card download-top-pane']//button[@title='Request Report']",
        "_cancelRequest" : "//div[@class='action-btn ']//button[@title='Cancel Request']",
        "infoRequestReport" : "//div[@class='ant-card download-top-pane']//button[@class='ant-btn ant-btn-circle ant-btn-default popover-help-button']",
        "infoCreatedOn" : "//thead[@class='ant-table-thead']//span[text()='Created on']//button[@class='ant-btn ant-btn-circle ant-btn-default popover-help-button']",
        "_deleteReports" : "//span[@style='float: right;']//button[@title='Delete Report(s)']",
        "downloadReport" : "//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr//button[@title='Download Report']",
        "deleteReport" : "//div[@class='ant-table-body']//button[@title='Delete Report']",
        "downloadReportFirst" : "(//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr//button[@title='Download Report'])[1]",
        "deleteReportFirst" : "(//div[contains(@class, 'inodeList')]//div[@class='ant-table-body']//tr//button[@title='Delete Report'])[1]",
        "_yesDeleteReport" : "//button//span[text()=' Yes - Delete Report']",
        "_noKeepReport" : "//button//span[text()='No - Keep Report']",
        "_yesCancelRequest" : "//button//span[text()=' Yes - Cancel Request']",
        "_noProcessRequest" : "//button//span[text()='No - Process Request']"
    }
}

export const manageAlerts = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title'][text()='Manage Alerts']",
        "_count" : 1
    },
    "div" : {
        "scrollbar" : "//div[@tabindex='-1']",
        "tableHeader" : "//div[contains(@class, 'alertList')]//thead[@class='ant-table-thead']",
        "tableBody" : "//div[contains(@class, 'alertList')]//tbody[@class='ant-table-tbody']",
        "tableBodyRows" : "//div[contains(@class, 'alertList')]//tbody[@class='ant-table-tbody']//tr",
        "expandRow" : "//button[@class='ant-table-row-expand-icon ant-table-row-expand-icon-collapsed']"
    },
    "span" : {
        "theadAlertName" : "//div[@class='ant-table-header']//th[@class='ant-table-cell' and text()='Alert Name']",
        "theadCondition" : "//div[@class='ant-table-header']//th[@class='ant-table-cell' and text()='Condition']",
        "theadTarget"    : "//div[@class='ant-table-header']//th[@class='ant-table-cell' and text()='Target']",
        "theadNotification" : "//div[@class='ant-table-header']//th[@class='ant-table-cell' and text()='Notification']"
    },
    "button" : {
        "addAlert" : "//button[@title='Add Alert']",
        "dropDownTrigger" : "//div[contains(@class, 'alertList')]//button[contains(@class,'ant-dropdown-trigger')]",
        "deleteAlert" : "//div[not(contains(@class,'ant-dropdown-hidden'))][contains(@class,'ant-dropdown')]//button[@title='Delete Alert']",
        "editAlert" : "//div[not(contains(@class,'ant-dropdown-hidden'))][contains(@class,'ant-dropdown')]//button[@title='Edit Alert']"
    },
    "a" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='Manage Alerts']",
        "expandAll": "//span[text()='Expand All']//ancestor::a"
    },
    "i" : {
        "mail" : "//td[@class='ant-table-cell']//span[@class='anticon anticon-mail alert-type-medium-icon']",
        "global" : "//tbody[@class='ant-table-tbody']//td[@class='ant-table-cell']//button[@class='ant-btn ant-btn-default ant-dropdown-trigger']"
    },
    "_delete_modal" : {
        "delete" : "//div[@class='ant-modal-header']//span[text()='Delete Alert']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()=' Delete']",
        "cancel" : "//div[@class='ant-modal-header']//span[text()='Delete Alert']//ancestor::div[@class='ant-modal-header']//following-sibling::div[@class='ant-modal-footer']//button//span[text()='Cancel']",
        "success" : "//div[@class='ant-message-notice']//div[@class='ant-message-custom-content ant-message-success']//span[text()='Deleted successfully']"
    }
}

export const myProfile = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title'][text()='My Profile']",
        "_count" : 1
    },
    "img" : {
        "user" : "//span[@class='ant-avatar ant-avatar-lg ant-avatar-round ant-avatar-image']//img[@src='/static/media/user_img.png']"
    },
    "div" : {
        "username" : "//div[@class='my-profile-container']//strong",
        "fullName" : "//div[@class='ant-row']//div[contains(@class,'ant-col ant-col-8')]//div[1]//strong[text()='Full Name']",
        "emailAddress" : "//div[@class='ant-row']//div[contains(@class,'ant-col ant-col-8')]//div[2]//strong[text()='Email Address']",
        "role" : "//div[@class='ant-row']//div[contains(@class,'ant-col ant-col-8')]//div[3]//strong[text()='Role']",
        "password" : "//div[@class='ant-row']//div[contains(@class,'ant-col ant-col-8')]//div[4]//strong[text()='Password']",
        "organization" : "//div[@class='ant-row']//div[contains(@class,'ant-col ant-col-8')]//div[5]//strong[text()='Organization']",
        "timeZone" : "//div[@class='ant-row']//div[contains(@class,'ant-col ant-col-8')]//div[6]//strong[text()='Time Zone']",
        "twoFactor" : "//div[@class='ant-row']//div[contains(@class,'ant-col ant-col-8')]//div[7]//strong[text()='Two-Factor Authentication']"
    },
    "span" : {
        "changePassword" : "//div[@class='my-profile-container']//following-sibling::div[@class='ant-row']//div[@class='ant-col']//a//span[text()='Change Password']",
        "lastLogin" : "//div[@class='myprofile-divider']//following-sibling::div//div[1]//span[text()='Last Login']",
        "passwordExpiry" : "//div[@class='myprofile-divider']//following-sibling::div//div[2]//span[text()='Password Expiry']",
        "sessionExpiry" : "//div[@class='myprofile-divider']//following-sibling::div//div[3]//a//span[text()='Session Details']"        
    },
    "button" : {
        "activate" : "//button[@class='ant-btn ant-btn-default ant-btn-sm']//span[text()='Enroll']",
        "infoTwoFactor" : "//button[@class='ant-btn ant-btn-default ant-btn-sm']//span[text()='Enroll']//ancestor::button//following-sibling::button[@class='ant-btn ant-btn-circle ant-btn-default popover-help-button']"
    },
    "a" : {
        "breadcrumb" : "//nav[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='My Profile']"
    }
}

export const iNodeLogs = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "timezone" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//div[@class='ant-select-selection__placeholder' and text()='Select timezone']"
    },
    "span" : {
        "title" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-head-title']//span[text()='iNode Logs']",
        "filterByText" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//input[@placeholder='Filter by text']"
    },
    "button" : {
        "darkLight" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//button[@class='ant-btn log-tgle-mode-dark ant-btn-circle ant-btn-sm']",
        "newLogs" : "//div[@class='ant-card-body']//button[@class='ant-btn _IOT_LOG_NEW_BUTTON log-newest-btn ant-btn-primary ant-btn-circle ant-btn-icon-only']",
        "oldLogs" : "//div[@class='ant-card-body']//button[@class='ant-btn _IOT_LOG_OLD_BUTTON log-oldest-btn ant-btn-primary ant-btn-circle ant-btn-icon-only']",
        "refresh" : "//div[@class='ant-card-body']//button[@class='ant-btn ant-btn-primary']//span[text()='Refresh']",
        "cancel" : "//div[@class='ant-card-body']//button[@class='ant-btn log-footer-btn-style']//span[text()='Cancel']",
        "downloadLogs" : "//div[@class='ant-card-body']//button[@class='ant-btn log-footer-btn-style']//span[text()='Download Logs']"
    },
    "a" : {
        "breadcrumb" : "//div[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='iNode Logs']"
    },
    "i" : {
        "search" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//i[@class='anticon anticon-search']"
    }
}

export const serviceLogs = {
    "h2" : {
        "pageTitle" : "//h2[@class='page-title']",
        "_count" : 1
    },
    "div" : {
        "timezone" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//div[@class='ant-select-selection__placeholder' and text()='Select timezone']"
    },
    "span" : {
        "title" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-head-title']//span[text()='Service Logs']",
        "filterByText" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//input[@placeholder='Filter by text']"
    },
    "button" : {
        "darkLight" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//button[@class='ant-btn log-tgle-mode-dark ant-btn-circle ant-btn-sm']",
        "newLogs" : "//div[@class='ant-card-body']//button[@class='ant-btn _IOT_LOG_NEW_BUTTON log-newest-btn ant-btn-primary ant-btn-circle ant-btn-icon-only']",
        "oldLogs" : "//div[@class='ant-card-body']//button[@class='ant-btn _IOT_LOG_OLD_BUTTON log-oldest-btn ant-btn-primary ant-btn-circle ant-btn-icon-only']",
        "refresh" : "//div[@class='ant-card-body']//button[@class='ant-btn ant-btn-primary']//span[text()='Refresh']",
        "cancel" : "//div[@class='ant-card-body']//button[@class='ant-btn log-footer-btn-style']//span[text()='Cancel']",
        "downloadLogs" : "//div[@class='ant-card-body']//button[@class='ant-btn log-footer-btn-style']//span[text()='Download Logs']"
    },
    "a" : {
        "breadcrumb" : "//div[@class='ant-breadcrumb']//span[@class='ant-breadcrumb-link']//a[text()='Service Logs']"
    },
    "i" : {
        "search" : "//div[@class='ant-card-head-wrapper']//div[@class='ant-card-extra']//i[@class='anticon anticon-search']"
    }
}

export const addOrg = {
    "input" : {
        "name" : "//input[@id='name' and @placeholder='Organization Name']",
        "billing_name" : "//input[@id='billing_name' and @placeholder='Billing Name']",
        "billing_email" : "//input[@id='billing_email' and @placeholder='Billing Email address']",
        "domain_name" : "//input[@id='domain_name' and @placeholder='Domain Name']"
    },
    "div" : {
        "timezone" : "//div[text()='Time Zone']"
    },
    "button" : {
        "addOrg" : "//button[@class='ant-btn ant-btn-primary']//span[contains(text(),'Add Org')]",
        "cancel" : "//button[@class='ant-btn']//span[contains(text(),'Cancel')]"
    },
    "_errors" : {
        "i" : {
            "closeCircle" : "//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "orgName" : {
            "specialCharacters" : "//input[@placeholder='Organization Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Organization name may contain only the special characters . , & - _']",
            "length" : "//input[@placeholder='Organization Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Organization name cannot be longer than 255 characters.']",
            "empty" : "//input[@placeholder='Organization Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your organization name.']"
        },
        "billingName" : {
            "specialCharacters" : "//input[@placeholder='Billing Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Billing name may contain only the special characters . , & - _']",
            "length" : "//input[@placeholder='Billing Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Billing name cannot be longer than 255 characters.']",
            "empty" : "//input[@placeholder='Billing Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your billing name.']"
        },
        "billingEmail" : {
            "length" : "//input[@placeholder='Billing Email address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Organization name cannot be longer than 255 characters.']",
            "empty" : "//input[@placeholder='Billing Email address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your billing email.']",
            "invalidEmail" : "//input[@placeholder='Billing Email address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter a valid email address.']"
        },
        "domainName" : {
            "length" : "//input[@placeholder='Domain Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Domain name cannot be longer than 253 characters.']",
            "invalidDomain" : "//input[@placeholder='Domain Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter a valid domain name.']"
        }
    }
}

export const addUserForm = {
    "input" : {
        "name" : "//input[@id='name' and @placeholder='Full Name']",
        "email" : "//input[@id='email' and @placeholder='Email Address']",
        "password" : "//input[@id='password' and @placeholder='Password']",
        "confirm_password" : "//input[@id='confirm_password' and @placeholder='Confirm Password']"
    },
    "div" : {
        "role" : "//div[text()='Select Role']",
        "timezone" : "//div[text()='Org default time zone']"
    },
    "button" : {
        "addUser" : "//button[@class='ant-btn ant-btn-primary']//span[contains(text(),'Add User')]",
        "cancel" : "//button[@class='ant-btn']//span[contains(text(),'Cancel')]"
    },
    "_errors" : {
        "name" : {
            "specialCharacters" : "//input[@placeholder='Full Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Full name must not contain any special characters.']",
            "empty" : "//input[@placeholder='Full Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your full name.']",
            "length" : "//input[@placeholder='Full Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Full name cannot be longer than 255 characters.']",
            "closeCircleIcon" : "//input[@placeholder='Full Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "emailAddress" : {
            "length" : "//input[@placeholder='Email Address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your email address.']",
            "empty" : "//input[@placeholder='Email Address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your email address.']",
            "invalidEmail" : "//input[@placeholder='Email Address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your email address.']",
            "closeCircleIcon" : "//input[@placeholder='Email Address']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "password": {
            "all" : "//input[@placeholder='Password']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Password must at least be 12 characters long, contain at least one upper case alphabet, at least one number, and at least one special character. The only special characters allowed are ! @ # $ & * _']",
            "specialCharacters" : "//input[@placeholder='Password']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Password must at least one special character. The only special characters allowed are ! @ # $ & * _']",
            "length" : "//input[@placeholder='Password']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Password must at least be 12 characters long']",
            "number" : "//input[@placeholder='Password']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Password must at least one number']",
            "upperCase" : "//input[@placeholder='Password']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Password must contain at least one upper case alphabet']" 
        },
        "confirmPassword": {
            "notMatching" : "//input[@placeholder='Confirm Password']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Confirm Password does not match the password']"
        },
        "role" : {
            "notFound" : "//li[@unselectable='on' and @class='ant-select-dropdown-menu-item ant-select-dropdown-menu-item-disabled' and text()='Not found']"
        },
        "timezone" : {
            "notFound" : "//li[@unselectable='on' and @class='ant-select-dropdown-menu-item ant-select-dropdown-menu-item-disabled' and text()='Not Found']"
        }
    }
}

export const changePasswordForm = {
    "input" : {
        "old_password" : "//input[@id='old_password']",
        "new_password" : "//input[@id='confirm_password' and @placeholder='New Password']",
        "confirm_password" : "//input[@id='new_password' and @placeholder='Confirm Password']"
    },
    "button" : {
        "change" : "//button[contains(@class,'ant-btn ant-btn-primary')]//span[contains(text(),'Change')]",
        "cancel" : "//button[contains(@class,'ant-btn')]//span[contains(text(),'Cancel')]"
    },
    "b" : {
        "title" : "//b[text()='You must change your password on first login.']"
    }
}

export const userChangePasswordModal = {
    "input" : {
        "old_password" : "//input[@id='old_password']",
        "new_password" : "//input[@id='confirm_password' and @placeholder='New Password']",
        "confirm_password" : "//input[@id='new_password' and @placeholder='Confirm Password']"
    },
    "button" : {
        "change" : "//button[contains(@class,'ant-btn ant-btn-primary')]//span[contains(text(),'Change')]",
        "cancel" : "//button[contains(@class,'ant-btn')]//span[contains(text(),'Cancel')]"
    },
    "span" : {
        sameAsOldPassword : "//div[@class='ant-message-custom-content ant-message-error']//span[text()='The new password should not be same as old password']",
        sameAsLast3Passwords : "//div[@class='ant-message-custom-content ant-message-error']//span[text()='The new password should not be similar to the last three passwords']",
        success : "//div[@class='ant-message-custom-content ant-message-success']//span[text()='Password changed successfully']"
    }
}

export const addiNodeForm = {
    "input" : {
        "name" : "//input[@id='name' and @placeholder='iNode Name']",
        "labelKey" : "//div[@class='ant-select-selection__placeholder' and text()='Key']//ancestor::div[@class='ant-select-selection__rendered']//input",
        "labelValue" : "//input[@placeholder='Value']"
    },
    "div" : {
        "profile" : "//div[text()='Select Profile']",
        "serialNumber" : "//div[text()='Select Serial Number']",
        "sshKey" : "//div[text()='Select SSH Key']"
    },
    "button" : {
        "label" : "//button//span[text()='+ New Label']",
        "aws" : "//div[@id='cloud_config']//button[1]",
        "azure" : "//div[@id='cloud_config']//button[2]",
        "vmware" : "//div[@id='cloud_config']//button[3]",
        "addiNode" : "//button[@class='ant-btn ant-btn-primary']//span[contains(text(),'Add iNode')]",
        "cancel" : "//button[@class='ant-btn']//span[contains(text(),'Cancel')]"
    },
    "_errors" : {
        "iNodeName" : {
            "specialCharacters" : "//input[@placeholder='iNode Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='iNode name may contain only the special characters . , & - _\"']",
            "length" : "//input[@placeholder='iNode Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='iNode name cannot be longer than 255 characters.']",
            "empty" : "//input[@placeholder='iNode Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter your iNode name.']",
            "closeCircleIcon" : "//input[@placeholder='iNode Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "label" : {
            "commonError" : "//span[text()='Label :']//ancestor::div[@class='ant-col ant-form-item-label']//following-sibling::div//p[text()='Key/value must be 63 characters or less, start and end with an alphanumeric character, and consist of alphanumeric, dash ( - ), underscore ( _ ), or dot ( . ) characters.']"
        },
        "serialNumber" : {
            "notFound" : "//li[@unselectable='on' and @class='ant-select-dropdown-menu-item ant-select-dropdown-menu-item-disabled' and text()='Not Found']"
        },
        "sshKey" : {
            "notFound" : "//li[@unselectable='on' and @class='ant-select-dropdown-menu-item ant-select-dropdown-menu-item-disabled' and text()='Not Found']"
        }
    }
}

export const addNetwork = {
    "input" : {
        "name" : "//input[@id='name' and @placeholder='Name']",
        "labelKey" : "//div[@class='ant-select-selection__placeholder' and text()='Key']//ancestor::div[@class='ant-select-selection__rendered']//input",
        "labelValue" : "//input[@placeholder='Value']",
        "networkCidrIP" : "//span[text()='Network CIDR']//ancestor::div[contains(@class,'ant-row ant-form-item')]//input[@placeholder='IP Address']",
        "networkCidrLength" : "//span[text()='Network CIDR']//ancestor::div[contains(@class,'ant-row ant-form-item')]//input[@placeholder='Mask Length']",
        "startIP" : "//input[@placeholder='Start IP Address']",
        "endIP" : "//input[@placeholder='End IP Address']",
        "iNodeIPAddress" : "//span[text()='iNode IP Address']//ancestor::div[@class='ant-col ant-col-8 ant-form-item-label']//following-sibling::div//input[@placeholder='IP Address']",
        "vlanId" : "//input[@placeholder='VLAN ID' and @class='ant-input']",
        "staticRouteIP" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='IP Address']",
        "staticRouteLength" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='Mask Length']",
        "staticRouteViaIP" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='Route to Destination Network Via' and @class='ant-input']",
        "defaultDestinationViaIP" : "//span[text()='Default Destination']//ancestor::div[@class='ant-row ant-form-item']//input[@placeholder='Route to Destination Network Via']"
    },
    "i" : {
        "staticRouteViaDown" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='Route to Destination Network Via']//following-sibling::i[@aria-label='icon: down']",
        "defaultDesinationDown" : "//span[text()='Default Destination']//ancestor::div[@class='ant-row ant-form-item']//span[@id='via_default']//i[@aria-label='icon: down']"
    },
    "li" : {
        "specifyIPAddress" : "//li[text()='Specify IP Address']",
        "wanNetwork" : "//li[text()='WAN Network']",
        "none" : "//li[text()='None']"
    },
    "div" : {
        "staticRoutes" : "//div[@class='panel-header-text' and text()='Static Routes']",
        "staticRoutesExpanded" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']",
        "security" : "//div[@class='ant-collapse-header' and @role='button']//div[text()='Security']",
        "selectCSP" : "//div[text()='Select Custom Security Policy']"
    },
    "span" : {
        "networkAddrStatic" : "//div[@id='network_type']//span[text()='Static']",
        "networkAddrDynamic" : "//div[@id='network_type']//span[text()='Dynamic']",
        "vlanEnabled" : "//div[@id='vlan_enabled']//span[text()='Enabled']",
        "vlanDisabled" : "//div[@id='vlan_enabled']//span[text()='Disabled']",
        "defaultDestination" : "//span[@id='via_default']"
    },
    "button" : {
        "label" : "//button//span[text()='+ New Label']",
        "addStaticRoute" : "//div[@class='ant-collapse-content ant-collapse-content-active']//button[@title='Add static route']",
        "save" : "//button[@class='ant-btn ant-btn-primary']//span[contains(text(),'Save')]",
        "cancel" : "//button[@class='ant-btn']//span[contains(text(),'Cancel')]",
        "update" : "//button[contains(@class,'ant-btn-primary')]//span[text()='Update']"
    },
    "_errors" : {
        "name" : {
            "specialCharacters" : "//input[@placeholder='Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Network name may contain only the special characters . - _']",
            "length" : "//input[@placeholder='Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Network name cannot be longer than 255 characters.']",
            "empty" : "//input[@placeholder='Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter a network name.']",
            "closeCircleIcon" : "//input[@placeholder='Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "label" : {
            "commonError" : "//span[text()='Label :']//ancestor::div[@class='ant-col ant-col-8 ant-form-item-label']//following-sibling::div//p[text()='Key/value must be 63 characters or less, start and end with an alphanumeric character, and consist of alphanumeric, dash ( - ), underscore ( _ ), or dot ( . ) characters.']"
        },
        "networkCidr" : {
            "invalid" : "//input[@placeholder='IP Address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='The specified CIDR is invalid. Please provide a valid CIDR.']",
            "reserved" : "//input[@placeholder='IP Address']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='The specified CIDR conflicts with specialized IP address blocks reserved by the IANA.']",
            "closeCircleIcon" : "//input[@placeholder='IP Address']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "reservedIPRange" : {
            "notSameIPsubnet" : "//p[@class='reserved-range-error' and contains(text(),'Please enter an address within the same IP subnet as the network CIDR')]",
            "invalid" : "//p[@class='reserved-range-error' and text()='Please enter a valid IP address.']",
            "startIPGreater" : "//p[@class='reserved-range-error' and text()='Start IP Address cannot be greater than the End IP Address.']",
            "closeCircleIcon" : "//input[@placeholder='End IP Address']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "iNodeIPAddress" : {
            "notSameIPsubnet" : "//span[text()='iNode IP Address']//ancestor::div[@class='ant-row ant-form-item ant-form-item-with-help tan_interface_ip']//div[contains(text(),'Please enter an address within the same IP subnet as the network CIDR')]",
            "invalid" : "//span[text()='iNode IP Address']//ancestor::div[@class='ant-row ant-form-item ant-form-item-with-help tan_interface_ip']//div[contains(text(),'The specified CIDR is invalid. Please provide a valid CIDR.')]",
            "closeCircleIcon" : "//input[@placeholder='Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "vlanId" : {
            "invalid" : "//span[text()='VLAN ID']//ancestor::div[@class='ant-row ant-form-item ant-form-item-with-help']//div[text()='The specified VLAN ID is invalid. Please provide a valid VLAN ID.']",
            "empty" : "//span[text()='VLAN ID']//ancestor::div[@class='ant-row ant-form-item ant-form-item-with-help']//div[text()='Please enter a valid VLAN ID']",
            "closeCircleIcon" : "//input[@placeholder='VLAN ID']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "defaultDestination" : {
            "invalid" : "//span[text()='Default Destination']//ancestor::div[@class='ant-row ant-form-item']//div[text()='Please enter a valid IP address.']",
            "notSameIPsubnet" : "//span[text()='Default Destination']//ancestor::div[@class='ant-row ant-form-item']//div[contains(text(),'Please enter ip address within the local network CIDR range')]",
            "closeCircleIcon" : "//span[text()='Default Destination']//ancestor::div[@class='ant-row ant-form-item']//span/i[@aria-label='icon: close-circle-o' and @class='anticon anticon-close-circle-o']"
        },
        "staticRouteDestCIDR" : {
            "invalid" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='IP Address']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='The specified CIDR is invalid. Please provide a valid CIDR.']",
            "reserved" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='IP Address']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='The specified CIDR conflicts with specialized IP address blocks reserved by the IANA.']",
            "closeCircleIcon" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='IP Address']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "staticRouteVia" : {
            "notSameIPsubnet" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='Route to Destination Network Via' and @class='ant-input']//ancestor::div[@class='ant-form-item-control has-error']//div[contains(text(),'Please enter ip address within the local network CIDR range')]",
            "invalid" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='Route to Destination Network Via' and @class='ant-input']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please enter a valid IP address.']",
            "closeCircleIcon" : "//div[@class='panel-header-text' and text()='Static Routes']//ancestor::div[@class='ant-collapse-item ant-collapse-item-active']//input[@placeholder='Route to Destination Network Via' and @class='ant-input']//following-sibling::span[@class='ant-input-group-addon']//i[@aria-label='icon: close-circle-o' and @class='anticon anticon-close-circle-o']"
        }
    }
}

export const addAlertForm = {
    input : {
        alertName : "//input[@placeholder='Alert Name']",
        labelKey : "//div[div='Key']//input",
        labelValue : "//input[@placeholder='Value']",
        durationValue : "//div[label[@for='duration']]//following-sibling::div//input[@role='spinbutton']",
        subScope : "//span[contains(@class,'ant-cascader-picker')]/input",
        emailId:"//input[@type='email'][@placeholder='Enter email address']",
        for : "//span[text()='For']//ancestor::div[contains(@class,'ant-form-item-label')]//following::div[contains(@class,'ant-form-item-control-wrapper')]//input[@class='ant-input-number-input']"
    },
    button : {
        newLabel : "//button[span='+ New Label']",
        next : "//button[@title='Next']",
        previous : "//button[@title='Previous']",
        cancel : "//button[@title='Cancel']",
        save : "//button[@title='Save'][contains(@class,'ant-btn-primary')]"
    },
    div :{
        monitorMetric: "//div[div='Select metric to monitor']",
        durationUnit: "//div[label[@for='duration']]//following-sibling::div//div[@role='combobox'][@aria-autocomplete='list']",
        scope: "//label[span='Scope']//parent::div[contains(@class,'ant-form-item-label')]//following-sibling::div",
        durationUnit: "//span[text()='For']//ancestor::div[contains(@class,'ant-form-item-label')]//following::div[contains(@class,'ant-form-item-control-wrapper')]//div[contains(@class,'ant-select-enabled')]",
        minutesSelected: "//div[@class='ant-select-selection-selected-value' and text()='Minutes']",
        hoursSelected: "//div[@class='ant-select-selection-selected-value' and text()='Hours']",
        daysSelected: "//div[@class='ant-select-selection-selected-value' and text()='Days']",
        selectWebhook : "//div[text()='Select webhook']",
        email : "//span[text()='Notification']//ancestor::div[@class='ant-row ant-form-item']//label[contains(@class,'ant-radio-button-wrapper')]//span[text()='Email']",
        webhook : "//span[text()='Notification']//ancestor::div[@class='ant-row ant-form-item']//label[contains(@class,'ant-radio-button-wrapper')]//span[text()='Webhook']"
    },
    li : {
        minutes: "//li[text()='Minutes']",
        hours: "//li[text()='Hours']",
        days: "//li[text()='Days']"
    },
    span : {
        createSuccess : "//div[@class='ant-message']//span[text()='Alert created successfully']"
    },
    "_errors" : {
        "alertName" : {
            "specialCharacters" : "//input[@placeholder='Alert Name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Alert name may contain only the special characters . , & - _']",
            "length" : "//input[@placeholder='Alert Name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Alert name cannot be longer than 60 characters.']",
            "empty" : "//input[@placeholder='Alert Name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please enter a alert name.']"
        },
        "label" : {
            "commonError" : "//span[text()='Label :']//following::div[contains(@class,'ant-form-item-control-wrapper')]//div//p[text()='Key/value must be 63 characters or less, start and end with an alphanumeric character, and consist of alphanumeric, dash ( - ), underscore ( _ ), or dot ( . ) characters.']"
        },
        "for" : {
            "invalid" : "//span[text()='For']//ancestor::div[contains(@class,'ant-form-item-label')]//following::div[contains(@class,'ant-form-item-control-wrapper')]//div[@class='ant-form-item-control has-error']//div[text()='Invalid input.']"
        }
    }
}

export const addCSPForm = {
    "input" : {
        "name" : "//input[@id='name' and @placeholder='Security policy name']",
        "labelKey" : "//div[@class='ant-select-selection__placeholder' and text()='Key']//ancestor::div[@class='ant-select-selection__rendered']//input",
        "labelValue" : "//input[@placeholder='Value']",
        "priority" : "//input[@placeholder='Priority']",
        "fromNetwork" : "//span[contains(@id,'from_network')]//input[@placeholder='Select Network']",
        "fromNetworkLabel" : "//span[contains(@id,'from_network')]//input[@class='ant-input']",
        "toNetwork" : "//span[contains(@id,'to_network')]//input[@placeholder='Select Network']",
        "toNetworkLabel" : "//span[contains(@id,'to_network')]//input[@class='ant-input']",
        "sourcePort" : "//input[@placeholder='Port' and contains(@id,'source_port')]",
        "destinationPort" : "//input[@placeholder='Port' and contains(@id,'destination_port')]",
        "sourceCIDR" : "//input[@placeholder='CIDR, IP' and contains(@id,'src_ipaddress')]",
        "destinationCIDR" : "//input[@placeholder='CIDR, IP' and contains(@id,'destination_ipaddress')]"
    },
    "button" : {
        "label" : "//button//span[text()='+ New Label']",
        "addCSP" : "//div[@class='ant-modal-footer']//button[contains(@class,'ant-btn-primary')]//span[text()=' Add Custom Security Policy']",
        "cancel" : "//button[@class='ant-btn']//span[text()='Cancel']"
    },
    "div" : {
        "protocol" : "//div[text()='Select protocol']//following-sibling::div[@title='ANY']"
    },
    "li" : {
        "protocol" : {
            "tcp" : "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='TCP']"
        },
        "addLabel" : "//li[text()='Add Label']"
    },
    "_errors" : {
        "name" : {
            "specialCharacters" : "//input[@placeholder='Security policy name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Security policy name may contain only the special characters . , & - _']",
            "length" : "//input[@placeholder='Security policy name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Security policy name cannot be longer than 255 characters.']",
            "empty" : "//input[@placeholder='Security policy name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter security policy name.']",
            "closeCircleIcon" : "//input[@placeholder='Security policy name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "label" : {
            "commonError" : "//span[text()='Label :']//following::div[@class='ant-col ant-form-item-control-wrapper']//div//p[text()='Key/value must be 63 characters or less, start and end with an alphanumeric character, and consist of alphanumeric, dash ( - ), underscore ( _ ), or dot ( . ) characters.']"
        },
        "priority" : {
            "outOfRange" : "//input[@placeholder='Priority']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please specify priority range between 1000 to 10000']",
            "empty" : "//input[@placeholder='Priority']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please specify Priority.']"
        },
        "sourcePort" : {
            "outOfRange" : "//input[@placeholder='Port' and contains(@id,'source_port')]//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please specify port between 0-65535']",
            "invalid" : "//input[@placeholder='Port' and contains(@id,'source_port')]//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Invalid port']" 
        },
        "destinationPort" : {
            "outOfRange" : "//input[@placeholder='Port' and contains(@id,'destination_port')]//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please specify port between 0-65535']",
            "invalid" : "//input[@placeholder='Port' and contains(@id,'destination_port')]//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Invalid port']" 
        },
        "sourceCIDR" : {
            "invalid" : "//input[@placeholder='CIDR, IP' and contains(@id,'src_ipaddress')]//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Invalid CIDR/IPv4 address.']"
        },
        "destinationCIDR" : {
            "invalid" : "//input[@placeholder='CIDR, IP' and contains(@id,'destination_ipaddress')]//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Invalid CIDR/IPv4 address.']"
        }
    }
}

export const addSSHKeyForm = {
    "textarea" : {
        "sshKeyName" : "//textarea[@id='name' and @placeholder='SSH Key Name']",
        "sshPublicKey" : "//textarea[@id='public_key' and @placeholder='Paste a valid SSH (RSA) public key']"
    },
    "button":{
        "addSSHKey" : "//button[@class='ant-btn ant-btn-primary']//span[text()='Add SSH Key']",
        "cancel" : "//button[@class='ant-btn']//span[text()='Cancel']"
    },
    "_errors" : {
        "sshKeyName" : {
            "specialCharacters" : "//textarea[@placeholder='SSH Key Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='SSH key name may contain only the special characters . - _']",
            "length" : "//textarea[@placeholder='SSH Key Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='SSH key name cannot be longer than 255 characters.']",
            "empty" : "//textarea[@placeholder='SSH Key Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please give a name for the SSH Public Key']",
            "closeCircleIcon" : "//textarea[@placeholder='SSH Key Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "sshPublicKey" : {
            "invalid" : "//textarea[@id='public_key']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter a valid SSH public key']"
        }
    }
}

export const addRoleForm = {
    "input" : {
        "roleName" : "//input[@id='name' and @placeholder='Role name']",
        "description" : "//input[@id='description' and @placeholder='Description']"
    },
    "div" : {
        "permissions" : "//div[text()='Select Permissions']"
    },
    "button" : {
        "addRole" :"//button//span[contains(text(),'Add Role')]",
        "cancel" : "//button//span[contains(text(),'Cancel')]"
    },
    "_errors" : {
        "roleName" : {
            "specialCharacters" : "//input[@id='name' and @placeholder='Role name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Role name can contain only the following special characters . , & - _']",
            "length" : "//input[@id='name' and @placeholder='Role name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Role name cannot be longer than 255 characters.']",
            "empty" : "//input[@id='name' and @placeholder='Role name']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Please enter a role name']"
        },
        "description" : {
            "length" : "//input[@id='description' and @placeholder='Description']//ancestor::div[@class='ant-form-item-control has-error']//div[text()='Description cannot be longer than 1000 characters.']"
        },
        "permissions" : {
            "notFound" : "//li[@unselectable='on' and @class='ant-select-dropdown-menu-item ant-select-dropdown-menu-item-disabled' and text()='Not Found']"
        }
    }

}

export const addClusterForm = {
    "input" : {
        "clusterName" : "//input[@id='name' and @placeholder='Name']",
        "labelKey" : "//div[@class='ant-select-selection__placeholder' and text()='Key']//ancestor::div[@class='ant-select-selection__rendered']//input",
        "labelValue" : "//input[@placeholder='Value']",
        "selectInode" : "//input[@title='Select iNode']",
        "priority" : "//span[@title='Priority']//ancestor::div//input[@role='spinbutton']"
    },
    "button" : {
        "label" : "//button//span[text()='+ New Label']",
        "addiNode" : "//button[@title='Add iNode']",
        "save" : "//button[@class='ant-btn ant-btn-primary']//span[text()='Save']",
        "cancel" : "//button[@class='ant-btn']//span[text()='Cancel']"
    },
    "_errors" : {
        "clusterName" : {
            "specialCharacters" : "//input[@placeholder='Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Cluster name may contain only the special characters . - _']",
            "length" : "//input[@placeholder='Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Cluster name cannot be longer than 255 characters.']",
            "empty" : "//input[@placeholder='Name']//ancestor::div[@class='ant-form-item-control has-feedback has-error']//div[text()='Please enter a cluster name.']",
            "closeCircleIcon" : "//input[@placeholder='Name']//ancestor::span[@class='ant-form-item-children']//following-sibling::span[@class='ant-form-item-children-icon']//i[@aria-label='icon: close-circle' and @class='anticon anticon-close-circle']"
        },
        "label" : {
            "commonError" : "//span[text()='Label :']//ancestor::div[contains(@class,'ant-form-item-label')]//following-sibling::div//p[text()='Key/value must be 63 characters or less, start and end with an alphanumeric character, and consist of alphanumeric, dash ( - ), underscore ( _ ), or dot ( . ) characters.']"
        },
        "selectInode" : {
            "notFound" : "//li[@class='ant-cascader-menu-item ant-cascader-menu-item-disabled' and text()='Not Found']"
        }
    }
}
