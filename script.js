document.addEventListener('DOMContentLoaded', function () {
    loadEntries();
});

document.getElementById('lightUsageForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const hours = document.getElementById('hours').value;
    const team = document.getElementById('team').value;

    if (date && hours && team) {
        const newEntry = { date, hours, team };
        addEntryToTable(newEntry);

        fetch('https://api.github.com/repos/YOUR_GITHUB_USERNAME/soccer-pitch-light-tracking/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'update-data',
                client_payload: { data: JSON.stringify(newEntry) }
            })
        }).catch(error => console.error('Error saving entry:', error));

        document.getElementById('lightUsageForm').reset();
    }
});

function addEntryToTable(entry) {
    const table = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const dateCell = newRow.insertCell(0);
    const hoursCell = newRow.insertCell(1);
    const teamCell = newRow.insertCell(2);
    const actionCell = newRow.insertCell(3);

    dateCell.textContent = entry.date;
    hoursCell.textContent = entry.hours;
    teamCell.textContent = entry.team;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Cancella';
    deleteButton.onclick = function () {
        table.deleteRow(newRow.rowIndex - 1);
        removeEntryFromServer(entry);
    };
    actionCell.appendChild(deleteButton);
}

function loadEntries() {
    fetch('data.json')
        .then(response => response.json())
        .then(entries => entries.forEach(addEntryToTable))
        .catch(error => console.error('Error loading entries:', error));
}

document.getElementById('clearButton').addEventListener('click', function () {
    const tableBody = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";

    fetch('https://api.github.com/repos/YOUR_GITHUB_USERNAME/soccer-pitch-light-tracking/dispatches', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_type: 'clear-data'
        })
    }).catch(error => console.error('Error clearing entries:', error));
});

function removeEntryFromServer(entry) {
    fetch('https://api.github.com/repos/YOUR_GITHUB_USERNAME/soccer-pitch-light-tracking/dispatches', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_type: 'delete-data',
            client_payload: { data: JSON.stringify(entry) }
        })
    }).catch(error => console.error('Error deleting entry:', error));
}

document.getElementById('exportButton').addEventListener('click', function () {
    const table = document.getElementById('entriesTable');
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Data", "Ore di Luce Utilizzate", "Squadra"];
    csvContent += headers.join(",") + "\n";

    for (let i = 1; i < table.rows.length; i++) { 
        const row = table.rows[i];
        const rowData = [];

        for (let j = 0; j < row.cells.length - 1; j++) { 
            rowData.push(row.cells[j].textContent);
        }

        csvContent += rowData.join(",") + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "utilizzo_luci.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});