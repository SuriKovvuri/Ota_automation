export class ReporterWrapper {
    constructor() {
    }
    startStep(name){
        allure.startStep(name)
    }
    endStep(){
        if (allure.reporter.currentStep != null) {
            allure.reporter.currentStep.status = "passed"
            allure.reporter.currentStep.stepResult.stop = Date.now()
            allure.reporter.popStep()
        }
    }
    addAttachment(name,fileName,type){
        if (allure.reporter.currentStep != null) {
            allure.attachment(name,fileName,type)
        }
    }
}