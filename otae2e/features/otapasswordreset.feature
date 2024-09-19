Feature: OTA Password Reset

    @otaUIPassReset
    Scenario: Admin resets its own password
        Given Admin logged in
        When Admin tries to reset its own password
        Then Password reset should successful and on success auto logout should happen

    @otaUIPassReset 
    Scenario: Admin resets another admin user password
        Given Admin logged in
        When Admin tries to reset another admin user password
        Then Password reset should successful 

    @otaUIPassReset 
    Scenario: Admin resets access user password
        Given Admin logged in
        When Admin tries to reset another access user password
        Then Password reset should successful

    @otaUIPassReset 
    Scenario: Access user resets its own password
        Given Access user logged in
        When Access user tries to reset its own password
        Then Password reset should successful and on success auto logout should happen

    @otaUIPassReset
    Scenario: Password stength
        Given Admin logged in
        When Admin tries to reset its own with lower strength password
        Then Verify that password reset fails due to lower strength

    @otaUIPassReset 
    Scenario: Check mandatory field check and error on password reset page.
        Given Admin logged in
        When Admin tries to reset its own with errors
        Then Verify that all fields are mandatory and proper error message displayed on null input
        | old | new | confirm | 
        | null | null | null |
        | null | Welcome2Iotium! | Welcome2Iotium! | 
        | Welcome2Iotium! | null | Welcome2Iotium! |
        | Welcome2Iotium! | Welcome2Iotium! | null |

    @otaUIPassReset 
    Scenario: Check mandatory field are marked with asterisk
        Given Admin logged in
        When Admin tries to reset its own with errors
        Then Verify that all mandatory fields are marked with asterisk

    @otaUIPassReset 
    Scenario: Password expiry day reset after password resetting user password
        Given Admin logged in
        When Admin tries to reset its own password
        Then After successful reset the password expiry day should reset 

    @otaUIPassReset 
    Scenario: Improper Password reset
        Given Admin logged in
        When Admin tries to reset its own password
        | old | new | confirm | error | 
        | wrong | Welcome2Iotium! | Welcome2Iotium! | Unable to reset password - Unauthorized |
        | Welcome2Iotium! | Welcome2Iotium! | Welcome2Iotium! | The new password should not be same as old password |
        | Welcome2Iotium! | Welcome2Iotium! | Welcome2Iotium1! | The two passwords that you entered do not match! | 
        | Welcome2Iotium! | notvalid | notvalid | Password must have a minimum length of 8 with three of the four - one uppercase, one lowercase, one digit, one special character(!@#$%^&*) and may not contain spaces/name/login name |
        Then Verify that password reset fails




