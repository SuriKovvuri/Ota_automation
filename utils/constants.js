const { constants } = require("fs");

// Add Group Page Error Messages
export const groupNameMandatory = "Group name is mandatory"
export const groupDescMandatory = "Description is mandatory"
export const groupNameWrongInput = "Group name should contain only characters, digits, -, _, and character space."
export const groupNameDigitOnlyError = "Name should contain valid characters"
export const groupDuplicateName = "Unable to add the Group - Group name already exists"

// Group Element's and Xpaths
export const dashSideBarGroupsSpan = "//li//span[contains(text(),'Groups')]"
export const dashGroupSvg = "svg[type='UserFriends']"
export const groupAddGroup = 'button[class="ant-btn ant-btn-primary ant-btn-sm"]'
export const groupAddWindowClose = "button[class='ant-modal-close']"
export const groupAddWindowName = "//form[@class='ant-legacy-form ant-legacy-form-horizontal']//input[@id='name']"//"input[class='ant-input firstInput']"//input[placeholder="Name"]'
export const groupAddWindowDescription = '//input[@placeholder="Description"]'
export const groupAddWindowCloseButton = "button[class='ant-btn ant-btn-primary']"
export const groupAddWindowSubmitButton = "button[id='submitBtn']"

// DashBoard Xpaths
export const dashSideBarDashSvg = 'svg[type="chalkboard-teacher"]'
export const dashLogoAltXpath = "//img[@alt='iotium.io']"
export const error_xpath_selector = '//span[@class="kc-feedback-text"]';
export const errorclose_xpath_selector = '//span[@class="kc-feedback-text"]';
export const cluster_xpath_selector = '//span[@class="clusteringColorLegend"]';
export const userguide_xpath_selector = '//div[@class="userGuide"]';
export const logoutuserprofile_xpath_selector = '//svg[@type="user-circle"]'
export const userProfileText = { text: 'User Profile' }

// Login Element's and Xpath's
export const loginFormName = 'input[id="username"]'
export const loginFormPassword = 'input[id="password"]'
export const loginFormButton = 'input[name="login"]'
export const loginFormNameByName = '#username'
export const loginFormPasswordByName = '#password'
export const loginPage = '#kc-login'

// MFA Element,s and Xpath's
export const qrCodeImg = 'img#kc-totp-secret-qr-code'
export const otpForm = 'input[id="totp"]'
export const otpLoginButton = 'input[value="Login"]'
export const otpFirstSubmitButton = 'input[value="Submit"]'