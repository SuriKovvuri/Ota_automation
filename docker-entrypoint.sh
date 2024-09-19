#!/bin/bash

cd /opt/qa-workflowautomation
#https://github.com/ryparker/jest-circus-allure-environment/issues/185
#sed -i '/code = prettier/c\        code = ""' /node_modules/jest-circus-allure-environment/dist/allure-reporter.js
#Below modified file is needed to show retry steps in allure overview
cp allure-reporter-modified.js /node_modules/jest-circus-allure-environment/dist/allure-reporter.js
ln -sf /node_modules node_modules
npm run $testbed

