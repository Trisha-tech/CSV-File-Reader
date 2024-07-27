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

//Display the data in the form of table with required operation
updateUI = () => {
    //Parent Div
    var outerBox = document.getElementById('fileContent');
    outerBox.style.background = '#ccffff';
    outerBox.style.border = '4px Solid gray';
    outerBox.style.padding = '10px 10px 10px 10px';
    outerBox.style.marginTop = '10px';
    outerBox.style.overflow = 'auto';
    outerBox.style.textAlign = 'center';
    //h4

    //Elements div
    var elements = document.getElementById('toolBar');
    elements.style.borderBlock = 'inherit';
    elements.style.borderBlockColor = 'red';
    elements.style.marginBottom = '10px';
    elements.style.textAlign = 'center';
    elements.childNodes.forEach(item => {
        if (item.type == 'button') {
            var color = null;
            if (item.id == 'add') {
                color = 'lightblue';
            }
            if (item.id == 'edit') {
                color = 'lightgreen';
            }
            if (item.id == 'delete') {
                color = 'lightcoral';
            }
            if (item.id == 'save') {
                color = 'lightpink';
            }
            if (item.id == 'cancel') {
                color = 'lightsalmon';
            }
            if (item.id == 'download') {
                color = 'lightyellow';
            }
            if (item.id == 'filter') {
                color = 'lightseagreen';
            }
            if (item.id == 'removeDuplicate') {
                color = 'lightsteelblue';
            }
            if (item.id == 'addCol') {
                color = 'aquamarine';
            }
            if (item.id == 'enableChart') {
                color = 'darkkhaki';
            }


            item.style.margin = '5px';
            item.style.background = color;
        }

    });
    //table
    var table = document.getElementById('resultTable');
    table.style.width = '100%';

}


//Update the data in the file
updatePojo = () => {
    var masterPojoArray = [];
    for (var i = 0; i < masterArray.length; i++) {
        var item = masterArray[i];
        var items = item.split(',');
        var pojo = {};
        for (var j = 0; j < items.length; j++) {
            pojo[j] = items[j];
        }
        masterPojoArray.push(pojo);
    }

}

//Create the Header Section
createHeader = () => {
    var item = document.getElementById('fileContent');
    var header = document.createElement("h4");
    header.id = 'count';
    item.appendChild(header);
}

//Update the Header Section
updateHeader = (result) => {
    var header = document.getElementById("count");
    rows = result.split('\n').length;
    cols = result.split('\n')[0].split(',').length;
    header.innerHTML = 'Rows : ' + rows + ', Columns : ' + cols + ', Duplicates : ' + dupCount;
}

//Create the table for displaying data of the CSV file
createTable = () => {
    masterArray = [];
    masterPojoArray = [];
    var item = document.getElementById('fileContent');
    var table = document.createElement("table");
    table.id = 'resultTable';
    table.style.border = '1px solid black';
    table.style.borderCollapse = 'collapse';
    item.appendChild(table);
}

//Display the results of CSV file
getTable = () => {
    return document.getElementById('resultTable');
}

//Display the number of total rows present in the CSV file
getNthRow = (n) => {
    var table = getTable();
    return table.childNodes[n - 1];
}

//Display the number of total columns present in the CSV file
getNthColumn = (n) => {
    var column = [];
    var table = getTable();
    table.childNodes.forEach(row => {
        column.push(row.childNodes[n]);
    });
    return column;
}

//Create Row in the table and add the entries one by one
function createRow(e) {
    e = e.trim();
    if (e === '') return null;
    var table = document.getElementById('resultTable');
    var tr = document.createElement("tr");
    var items = e.split(',');
    items.forEach(e1 => tr.appendChild(createCol(e1)));
    if (masterArray.includes(e)) {
        console.log('duplicate entry ' + e);
        tr.style.color = 'red';
        dupCount++;
    }
    masterArray.push(e);
    var pojo = {};
    for (var j = 0; j < items.length; j++) {
        pojo[j] = items[j];
    }
    masterPojoArray.push(pojo);
    table.appendChild(tr);
}

////Create Column in the table 
createCol = (e) => {
    var td = document.createElement("td");
    td.style.border = '1px solid black';
    var node = document.createTextNode(e);
    td.setAttribute('onclick', 'editCol(this)');
    td.appendChild(node);
    return td;

}

//Update Column in the table 
editCol = (td) => {
    debugger;
    var itemType = td.childNodes[0].type;
    if (itemType != undefined) return;
    if (!isEdit) {
        isEdit = true;
        addRowSelectionUI(null);
    }
    var item = document.createElement('input');
    item.type = 'text';
    item.value = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(item);
    displayAllButtons('none');
    displaySaveAndCancel('block');
}

clear = () => {
    masterArray = [];
    dupCount = 0;
    masterPojoArray = [];
    isEdit = false;
    isDelete - false;
    document.getElementById('fileContent').innerHTML = '';
}

//Add all the required operations 
addTools = () => {
    var item = document.getElementById('fileContent');
    var toolBar = document.createElement('div');
    toolBar.id = 'toolBar';
    toolBar.style.padding = '10px 10px 10px 10px';
    item.appendChild(toolBar);
    populateToolBar(toolBar);
}

//Display the available operations
populateToolBar = (toolBar) => {
    addAddRowButton(toolBar);
    addAddColButton(toolBar);
    addEditRowButton(toolBar);
    addDeleteRowButton(toolBar);
    addSaveButton(toolBar);
    addCancelButton(toolBar);
    addRemoveDuplicateButton(toolBar);
    addDownloadButton(toolBar);
    addCreateChartButton(toolBar);
}
