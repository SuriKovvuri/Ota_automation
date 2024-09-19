@otauser
    Scenario: Availability of Create User Option for admin user
        Given Admin logged in
        When Admin access the user page
        Then Admin navigate to user page and add user option is available

@otauser
    Scenario: Mandatory field check in create User page
        Given Admin Logged in
        When  Open User create page and click submit
        Then Verify that proper error message is given for each Mandatory field
@otauser
    Scenario: Allowed value check for each field
        Given Admin Logged in
        When Check whether "First name cannot contain digits or special characters"
        When Check whether "Last name cannot contain digits or special characters"
        When Check whether only valid email address is allowed for email field and all invalid input are rejected.
        When Check whether Auth domain shows all available domains
        When Check whether Phone fields accepts only valid phone number and rejects invalid inputs, alphabets, incomplete phone number , duplicate phone number
        When Check whether Org shows current Org
        When Check whether scope is local
        Then Verify the error message on invalid values for the each field.

@otauser
    Scenario: Admin User Create without group association
        Given Admin Logged in
        When Create an admin user with only admin group association
        Then Verify that user add is proper 
        Then Verify that new user is shown in user list
        Then Verify that no group is associated with user

@otauser
    Scenario: Login as new admin user
        Given Logged in as new admin user
        Then Verify that admin access is granted to user
        Then Verify that no groups are associated to the user

@otauser
    Scenario: Edit new User
        Given Logged in as admin User
        When Perform edit user, change firstname,lastname and phone number
        When Perform edit user role, attached a group to user
        Then Verify that user's firstname,lastname and phone number is changed
        Then Verify that role association is proper

@otauser
    Scenario: Login as new Admin User
        Given Logged in as new admin user
        When Open self user profile page
        Then Verify that firstname,lastname and phone number is proper
        Then verify that group is listed in profile page and corresponding devices are listed for access

@otauser
    Scenario: Self profile edit
        Given Logged in as new admin user
        When Performe self profile edit page, change firstname,lastname and phone number
        When Disassociate existing group and add a new group
        Then Verify that firstname,lastname and phone number is proper
        Then verify that proper group is listed in profile page and corresponding devices are listed for access

@otauser
    Scenario: Change admin user to access user
        Given Logged in as admin user
        When Remove the admin group from new admin user 
        Then Login as new user and verify that admin access is removed and only access option are shown
        Then Delete User

@otauser
    Scenario: Login with deleted user
        When Try to login with the deleted user
        Then Expected proper error message during login

@otauser
    Scenario: Admin User Create with group association
        Given Admin Logged in
        When Create an admin user with  admin group association and an access group association
        Then Verify that user add is proper 
        Then Verify that new user is shown in user list
        Then Verify that proper group is associated with user

@otauser
    Scenario: Login as new admin user
        Given Logged in as new admin user
        Then Verify that admin access is granted to user
        Then Verify that proper groups are associated to the user
        Then Verify that all groups and corresponding devices are listed properly

@otauser
    Scenario: Access User Create without group association
        Given Admin Logged in
        When Create an Access user without group associated to it
        Then Verify that user add is proper 
        Then Verify that new user is shown in user list
        Then Verify that no group is associated with user

@otauser
    Scenario: Login as new Access user
        Given Logged in as new Access user
        Then Verify that no groups are associated to the user

@otauser
    Scenario: Edit new User
        Given Logged in as admin User
        When Perform edit user for new Access User, change firstname,lastname and phone number
        When Perform edit user role, attached a group to user
        Then Verify that user's firstname,lastname and phone number is changed
        Then Verify that role association is proper

@otauser
    Scenario: Login as new Access User
        Given Logged in as new Access user
        When Open self user profile page
        Then Verify that firstname,lastname and phone number is proper
        Then verify that group is listed in profile page and corresponding devices are listed for access

@otauser
    Scenario: Self profile edit
        Given Logged in as new admin user
        When Performe self profile edit page, change firstname,lastname and phone number
        Then Verify that firstname,lastname and phone number is proper
        Then verify that role association is blocked for access user

@otauser
    Scenario: Group association to access user
        Given Logged in as new admin user
        When Performe user role edit for new Access user and associate a group to it
        Then verify that role association is proper for access user

@otauser
    Scenario: Change access user to admin user
        Given Logged in as admin user
        When Add the admin group from new access user 
        Then Login as new access user and verify that admin access is added 
        Then Delete User

@otauser
    Scenario: Acess User Create with group association
        Given Admin Logged in
        When Create an Access user only an access group association
        Then Verify that user add is proper 
        Then Verify that new user is shown in user list
        Then Verify that proper group is associated with user

@otauser
    Scenario: Login as new Access user
        Given Logged in as new Access user
        Then Verify that proper groups are associated to the user
        Then Verify that all groups and corresponding devices are listed properly



