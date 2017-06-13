// For todays date;
Date.prototype.today = function () {
    return (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

function updatePanel(panelId, panelCaption, xhttp) {
    let panel = document.getElementById(panelId);
    let currentDate = new Date();
    let dateTime = currentDate.today() + " " + currentDate.timeNow();
    let text = xhttp.responseText;
    let regex = /\"server\"\s*:\s*\"([a-zA-Z0-9]*)\",/g;
    let match = regex.exec(text);

    let serverId = (match != null && match.length >= 2) ? match[1] : "undefined";
    let isCdServer = serverId.indexOf("SOLARWINDSCD01") != -1 || serverId.indexOf("SOLARWINDSCD02") != -1;
    let isDRServer = serverId.indexOf("SOLARWINDSDR01") != -1 || serverId.indexOf("SOLARWINDSDR02") != -1;
    let statusMessage = "N/A";

    switch (serverId) {
        case "SOLARWINDSCD01":
        case "SOLARWINDSCD02":
            panel.className += " ok ";
            statusMessage = "OK";
            break;
        case "SOLARWINDSDR01":
        case "SOLARWINDSDR02":
            panel.className += " DR ";
            statusMessage = "DR";
            break;
        default:
            panel.className += " err ";
            statusMessage = "ERR";
    }

    let boxCaption = "<header><h1>" + panelCaption + "</h1></header><div class='badge'><span class='font-heavy'>"+ statusMessage +"</span></div><div class='content'><p>" + "Status: " + xhttp.status + "</p><p>" + serverId + "</p><p>" + dateTime + "</p></div>";
    panel.innerHTML = boxCaption;

}


function loadPage(panelId, panelCaption, url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            updatePanel(panelId, panelCaption, xhttp);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function loadStatus() {
    loadPage("solarwinds", "solarwinds.com", "http://www.solarwinds.com/?mira-monitoring-website");
    loadPage("dameware", "dameware.com", "http://www.dameware.com/?mira-monitoring-website");
    loadPage("webhelpdesk", "webhelpdesk.com", "http://www.webhelpdesk.com/?mira-monitoring-website");
    loadPage("kiwisyslog", "kiwisyslog.com", "http://www.kiwisyslog.com/?mira-monitoring-website");
}


loadStatus();
setInterval(loadStatus, 30 * 1000);