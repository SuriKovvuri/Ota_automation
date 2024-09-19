Feature: OTA-2765 Wallpaper Settings
    
    @otaUIwallpaper
    Scenario: Verification of  enable and disable option in ssh and rdp device for admin user
        Given Admin logged in
        When Tries to create a ssh or rdp connections
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup | connectionName | ftp | wallpaper |
        | adddevice | 2.3.4.5 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH | QA Team | adddeviceSSH | enable | disable |
        | adddevice | 2.3.4.5 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | RDP | QA Team | adddeviceSSH | enable | enable |
        | adddevice | 2.3.4.5 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH | QA Team | adddeviceSSH | disable | disable |
        | adddevice | 2.3.4.5 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | RDP | QA Team | adddeviceSSH | disable | disable |
        | adddevice | 2.3.4.5 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | RDP | QA Team | adddeviceSSH | enable | disable |
        | adddevice | 2.3.4.5 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | RDP | QA Team | adddeviceSSH | disable | enable |
        Then Both Filetransfer and wallpaper setting should be available with a switch to turn it on or off


