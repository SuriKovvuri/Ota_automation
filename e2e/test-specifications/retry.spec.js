import { defineFeature, loadFeature } from 'jest-cucumber';
import { customScreenshot } from '../../utils/utils';

import { ReporterWrapper } from '../../utils/allure_wrapper';
var reporter = new ReporterWrapper()

const feature = loadFeature('./e2e/features/retry.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              }
                //tagFilter: '@test',
            });
            
defineFeature(feature, test => {
    afterEach(async () => {
        console.log("after each")
    })

    beforeEach(async () => {   
        console.log("before each")
        /*
        try {
            reporter.endStep()
        } catch (error) {
            console.log(error)
        } 
        */         
    })

    afterAll(async () => {
        console.log("after all")
    })

    beforeAll(async() => {
        console.log("before all")
        
    })

    test('Retry test', async ({
        given,
        when,
        and,
        then
    }) => {
        when('Retry', async() =>{
            reporter.startStep("when step")
            reporter.startStep("when substep")
            //let b = allure.startStep("in when")
            console.log("in when")
            //b.status="passed"
            //b.endStep()
            reporter.endStep()
            reporter.endStep()
            //allure.reporter.currentStep.status = "passed"
            //allure.reporter.popStep()
        })
        then('Pass', async() =>{
            //let a = reporter.startStep("Then Step")
            //let a = allure.startStep("then step")
            reporter.startStep("then step")
            console.log("in then")
            expect(true).toBe(false)
            reporter.endStep()
            //a.status="passed"
            //console.log(a)
            //a.endStep()
        })
    })

    test('Retry test2', async ({
        given,
        when,
        and,
        then
    }) => {
        when('Retry', async(table) =>{
            reporter.startStep("when2")
            console.log("in when2")
            reporter.endStep()
        })
        then('Pass', async(table) =>{
            reporter.startStep("then2")
            console.log("in then2")
            expect(true).toBe(true)
            reporter.endStep()
        })
    })
})