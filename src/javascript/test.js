// Assuming AppState is defined as before
const appStateTest = require('./domain/appState');

console.log(appStateTest.getState()); // Initial state

appStateTest.setIsDialogOpen(true)

console.log(appStateTest.getState())

