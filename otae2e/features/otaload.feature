@otaload
    Scenario: OTA-Profile-Set1
        Given 
        Create 200 groups
        Create 500 devices
        Create 5 admin users
        Create 500 access users
        Associate 5 devices per group, atleast 3 accessible device common for all groups and 2 random groups unqiue to each group
        Associate all 200 groups to 5 admin users
        Associate 5 groups to each access users
        When
        Login with all 5 admin users simultaneously,open user list,Device list,Group list, and user profile page.
        Login with 50 access users simultaneously, open user profile page.
        Then
        Verify that loading time of Dashboard,user/Device/group list and profile page is less than 5 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access

@otaload
    Scenario: OTA-Profile-Set2
        Given 
        Create 400 groups
        Create 1000 devices
        Create 10 admin users
        Create 1000 access users
        Associate 10 devices per group, atleast 6 accessible device common for all groups and 4 random groups unqiue to each group
        Associate all 400 groups to 10 admin users
        Associate 10 groups to each access users
        When
        Login with all 10 admin users simultaneously,open user list,Device list,Group list, and user profile page.
        Login with 100 access users simultaneously, open user profile page.
        Then
        Verify that loading time of Dashboard,user/Device/group list and profile page is less than 10 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access


@otaload
    Scenario: OTA-Profile-Set3
        Given 
        Create 800 groups
        Create 2000 devices
        Create 20 admin users
        Create 2000 access users
        Associate 20 devices per group, atleast 12 accessible device common for all groups and 8 random groups unqiue to each group
        Associate all 800 groups to 20 admin users
        Associate 20 groups to each access users
        When
        Login with all 20 admin users simultaneously,open user list,Device list,Group list, and user profile page.
        Login with 200 access users simultaneously, open user profile page.
        Then
        Verify that loading time of Dashboard,user/Device/group list and profile page is less than 20 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access
        
@otaload
    Scenario: OTA-Access-Set1
        Given 
        Create 200 groups
        Create 500 devices
        Create 10 admin users
        Create 500 access users
        Associate 5 devices per group, atleast 3 accessible device common for all groups and 2 random groups unqiue to each group
        Associate all 200 groups to 10 admin users
        Associate 5 groups to each access users
        When
        Login with all 10 admin users simultaneously,open user list,Device list,Group list, and user profile page.
        Login with 100 access users simultaneously, open user profile page.
        Then
        Verify that loading time of Dashboard,user/Device/group list and profile page is less than 5 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access


@otaload
    Scenario: OTA-Access-Set2
        Given 
        Create 200 groups
        Create 500 devices
        Create 20 admin users
        Create 500 access users
        Associate 5 devices per group, atleast 3 accessible device common for all groups and 2 random groups unqiue to each group
        Associate all 200 groups to 20 admin users
        Associate 5 groups to each access users
        When
        Login with all 20 admin users simultaneously,open user list,Device list,Group list, and user profile page.
        Login with 200 access users simultaneously, open user profile page.
        Then
        Verify that loading time of Dashboard,user/Device/group list and profile page is less than 5 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access


@otaload
    Scenario: OTA-Access-Set3
        Given 
        Create 200 groups
        Create 500 devices
        Create 40 admin users
        Create 500 access users
        Associate 5 devices per group, atleast 3 accessible device common for all groups and 2 random groups unqiue to each group
        Associate all 200 groups to 40 admin users
        Associate 5 groups to each access users
        When
        Login with all 40 admin users simultaneously,open user list,Device list,Group list, and user profile page.
        Login with 400 access users simultaneously, open user profile page.
        Then
        Verify that loading time of Dashboard,user/Device/group list and profile page is less than 5 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access

@otaload
    Scenario: OTA-Config-Set1
        Given 
        Create 200 groups
        Create 500 devices
        Create 5 admin users
        Create 500 access users
        Associate 5 devices per group, atleast 3 accessible device common for all groups and 2 random groups unqiue to each group
        Associate all 200 groups to 5 admin users
        Associate 5 groups to each access users
        When
        Add 5 new admin users and 100 Access Users, Associate them with groups as existing users
        Login with new Users and navigate to all resouce list pages and user profile page
        Then
        Verify that loading time of Dashboard,user/Device/group list and profile page is less than 5 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access

@otaload
    Scenario: OTA-Config-Set2
        Given 
        Create 200 groups
        Create 500 devices
        Create 50 admin users
        Create 500 access users
        Associate 5 devices per group, atleast 3 accessible device common for all groups and 2 random groups unqiue to each group
        Associate all 200 groups to 5 admin users
        Associate 5 groups to each access users
        When
        Disable all users, except one and try to login with Disabled Users
        Enable all users, and try to login with all users.
        Then
        Verify that User login fails and succeeds with respect to config.
        Verify that after status enabled, loading time of Dashboard,user/Device/group list and profile page is less than 5 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access

@otaload
    Scenario: OTA-Config-Set3
        Given 
        Create 200 groups
        Create 500 devices
        Create 50 admin users
        Create 500 access users
        Associate 5 devices per group, atleast 3 accessible device common for all groups and 2 random groups unqiue to each group
        Associate all 200 groups to 5 admin users
        Associate 5 groups to each access users
        When
        Reset password for all the users
        Login as all users with old password
        Login as all users with new passowrd
        Then
        Verify that User login fails and succeeds with respect to old and new password.
        Verify that after status enabled, loading time of Dashboard,user/Device/group list and profile page is less than 5 seconds
        Verify that mysql DB instances CPU/Memory are within expected range during page loading, and not stale or long running process in mysql process list.
        Verify that Device access from each Admin and access user is successful
        Verify audit logs for OTA portal access and device access