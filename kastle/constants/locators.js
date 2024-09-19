export const login = {
    "input" : {
        "email" : "//input[@placeholder='Please Enter Email Address']",
        "next" : "//input[@type='submit' and @value='Next']",
        "password" : "//input[@placeholder='Password']",
        "login" : "//input[@type='submit' and @value='Log In']"
    }
}

export const reports = {
    "a" : {
        "goto_reports_link" : "//a[@id='gotoReportsLink'][text()='Go to Reports']",
        "reader_activity_report_yesterday": "//li//div[span='Reader Activity Report']//following-sibling::div//a[text()='Yesterday']",
        "mail": "//div[@class='toolbar']//a[@title='Mail' and text() ='Mail']",
    },
    "input": {
        "email" : "//div[@id='dvEmailReport']//input[@id='txtEmailId']",
        "send": "//div[@id='dvEmailReport']//input[@type='button' and @value = 'Send']"
    }
}
