document.getElementById('lightUsageForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const hours = document.getElementById('hours').value;
    const team = document.getElementById('team').value;

    if (date && hours && team) {
        const table = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        const dateCell = newRow.insertCell(0);
        const hoursCell = newRow.insertCell(1);
        const teamCell = newRow.insertCell(2);
        const actionCell = newRow.insertCell(3);

        dateCell.textContent = date;
        hoursCell.textContent = hours;
        teamCell.textContent = team;

        // Create a delete button for each row
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Cancella';
        deleteButton.onclick = function () {
            table.deleteRow(newRow.rowIndex - 1);
        };
        actionCell.appendChild(deleteButton);

        document.getElementById('lightUsageForm').reset();
    }
});

document.getElementById('exportButton').addEventListener('click', function () {
    const table = document.getElementById('entriesTable');
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Data", "Ore di Luce Utilizzate", "Squadra"];
    csvContent += headers.join(",") + "\n";

    for (let i = 1; i < table.rows.length; i++) { // Start from 1 to skip header row
        const row = table.rows[i];
        const rowData = [];

        for (let j = 0; j < row.cells.length - 1; j++) { // Exclude the last cell (actions)
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

document.getElementById('clearButton').addEventListener('click', function () {
    const tableBody = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Clear all rows
});