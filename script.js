//Global Variables
var masterArray = [];
var dupCount = 0;
var masterPojoArray = [];
var isEdit = false;
var isDelete = false;

//Initialize the CSV file to the choose file button
function init() {
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}

//Handles the function after file selection
function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
}

//Load the data for further process and arrangement
function handleFileLoad(event) {
    clear();
    var result = event.target.result;
    parse(result);
}

//Perform all the required operations 
parse = (result) => {
    clear();
    if (result !== null && result !== undefined && result.trim() !== '') {
        createHeader();
        addTools();
        createTable();
        result.split('\n').forEach(e => createRow(e));
        updateHeader(result);
        updatePojo();
        updateUI();
    }
}
