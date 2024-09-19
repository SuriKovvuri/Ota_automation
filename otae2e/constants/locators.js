export const otalogin = {
    "details": {
        "username": "//input[@id='username']",
        "password": "//input[@id='password']",
        "login_button": "//input[@id='kc-login']"
    }
}

export const leftpane = {
    "aside": {
        "left": "//a[@href='/dashboard']//ancestor::aside"
    },
    "div": {
        "logo": "//a[@href='/dashboard']//ancestor::div[@id='root']//child::div[@class='logo']"
    },
    "a": {
        "dashboardicon": "//aside//a[@href[starts-with(.,'/dashboard')]]",
        "userdashboard": "//aside//a[@href[contains(.,'userdashboard')]]",
        "devicedashboard": "//aside//a[@href[contains(.,'devicedashboard')]]",
        "groupdashboard": "//aside//a[@href[contains(.,'groupdashboard')]]",
        "auditdashboard": "//li//a[@href[contains(.,'auditdashboard')]]",
        "accessdashboard": "//li//a[@href[contains(.,'accessdashboard')]]",
        "orginfo": "//aside//a[@href[contains(.,'orginfo')]]",
        "userprofilepage": "//aside//a[@href[contains(.,'userprofilepage')]]",
        "_logout": "//li[@role='menuitem']//following-sibling::li[@role='menuitem']//a[@href[starts-with(.,'/logout')]]",

    },
    "svg": {
        "apidoc": "//*[name()='svg'][@type='question-circle']",
        "myprofile": "//*[name()='svg'][@type='user-circle']",
        "devicedashboard_icon": "//*[name()='svg'][@type='laptop']",
        "_devicedashboard_icon": 'svg[type="laptop"]'
    },
    "span": {
        "accountBook": "//aside//span[@aria-label='account-book']"
    }
}
export const dashboard = {
    "div": {
        "title": "//div[text()='Dashboard']",
        "graph_activity": "//div[text()=' Activity Originating']",
        "graph_device_locator": "//div[text()=' Device Location']",
        "graph_cluster": "//div[text()=' Clusters']"
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "canvas": {
        "map": "//canvas[@class='mapboxgl-canvas']"
    },
    "small": {
        "totalActivity": "//small[text()='Total Activity ']"
    }
}

export const userlist = {
    "div": {
        "title": "//div[text()='Users']",
        "_userNameValue": "//div[@class='userNameValue']"
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']",
        "loginuser_icon": "//*[name()='svg'][@type='Users']",
        "profile_icon": "//span[text()='Profile ']",
    },
    "title": {
        "header_title": "//span[@class='headerTitleText'][text()='Users']",
    },
    "button": {
        "user_expand": "//span[@type='appstore']",
        "add_user": "//span[text()='Add User']//ancestor::button",
        "_cancel_button": "//button//span[text()='Cancel']",
        "_submit_button": "//button//span[text()='Submit']"
    },
    "filter": {
        "full_name_sort_down": "//div[span[text()='Full Name']]//child::span[contains(@aria-label,'caret-down')]",
        "full_name_sort_up": "//div[span[text()='Full Name']]//child::span[contains(@aria-label,'caret-up')]",
        "userid_sort_down": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-down')]",
        "userid_sort_ip": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-up')]",
        "email_sort_down": "//div[span[text()='Email']]//child::span[contains(@aria-label,'caret-down')]",
        "email_expiry_sort_up": "//div[span[text()='Email']]//child::span[contains(@aria-label,'caret-up')]",
        "last_loggedIn_sort_down": "//div[span[text()='Last LoggedIn']]//child::span[contains(@aria-label,'caret-down')]",
        "last_loggedIn_expiry_sort_up": "//div[span[text()='Last LoggedIn']]//child::span[contains(@aria-label,'caret-up')]",
        "password_expiry_sort_down": "//div[span[text()='Password Expiry']]//child::span[contains(@aria-label,'caret-down')]",
        "password_expiry_sort_up": "//div[span[text()='Password Expiry']]//child::span[contains(@aria-label,'caret-up')]"
    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Name']",
        "name_textbox": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Name']",
        "user_id_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='User ID']",
        "email_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Email']",
        "status_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Status']",
        "last_login_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Last Login']",
        "password_expiry_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Password Expiry']",
        "mfa_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='MFA']",
        "email_verified_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Email Verified']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "reset_button": "//span[@aria-label='undo']//ancestor::button"
    },
    "user_profile": {
        "_user_profile_td": "//td//a[text()='%s']",
        "_user_profile_text": "//a[text()='%s']",
    }
}

export const devicelist = {
    "div": {
        "title": "//div[text()='Inventory']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "title": {
        "header_title": "//span[@class='headerTitleText'][text()='Device Endpoints']",

    },
    "button": {
        "device_expand": "//span[@type='appstore']",
        "add_device": "//span[text()='Add Device']//ancestor::button"
    },
    "filter": {
        "device_name_sort_down": "//div[span[text()='Device Name']]//child::span[contains(@aria-label,'caret-down')]",
        "device_name_sort_up": "//div[span[text()='Device Name']]//child::span[contains(@aria-label,'caret-up')]",
        "hostname_sort_down": "//div[span[text()='Host Name']]//child::span[contains(@aria-label,'caret-down')]",
        "hostname_sort_up": "//div[span[text()='Host Name']]//child::span[contains(@aria-label,'caret-up')]",
        "ip_address_sort_down": "//div[span[text()='IP Address']]//child::span[contains(@aria-label,'caret-down')]",
        "ip_address_sort_up": "//div[span[text()='IP Address']]//child::span[contains(@aria-label,'caret-up')]",
    },
    "th": {
        "description": "//div//th[text()='Description']",

    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "device_name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Device Name']",
        "device_name_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Device Name']",
        "ip_address_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='IP Address']",
        "host_name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Host Name']",
        "connection_type_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Connection Type']",
        "city_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='City']",
        "country_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Country']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "reset_button": "//span[@aria-label='undo']//ancestor::button"
    }
}

export const grouplist = {
    "div": {
        "title": "//div[text()='Groups']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "title": {
        "header_title": "//span[@class='headerTitleText'][text()='Groups']",
    },
    "button": {
        "group_expand": "//span[@type='appstore']",
        "add_group": "//span[text()='Add Group']//ancestor::button"
    },
    "filter": {
        "group_name_sort_down": "//div[span[text()='Name']]//child::span[contains(@aria-label,'caret-down')]",
        "group_name_sort_up": "//div[span[text()='Name']]//child::span[contains(@aria-label,'caret-up')]"
    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Name']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "reset_button": "//span[@aria-label='undo']//ancestor::button"
    },
    "group_profile": {
        "group_profile_td": "//td//a[text()='%s']",
        "group_profile_text": "//span[text()='%s']",
    }
}

export const auditlist = {
    "div": {
        "title": "//div[text()='Audit']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "filter": {
        "audit_day_filter": "//div[text()='Audit']//ancestor::div//*[name()='svg'][@type='AngleDown']",
        "audit_start_date": "//div[text()='Audit']//ancestor::div//input[@placeholder='Start date']",
        "audit_end_date": "//div[text()='Audit']//ancestor::div//input[@placeholder='End date']",
        "clear_audit_date": "//div[text()='Audit']//ancestor::div//span//span//*[name()='svg'][@data-icon='close-circle']",
    },
    "user_activity_table": {
        "timestamp_name_sort_down": "//div[text()='Audit']//ancestor::div//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-down')]",
        "timestamp_name_sort_up": "//div[text()='Audit']//ancestor::div//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-up')]",
        "description": "//div[text()='Audit']//ancestor::div//tr//th[text()='Description']",
        "organization": "//div[text()='Audit']//ancestor::div//tr//th[text()='Organization']",
        "next": "//*[name()='svg'][@data-icon='right']"
    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "user_id_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='User ID']",
        "user_id_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='User ID']",
        "audit_type_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Audit Type']",
        "target_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Target']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "reset_button": "//span[@aria-label='undo']//ancestor::button"
    }
}

export const accesslist = {
    "div": {
        "title": "//div[text()='Access']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "filter": {
        "audit_day_filter": "//*[name()='svg'][@type='AngleDown']",
        "audit_start_date": "//input[@placeholder='Start date']",
        "audit_end_date": "//input[@placeholder='End date']",
        "clear_audit_date": "//span//span//*[name()='svg'][@data-icon='close-circle']",
    },
    "card": {
        "top_active_user_title": "//div//p[contains(@class, 'otacardtitle')][text()='Top Active User']",
        "top_active_user": "//div//p[contains(@class, 'otacardtitle')][text()='Top Active User']//following-sibling::p[contains(@class, 'otacarddata')][text()]",
        "total_sessions_title": "//div//p[contains(@class, 'otacardtitle')][text()='Total Sessions']",
        "total_sessions": "//div//p[contains(@class, 'otacardtitle')][text()='Total Sessions']//following-sibling::p[contains(@class, 'otacarddata')][text()]",
        "total_session_time_title": "//div//p[contains(@class, 'otacardtitle')][text()='Total Session Time']",
        "total_session_time": "//div//p[contains(@class, 'otacardtitle')][text()='Total Session Time']//following-sibling::p[contains(@class, 'otacarddata')][text()]",
        "longest_session_time_title": "//div//p[contains(@class, 'otacardtitle')][text()='Longest Session Time']",
        "longest_session_time": "//div//p[contains(@class, 'otacardtitle')][text()='Longest Session Time']//following-sibling::p[contains(@class, 'otacarddata')][text()]",
    },
    "user_activity_table": {
        "header_title": "//span[text()='User Activity']",
        "timestamp_name_sort_down": "//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-down')]",
        "timestamp_name_sort_up": "//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-up')]",
        "userid_name_sort_down": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-down')]",
        "userid_name_sort_up": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-up')]",
        "origin_name_sort_down": "//div[span[text()='Origin']]//child::span[contains(@aria-label,'caret-down')]",
        "origin_name_sort_up": "//div[span[text()='Origin']]//child::span[contains(@aria-label,'caret-up')]",
        "country_name_sort_down": "//div[span[text()='Country']]//child::span[contains(@aria-label,'caret-down')]",
        "country_name_sort_up": "//div[span[text()='Country']]//child::span[contains(@aria-label,'caret-up')]",
        "session_time_sort_down": "//div[span[text()='Session Time (hh:mm:ss)']]//child::span[contains(@aria-label,'caret-down')]",
        "session_time_sort_up": "//div[span[text()='Session Time (hh:mm:ss)']]//child::span[contains(@aria-label,'caret-up')]",
        "next": "//*[name()='svg'][@data-icon='right']"
    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "user_id_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='User ID']",
        "user_id_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='User ID']",
        "country_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Country']",
        "destination_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Destination']",
        "connection_name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Connection Name']",
        "connection_type_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Connection Type']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "reset_button": "//span[@aria-label='undo']//ancestor::button"
    }
}

export const orgpage = {
    "div": {
        "title": "//div[text()='Org Profile']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "title": {
        "org": "//div[contains(@class, 'userNameValue')][text()='Customer Org']",
        "org_expand": "//div[contains(@class, 'userNameValue')][text()='Customer Org']//preceding-sibling::span//*[name()='svg'][@data-icon='right']",
        "policy": "//div[contains(@class, 'userNameValue')][text()='Org Policy']",
        "policy_expand": "//div[contains(@class, 'userNameValue')][text()='Org Policy']//preceding-sibling::span//*[name()='svg'][@data-icon='right']",
        "auth_domain": "//div[text()='Auth Domain']",
    },
    "button": {
        "add_auth_domain": "//span[text()='Add Auth Domain']//ancestor::button"
    },
    "li": {
        "next_page_auth_domain": "//div[@class='orgdashboard']//li[@title[contains(.,'Next Page')]]"
    },
    "auth_domain_table": {
        "name_sort_down": "//div[span[text()='Name']]//child::span[contains(@aria-label,'caret-down')]",
        "name_sort_up": "//div[span[text()='Name']]//child::span[contains(@aria-label,'caret-down')]",
        "display_name_sort_down": "//div[span[text()='Display Name']]//child::span[contains(@aria-label,'caret-down')]",
        "display_name_sort_up": "//div[span[text()='Display Name']]//child::span[contains(@aria-label,'caret-down')]",
        "protocol_sort_down": "//div[span[text()='Protocol']]//child::span[contains(@aria-label,'caret-down')]",
        "protocol_name_sort_up": "//div[span[text()='Protocol']]//child::span[contains(@aria-label,'caret-down')]",
        "description": "//div[@class='user-auth-title']//ancestor::div[@class='iotium-spin-container']//child::th[text()='Description']",
        "default": "//div[@class='user-auth-title']//ancestor::div[@class='iotium-spin-container']//child::th[text()='Default']",
        "scope": "//div[@class='user-auth-title']//ancestor::div[@class='iotium-spin-container']//child::th[text()='Scope']",
    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Name']",
        "name_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Name']",
        "display_name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Display Name']",
        "scope_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Scope']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "reset_button": "//span[@aria-label='undo']//ancestor::button"
    }
}


export const userprofilepage = {
    "div": {
        "title": "//div[text()='User Profile']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger active']"
    },
    "user": {
        "username_val": "//div[contains(@class, 'userNameValue')]",
        "username": "//div[contains(@class, 'userNameValue')][text()]",
        "username_expand": "//div[contains(@class, 'userNameValue')][text()]//preceding-sibling::span//*[name()='svg'][@data-icon='right']",
    },
    "user_activity": {
        "title": "//span[text()='User Activity']",
        "audit_download": "//*[name()='svg'][@type='download']",
        "timestamp_name_sort_down": "//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-down')]",
        "timestamp_name_sort_up": "//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-up')]",
        "userid_name_sort_down": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-down')]",
        "userid_name_sort_up": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-up')]",
        "origin_name_sort_down": "//div[span[text()='Origin']]//child::span[contains(@aria-label,'caret-down')]",
        "origin_name_sort_up": "//div[span[text()='Origin']]//child::span[contains(@aria-label,'caret-up')]",
        "country_name_sort_down": "//div[span[text()='Country']]//child::span[contains(@aria-label,'caret-down')]",
        "country_name_sort_up": "//div[span[text()='Country']]//child::span[contains(@aria-label,'caret-up')]",
        "session_time_sort_down": "//div[span[text()='Session Time (hh:mm:ss)']]//child::span[contains(@aria-label,'caret-down')]",
        "session_time_sort_up": "//div[span[text()='Session Time (hh:mm:ss)']]//child::span[contains(@aria-label,'caret-up')]",
        "destination": "//div//th[text()='Destination']",
        "connectionName_search": "//div//th[text()='Connection Name']"
    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "country_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Country']",
        "country_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Country']",
        "destination_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Destination']",
        "connection_name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Connection Name']",
        "connection_type_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Connection Type']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "_search_textbox": 'div[class="ant-select-item-option-content"]',//"//span[contains(@class,'ant-input-group-addon')]",//button[@type='button'],
        "reset_button": "//span[@aria-label='undo']//ancestor::button",
        "_group_search_box": "//div[contains(@class,'usr-access-connection-select-box')]//input[@type='search']",
    },
    "device": {
        "_device_title": "//div[contains(@class,'deviceNameDivContainer deviceNameProfilePageDiv')]//span[@title='%s']",
        "_device_popover_elt": "//div[contains(@class,'ant-popover ant-popover-placement-rightBottom ')]//li",
    }
}

export const deviceprofilepage = {
    "div": {
        "title": "//div[text()='Device Profile']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "device": {
        "devicename": "//div[contains(@class, 'userNameValue')][text()]",
        "device_expand": "//div[contains(@class, 'userNameValue')][text()]//preceding-sibling::span//*[name()='svg'][@data-icon='right']",
    },
    "user_activity": {
        "title": "//span[text()='User Activity']",
        "audit_download": "//*[name()='svg'][@type='download']",
        "timestamp_name_sort_down": "//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-down')]",
        "timestamp_name_sort_up": "//div[span[text()='Timestamp']]//child::span[contains(@aria-label,'caret-up')]",
        "userid_name_sort_down": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-down')]",
        "userid_name_sort_up": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-up')]",
        "origin_name_sort_down": "//div[span[text()='Origin']]//child::span[contains(@aria-label,'caret-down')]",
        "origin_name_sort_up": "//div[span[text()='Origin']]//child::span[contains(@aria-label,'caret-up')]",
        "country_name_sort_down": "//div[span[text()='Country']]//child::span[contains(@aria-label,'caret-down')]",
        "country_name_sort_up": "//div[span[text()='Country']]//child::span[contains(@aria-label,'caret-up')]",
        "destination": "//div//th[text()='Destination']",
        "connectionName_search": "//div//th[text()='Connection Name']",//"//div[span[text()='Connection Name']]//ancestor::div[contains(@class, 'ant-table-filter-column')]//child::span[contains(@aria-label,'search')]",
        "session_time_sort_down": "//div[span[text()='Session Time (hh:mm:ss)']]//child::span[contains(@aria-label,'caret-down')]",
        "session_time_sort_up": "//div[span[text()='Session Time (hh:mm:ss)']]//child::span[contains(@aria-label,'caret-up')]"
    },
    "search": {
        "search_expand": "//div[@class='ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left pointer divider-orange']//child::span[text()='Search']",
        "user_id_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='User ID']",
        "country_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Country']",
        "country_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Country']",
        "destination_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Destination']",
        "connection_name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Connection Name']",
        "connection_type_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Connection Type']",
        "search_button": "//span[@aria-label='search']//ancestor::button",
        "reset_button": "//span[@aria-label='undo']//ancestor::button"
    }
}

export const groupprofilepage = {
    "div": {
        "title": "//div[text()='Group Profile']",
    },
    "svg": {
        "loginuser": "//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']"
    },
    "group": {
        "groupname": "//div[contains(@class, 'userNameValue')][text()]",
        "group_expand": "//div[contains(@class, 'userNameValue')][text()]//preceding-sibling::span//*[name()='svg'][@data-icon='right']",
        "_textbox": "//span[text()='Groups']//ancestor::div[@class='modalContainer']//child::input[@class='ant-select-selection-search-input']",
        "_portIdAssociateTextbox": "//input[@value='%s']//ancestor::span//input[@type='search']",
    },
    "users": {
        "header_title": "//span[@class='headerTitleText'][text()='Users']",
        "user_expand": "//span[@type='appstore']",
        "full_name_sort_down": "//div[span[text()='Full Name']]//child::span[contains(@aria-label,'caret-down')]",
        "full_name_sort_up": "//div[span[text()='Full Name']]//child::span[contains(@aria-label,'caret-up')]",
        "email_sort_down": "//div[span[text()='Email']]//child::span[contains(@aria-label,'caret-down')]",
        "email_sort_ip": "//div[span[text()='Email']]//child::span[contains(@aria-label,'caret-up')]",
        "userid_sort_down": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-down')]",
        "userid_sort_ip": "//div[span[text()='User ID']]//child::span[contains(@aria-label,'caret-up')]",
        "status": "//span[@class='headerTitleText'][text()='Users']//ancestor::div[@class='userDetails userdetails-table-panel']//th[text()='Status']",
        "password_expiry_sort_down": "//div[span[text()='Password Expiry']]//child::span[contains(@aria-label,'caret-down')]",
        "password_expiry_sort_up": "//div[span[text()='Password Expiry']]//child::span[contains(@aria-label,'caret-up')]",
        "last_loggedIn_sort_down": "//div[span[text()='Last LoggedIn']]//child::span[contains(@aria-label,'caret-down')]",
        "last_loggedIn_sort_up": "//div[span[text()='Last LoggedIn']]//child::span[contains(@aria-label,'caret-up')]",
    },
    "role": {
        "groupname_title_text": '//a[contains(text(),"%s")]',
        "groupname_title": '//a[contains(text(),"%s")]//ancestor::td/preceding-sibling::td[button[@class="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed"]]',
        "group_role_access": "//div[contains(text(),'%s Access')]",
        "group_role_admin": "//div[contains(text(),'%s Admin')]",
    },
    "devices": {
        "header_title": "//span[@class='headerTitleText'][text()='Device Endpoints']",
        "device_expand": "//span[@type='appstore']",
        "device_name_sort_down": "//div[span[text()='Device Name']]//child::span[contains(@aria-label,'caret-down')]",
        "device_name_sort_up": "//div[span[text()='Device Name']]//child::span[contains(@aria-label,'caret-up')]",
        "hostname_sort_down": "//div[span[text()='Host Name']]//child::span[contains(@aria-label,'caret-down')]",
        "hostname_sort_ip": "//div[span[text()='Host Name']]//child::span[contains(@aria-label,'caret-up')]",
        "ip_address_sort_down": "//div[span[text()='IP Address']]//child::span[contains(@aria-label,'caret-down')]",
        "ip_address_sort_ip": "//div[span[text()='IP Address']]//child::span[contains(@aria-label,'caret-up')]",
        "description": "//span[@class='headerTitleText'][text()='Device Endpoints']//ancestor::div[@class='userDetails userdetails-table-panel']//div//th[text()='Description']",
    },
    "user_search": userlist.search,
    "devices_search": devicelist.search


}
export const adduser = {
    "details": {
        "first_name": "//input[@placeholder='First Name']",
        "last_name": "//input[@placeholder='Last Name']",
        "email": "//input[@placeholder='Email']",
        "auth_domain": "//label[text()='Auth Domain']//parent::div//following-sibling::div//div//span[@class='ant-legacy-form-item-children']",
        "_password": "//input[@placeholder='Password']",
        "_confirm_password": "//input[@placeholder='Confirm Password']",
        "phone": "//input[@placeholder='Phone']",
        "org": "//label[text()='Org']//parent::div//following-sibling::div//div//span[@class='ant-legacy-form-item-children']",
        "scope": "//label[text()='Scope']//parent::div//following-sibling::div//div//span[@class='ant-legacy-form-item-children']",
        "cancel_button": "//button//span[text()='Cancel']",
        "submit_button": "//button//span[text()='Submit & Add to Group']",
    },
}
export const adddevice = {
    "details": {
        "site": "//input[@id='site']",
        "name": "//input[@id='name']",
        "ip_address": "//input[@id='externalIp']",
        "hostname": "//input[@id='hostname']",
        "description": "//input[@id='description']",
        "street": "//input[@id='street']",
        "city": "//span[@class='ant-input-affix-wrapper ant-select-selection-search-input']//child::input[@id='city']",
        "state": "//input[@id='state']",
        "country": "//input[@id='country']",
        "zipcode": "//input[@id='zipcode']",
        "allow_ota_creds": "//button[@id='allowOTAccessCredentials']",
        "cancel_button": "//button//span[text()='Cancel']",
        "submit_button": "//button//span[text()='Submit & Add Connections']",
    },
}

export const addgroup = {
    "details": {
        "name": "//input[@id='name']",
        "description": "//input[@id='description']",
        "cancel_button": "//button//span[text()='Cancel']",
        "submit_button": "//button//span[text()='Submit']",
    },
}

export const addendpoint = {
    "details": {
        "type": "//div[text()=' Type:']//following-sibling::div//div//span[@class='ant-select-selection-search']",
        "name": "//div[text()=' Name:']//following-sibling::div//input[contains(@class,'ant-input')]",
        "port": "//input[@name='port']",
        "_ftp": "//button[@id='fileSwitch0']",
        "_wallpaper": "//button[@id='wallSwitch0']",
        "_subpath": "//input[@name='path']",
        "add_new_connection": "//*[name()='svg'][@data-icon='plus']",
        "_select_ssh": "//div[contains(@class,'ant-select-item-option-content')][text()='SSH']",
        "_select_rdp": "//div[contains(@class,'ant-select-item-option-content')][text()='RDP']",
        "_select_http": "//div[contains(@class,'ant-select-item-option-content')][text()='HTTP']",
        "_select_https": "//div[contains(@class,'ant-select-item-option-content')][text()='HTTPS']",
        "cancel_button": "//button//span[text()='Cancel']",
        "review_button": "//button//span[text()='Review']",
    }
}

export const endpoint_review = {
    "details": {
        "back_button": "//button//span[text()='< Back']",
        "submit_button": "//button//span[text()='Submit']"
    }
}

export const user_role_association = {
    "details": {
        "first_name": "//input[@placeholder='Full Name'][@value]",
        "userid": "//input[@placeholder='Login ID'][@value]",
        "select_group": "//label[text()='Role Associations ']",
        "cancel_button": "//button//span[text()='Cancel']",
        "submit_button": "//button//span[text()='Submit']"

    }
}

export const device_role_association = {
    "details": {
        "select_group": "//div[@class='ant-select-selector']",
        "cancel_button": "//button//span[text()='Cancel']",
        "submit_button": "//button//span[text()='Submit']"
    }
}

export const user_detail = {
    "details": {
        "email": "//div[contains(@class,'ant-col')][strong='Email']",
        "username": "//div[contains(@class,'ant-col')][strong='Username']",
        "phone": "//div[contains(@class,'ant-col')][strong='Phone']",
        "password_expiry": "//div[contains(@class,'ant-col')][strong='Password Expiry']",
        "auth_domain": "//div[contains(@class,'ant-col')][strong='Auth Domains']",
        "org": "//div[contains(@class,'ant-col')][strong='Org']",
        "scope": "//div[contains(@class,'ant-col')][strong='Scope']"

    },
    "button": {
        "user_status": "//div[contains(@class,'ant-col')][strong='User Status']//following-sibling::div//input[@type='radio']",
        "mfa_reset": "//div[contains(@class,'ant-col')][strong='MFA']//following-sibling::div//input[@type='radio']"
    },
    "action": {
        "edit_role": "//button//*[name()='svg'][@type='edit']",
        "edit_user": "//button//*[name()='svg'][@type='user-edit']",
        "password_reset": "//button//*[name()='svg'][@type='sync-alt']",
        "delete": "//button//*[name()='svg'][@type='trash-alt']"
    }
}

export const device_detail = {
    "details": {
        "ip": "//div[contains(@class,'ant-col ant-col-8')][strong='IP']//following-sibling::div[@class='ant-col ant-col-12']",
        "hostname": "//div[contains(@class,'ant-col ant-col-8')][strong='Hostname']//following-sibling::div[@class='ant-col ant-col-12']",
        "description": "//div[contains(@class,'ant-col ant-col-8')][strong='Description']//following-sibling::div[@class='ant-col ant-col-12']",
        "street": "//div[contains(@class,'ant-col ant-col-8')][strong='Street']//following-sibling::div[@class='ant-col ant-col-12']",
        "city": "//div[contains(@class,'ant-col ant-col-8')][strong='City']//following-sibling::div[@class='ant-col ant-col-12']",
        "state": "//div[contains(@class,'ant-col ant-col-8')][strong='State']//following-sibling::div[@class='ant-col ant-col-12']",
        "country": "//div[contains(@class,'ant-col ant-col-8')][strong='Country']//following-sibling::div[@class='ant-col ant-col-12']",
        "zipcode": "//div[contains(@class,'ant-col ant-col-8')][strong='Zip']//following-sibling::div[@class='ant-col ant-col-12']",
        "org": "//div[contains(@class,'ant-col ant-col-8')][strong='Org']//following-sibling::div[@class='ant-col ant-col-12']",
    },
    "button": {
        "user_status": "//div[contains(@class,'ant-col ant-col-8')][strong='Status']//following-sibling::div//button//span[text()]",
        "_header_titile_expand": 'button[class="ant-btn ant-btn-circle ant-btn-sm ant-btn-block"]',
    },
    "action": {
        "edit_endpoint": "//button//*[name()='svg'][@type='link']",
        "edit_role": "//button//*[name()='svg'][@type='edit']",
        "edit_device": "//button//*[name()='svg'][@type='pen-alt']",
        "_edit_icon": 'svg[type="edit"]',
        "delete": "//button//*[name()='svg'][@type='trash-alt']",

    }
}

export const group_detail = {
    "details": {
        "description": "//div[contains(@class,'ant-col ant-col-8')][strong='Description']//following-sibling::div[@class='ant-col ant-col-12']",
        "org": "//div[contains(@class,'ant-col ant-col-8')][strong='Org']//following-sibling::div[@class='ant-col ant-col-12']",
        "role": "//div[contains(@class,'ant-col ant-col-8')][strong='Role']//following-sibling::div[@class='ant-col ant-col-12']",
    },
    "action": {
        "edit_group": "//button//*[name()='svg'][@type='user-edit']",
        "delete": "//button//*[name()='svg'][@type='trash-alt']",
        "groupadd": "//button//*[name()='svg'][@type='groupadd']",
        "download": "//button//*[name()='svg'][@type='download']",
        "_delete_icon": "svg[type='trash-alt']",
        "_groupadd_icon": 'svg[type="groupadd"]',
        "_groupdissociate_close": "//span[contains(text(),'%s')]//child::span[@aria-label='close']",

    }
}

export const user_search = {
    "full_name": {
        "input": "//input[@placeholder='Search by full name']",
        "search_button": "//button//span[text()='Search']",
        "reset_button": "//button//span[text()='Reset']",
        "name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Name']",
        "name_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Name']",
        "search_input_box": "//input[@placeholder='Search by User Name and ⏎']",
    }
}

export const device_search = {
    "name": {
        "input": "//input[@placeholder='Search by device name']",
        "search_button": "//button//span[text()='Search']",
        "reset_button": "//button//span[text()='Reset']",
        "device_name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Device Name']",
        "device_name_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Device Name']",
    }
}

export const group_search = {
    "name": {
        "input": "//input[@placeholder='Search by group name']",
        "search_button": "//button//span[text()='Search']",
        "reset_button": "//button//span[text()='Reset']",
        "name_label": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::label[text()='Name']",
        "name_input": "//form[@class='ant-legacy-form ant-legacy-form-horizontal table-filter-wrapper']//child::input[@placeholder='Name']",
        "display_name": "//a[text()='%s']",

    }
}

export const password_reset = {
    "input": {
        "_current_password": "//input[@placeholder='Password']",
        "new_password": "//input[@placeholder='New Password']",
        "confirm_password": "//input[@placeholder='Confirm Password']",
        "cancel_button": "//button//span[text()='Cancel']",
        "submit_button": "//button//span[text()='Submit']",
        "close_button": "//*[name()='svg'][@data-icon='close']"
    }
}

export const add_auth_domain_page = {
    "add": {
        "name": "//input[@id='name']",
        "display_name": "//input[@id='displayName']",
        "protocol": "//input[@id='protocol']",
        "scope": "//input[@id='scope']",
        "description": "//textarea[@id='description']",
        "isdeafult": "//button[@id='isDefault']",
        "cancel_button": "//button//span[text()='Cancel']",
        "submit_button": "//button//span[text()='Submit']",
        "close_button": "//*[name()='svg'][@data-icon='close']"
    },
    "edit": {
        "_auth_url": "//input[@id='attributes.authURL']",
        "_token_url": "//input[@id='attributes.tokenURL']",
        "_logout_url": "//input[@id='attributes.logoutURL']",
        "_client_id": "//input[@id='attributes.clientId']",
        "_client_secret": "//input[@id='attributes.clientSecret']"
    }
}

export const audit_page = {
    "userid": {
        "input": "//input[@placeholder='Search by userID']",
        "reset": "//span[text() = 'Reset']",
        "search": "//span[text() = 'Search']"
    }
}

export const schedule_access = {
    "div": {
        // user_account: "//a[normalize-space()='Schedule Access']",
        user_account: "//a[normalize-space()='Scheduled Accesstesting']",
        user_profile_links: '//div[@class="col-wrap"]//span[@class="hyperlink-text"]',
        // user_account: "//a[normalize-space()='Dailyschedule Aceesstest']",
        weekly_user_account: "//a[normalize-space()='Test Scheduleaccess']",
        weekly_twice_user_account: "//a[normalize-space()='Scheduleaccess Weekly']",
        configuration_edit: "//div[contains(@class, 'editGroup')]",
        disable_sa: '//div[@class="ant-switch-handle"]',
        user_profile_user_name: '//div[@class="ant-row usr-profile-field-padding"]//div[text()="saccesstesting"]',
        // user_profile_user_name: '//div[@class="ant-row usr-profile-field-padding"]//div[text()="daceesstest"]',
        weekly_user_profile_name: '//div[@class="ant-row usr-profile-field-padding"]//div[text()="tscheduleaccess"]',
        weekly_twice_user_profile_name: '//div[@class="ant-row usr-profile-field-padding"]//div[text()="sweekly"]',
        add_new_sa_user: '//span[text()="Add User"]',
        daily_access: "//div[contains(text(),'Daily')]",
        weekly_schedule_access: "//div[contains(text(),'Weekly')]",
        time_zone: '//div[@title="Asia/Kolkata (UTC+05:30)"]',
        time_zone_us: '//div[@title="America/Chicago (UTC-05:00)"]',
        weekly_all_days_user_account: "//a[normalize-space()='Dailyschedule Aceesstest']",
        weekly_all_days_user_profile_name: '//div[@class="ant-row usr-profile-field-padding"]//div[text()="daceesstest"]',
        monthly_once_user_account: "//a[normalize-space()='Scheduleaccess Monthlyonce']",
        monthly_schedule_access: "//div[contains(text(),'Monthy')]",
        monthly_once_profile_name: '//div[@class="ant-row usr-profile-field-padding"]//div[text()="smonthlyonce"]',
        monthly_on_day_week: "//a[normalize-space()='Scheduleaccess Onthedayofweek']",
        monthly_on_week_day_xpath: '//div[@class="ant-row usr-profile-field-padding"]//div[text()="sconthedayofweek"]',
        // monthly_on_day_week: "//div[normalize-space()='sconthedayofweek']",
    },
    "span": {
        arrow_mark: "//span[@class='anticon anticon-right ant-collapse-arrow']",
        userid_search: '//span[@aria-label="search"]',
        user_profile_navigate: '//span[@class="anticon anticon-right ant-collapse-arrow"]',
        http_access_device: "//span[@aria-label='chrome']//*[name()='svg']",
        submit_new_user: "//span[normalize-space()='Submit & Add to Group']",
        Repeat_down: '(//span[@aria-label="down"])[6]',
        notify_me: "//span[normalize-space()='Notify Now']",
        timezone_arrow: '//*[@id="daterange"]//span[@aria-label="down"]',
        // time_zone_text: "//span[@title='Asia/Calcutta (UTC+05:30)']",
        // time_zone_text: '//div[@title="Asia/Calcutta (UTC+05:30)"]',
        time_zone_text: "//span[@title='Asia/Kolkata (UTC+05:30)']",
        timezone_diff_country: '//span[@title="America/Chicago (UTC-05:00)"]',
        //span[@title="Asia/Kolkata (UTC+05:30)"]
        search_zone: '//*[@id="daterange"]//span[@class="ant-select-selection-search"]',
        Repeat: "//span[@title='Daily']",
        Repeat_weekly_once: "//span[@title='Weekly']",
        Repeat_monthly_once: "//span[@title='Monthy']",
        On_Days: "//span[normalize-space()='On Days']",
        // On_days_search: '//div[@class="ant-select schedule-access-monthly-days ant-select-multiple ant-select-show-search"]//following-sibling::span',
        On_days_search: '//input[@id="on_days"]',
        deselect_existing_date: '(//span[@class="ant-select-selection-item-remove"])[3]',
        on_days_configured: '//div[@class="ant-select schedule-access-monthly-days ant-select-multiple ant-select-show-search"]',
        on_days_week_search: "//span[normalize-space()='On the']",
        week_dropdown_arrow: '(//*[@id="day_position"]//following::span/span[@aria-label="down"])[1]',
        day_dropdown_arrow: '(//*[@id="day_position"]//following::span/span[@aria-label="down"])[2]',
        week_position: '//*[@id="day_position"]//ancestor::span[@class="ant-select-selection-search"]//following-sibling::span[@class="ant-select-selection-item"]',
        on_the_day_xpath: `//*[@id='on_the_day']//ancestor::span[@class="ant-select-selection-search"]//following-sibling::span[@class="ant-select-selection-item"]`,
    },
    "button": {
        enable_sa: "//button[@id='enabled']",
        disable_sa: '//button[@id="enabled"][@role="switch"]',
        sa_submit: "//button[@id='submitBtn']",
        cancel_button: "//span[normalize-space()='Cancel']",
        search_button: '//span[@class="anticon anticon-down arrow-toggle"]',
        // user_list_sa_check: '//a[text()="Scheduled Accesstesting"]//ancestor::td[@class="ant-table-cell ant-table-cell-ellipsis"]//child::button[@class="ant-btn ant-btn-sm"]',
        user_list_sa_check: '//span[text()="Schedule User"]//ancestor::td[@class="ant-table-cell ant-table-cell-ellipsis"]//child::span[@class="scheduled-access-btn"]',
        // user_list_sa_check : '//a[text()="Today Testone"]//ancestor::td[@class="ant-table-cell ant-table-cell-ellipsis"]//child::button[@class="ant-btn ant-btn-sm"]',
        user_profile_sa_check: '//*[@id="userEnableDisableContainer"]//div[@style="display: inline-block;"]'
    },
    radio: {
        // sa_time: "//span[normalize-space()='24 Hours']",
        // sa_time: "//label[span='24 Hours']//following-sibling::label[span='Custom']",
        sa_time: "//div[@id='timings']//input[@value='1']",
        sa_time_hours: "//span[normalize-space()='24 Hours']",
    },
    a: {
        dashboardicon: "//aside//a[@href[starts-with(.,'/dashboard')]]",
        schedule_acc_user: '//a[@href="/userprofilepage"]//ancestor::span[text()="Profile "]',
    },
    input: {
        user_id: '//input[@placeholder="User ID"]',
        start_time: '//input[@placeholder="Start Time"]',
        end_time: '//input[@placeholder="End Time"]',
        user_first_name: "//input[@id='firstName']",
        user_last_name: "//input[@id='lastName']",
        user_email: "(//input[@id='mail'])[2]",
        user_phone_number: "//input[@id='telephoneNumber']",
        start_date: "//input[@placeholder='Start date']",
        end_date: "//input[@placeholder='End date']",
        check_box: '//input[@id="removeUserAfterLastSchedule"]',
    },
    label: {
        schedule_access_view: '//label[@title="Scheduled Access"]',
        password_view: '//label[@onclick="togglePassword()"]',
    },
    td: {
        user_status: "//td[@class='ant-table-cell col-wrap']",
    },
    h1: {
        http_device_xpath: '//h1[text()="Welcome to nginx!"]',
        user_schedule_profile: "//*[name()='svg'][@type='UserCircle']",
    }
}


export const notification_banner = {
    "div": {
        org_profile_arrow: "//div[@class='ant-collapse-item']//span[@aria-label='right']//*[name()='svg']",
        notification_banner_drop_down : '//div[text()="Notification Banner"]//parent::div//child::span[@class="anticon anticon-right ant-collapse-arrow"]//*[name()="svg"]',
        create_banner_xpath : '//span[text()="Create Banner"]//parent::button[@type="button"]//span[@class="anticon anticon-plus"]',
        input_text: "//div[@class='rdw-editor-main']",
        save_button: '//span[text()="Save"]//parent::button',
        enable_toggle_button: '//label[@class="email-switch-label"]',
        banner_message_layout: '//div[@class="banner-row-fixed-layout"]//following-sibling::span[@class="banner-message-layout"]',
        link_tittle: "//div[@title='Link']",    
    }
}