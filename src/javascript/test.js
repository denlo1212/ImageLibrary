const appStateTest = require('./domain/appState');
console.log(appStateTest.getState());

appStateTest.setCurrentPage(3)

console.log(appStateTest.getState());
