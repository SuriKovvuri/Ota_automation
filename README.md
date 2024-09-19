# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up.
    - Primarily includes below packages
        - Framework : jest
        - Gherkins/bdd : jest-cucumber
        - Orch interface from framework : puppeteer(CDP - For browser interface) 
        - Expect : puppeteer-expect 
        - Reporting : Allure
    - All these packages are maintained by npm. Versions are pinned in package.json file
* How to bringup setup
    - Ensure npm and node version in your execution host/laptop
        - npm - 6.13.4
        - nodejs - v8.17.0. 
        - nodejs can be installed using below steps
            - curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
            - sudo apt-get install -y nodejs
    - Install dependent libs/packages with below command.
        - sudo apt-get install -yq --no-install-recommends libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libnss3 
    - From "qa-workflowautomation", give "npm install" from your user, not as root.
        - This will install all packages mentioned in package.json
        - And this will create a new file package-lock.json. Here, we can cross verify the sha values/git commits of installed packages.
        - If we endup in any issues during intsallation, we can reinstall by following below steps
            - Remove pakage-lock.json. Ensure versions are correct in package.json
            - Remove node_modules folder
            - npm install 
    - Allure commandline can be installed using
        - sudo apt-add-repository ppa:yandex-qatools/allure-framework
        - sudo apt-get update
        - sudo apt-get install allure-commandline
        - (or)
        - npm install allure-commandline --save-dev 
        - Setup should be good for a test run    
* Configuration
    - Jest - e2e/jest.config.js & e2e/jest.setup.js
        - Ensure we give correct "testMatch" to look for test files in e2e/jest.config.js
        - in "globals", we set env. E.g. "env": "staging" looks for e2e/env/staging_config for setup details
        - In e2e/jest.setup.js, primarily all timoeouts are defined; However, they can be overruled by config at specific test files.
        - E.g jest.setTimeout(120000) sets timeout for a test as 2 mins globally. This can be overruled by jest.setTimeout(300000) in .spec file
    - Jest-cucumber - e2e/jest-cucumber-config.js
        - Primarily, we set the "tagFilter" here to control the tagged tests to run globally
        - "tagFilter" in .spec file takes precedence over global config.
        - So, ensure we do not checkin tagfilter in .spec file. So that, we always have global control on what tests to run.
    - Puppeteer - jest-puppeteer.config.js
        - Primarily, we set the "headless" config & "browser"
        - "headless: false" - Runs the test by opening the browser and vice-versa   
* Dependencies
* Database configuration
* How to run tests
    - npm run <script>
    - <script> is mentioned in package.json.
    - E.g:
        - npm run e2e
        - npm run report
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
### References ###
  - https://jestjs.io/
  - https://github.com/puppeteer/puppeteer/blob/master/docs/api.md
  - https://github.com/smooth-code/jest-puppeteer/blob/master/packages/expect-puppeteer/README.md
  - https://www.toptal.com/puppeteer/headless-browser-puppeteer-tutorial - For installation.
