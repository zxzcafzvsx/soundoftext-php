/* Helper constants and functions */

var constants = {
    SERVER_DOWNLOAD_URL:
        "http://soundoftext.com/server-download.php",
    USER_DOWNLOAD_URL:
        "http://soundoftext.com/user-download.php"
};

/* Shortcut for document.getElementById */
var $ = function(id) { return document.getElementById(id); };

function play(audioId) {
    $(audioId).play();
}

function addClass(element, newClass) {
    if (element.className == "") {
        element.className += newClass;
    } else {
        element.className += ' ' + newClass;
    }
}

/* Encodes URI-important characters, but only in the name, not the path
 * Dependent on path format of 'Language/filename.mp3' */
function encodeFileName(path) {
    var pathEnd = path.indexOf('/');
    var pathWithoutFile = path.substr(0, pathEnd + 1);
    var fileName = path.substr(pathEnd + 1);
    return pathWithoutFile + encodeURIComponent(fileName);
}

/* Click 'submit' when pressing Enter in the input box */

function keyPress(event) {
    if (event.keyCode == 13) {
        $('submit').click();
    }
}

/* Download file and display new row */

function submit() {
    var input = $('input');
    var text = input.value;

    if (text == "") return;
    input.value = "";

    var listHeader = $('list-header');
    if (listHeader.style.display === "") {
        listHeader.style.display = "block";
    }

    var langSelect = $('lang-select');
    var languageId = langSelect.value;
    var languageName = langSelect.options[langSelect.selectedIndex].innerHTML

    var filePath = download(text, languageId, languageName);
    display(filePath);
}

/* Download file to server */

function download(text, languageId, languageName) {
    var url = constants.SERVER_DOWNLOAD_URL
    url += "?text=" + encodeURIComponent(text) + "&id=" + languageId;
    url += "&name=" + languageName;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;
}

/* Display new row */

function display(filePath) {
    var table = $('results-table');
    var row = table.insertRow(0);
    addClass(row, 'results-row');

    alternateBackground(table, row);

    displayAudio(row, filePath);
    displayText(row, filePath);
    displayPlayButton(row, filePath);
    displaySaveButton(row, filePath);
}

function alternateBackground(table, row) {
    if (table.rows.length % 2 == 1) {
        addClass(row, 'color-row');
    }
}

function displayAudio(row, filePath) {
    var audio = genAudio(filePath);
    row.appendChild(audio);
}

function genAudio(filePath) {
    var source = document.createElement('source');

    /* Depends on a symbolic link 'audio' in the root directory that links to
     * the directory containing audio files */
    source.src = 'audio/' + encodeFileName(filePath);
    source.type = 'audio/mp3';

    var audio = document.createElement('audio');
    audio.id = filePath;
    audio.appendChild(source);

    return audio;
}

function displayPlayButton(row, filePath) {
    var btnPlay = genPlayButton(filePath);
    var btnPlayCell = row.insertCell(1);
    btnPlayCell.appendChild(btnPlay);
    addClass(btnPlayCell, 'btn-cell');
}

function genPlayButton(filePath) {
    var btnPlay = document.createElement('div');
    addClass(btnPlay, "btn");
    btnPlay.onclick = function() { play(filePath) }
    btnPlay.appendChild(document.createTextNode("Play"));
    return btnPlay;
}

function displaySaveButton(row, filePath) {
    var btnSave = genSaveButton(filePath);
    var btnSaveCell = row.insertCell(2);
    btnSaveCell.appendChild(btnSave);
    addClass(btnSaveCell, 'btn-cell');
}

function genSaveButton(filePath) {
    var btnSave = document.createElement('a');
    addClass(btnSave, "btn");
    addClass(btnSave, "btn-save");

    btnSave.href = constants.USER_DOWNLOAD_URL;
    btnSave.href += "?file=" + encodeFileName(filePath);

    btnSave.appendChild(document.createTextNode("Save"));
    return btnSave;
}

function displayText(row, filePath) {
    var text = document.createTextNode(filePath);
    var textCell = row.insertCell(0);
    textCell.appendChild(text);
    addClass(textCell, 'text-cell');
}
