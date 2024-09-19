export class Example {
    constructor() {
        this.isInTest = false;
        this.testCompleted = false;
      }

    launch() {
        this.isInTest = true;
        this.testCompleted = true;
    }
}
