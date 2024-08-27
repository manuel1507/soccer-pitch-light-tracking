document.getElementById('lightUsageForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const hours = document.getElementById('hours').value;

    if (date && hours) {
        const table = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        const dateCell = newRow.insertCell(0);
        const hoursCell = newRow.insertCell(1);

        dateCell.textContent = date;
        hoursCell.textContent = hours;

        document.getElementById('lightUsageForm').reset();
    }
});

document.getElementById('exportButton').addEventListener('click', function () {
    const table = document.getElementById('entriesTable');
    let csvContent = "data:text/csv;charset=utf-8,";

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowData = [];

        for (let j = 0; j < row.cells.length; j++) {
            rowData.push(row.cells[j].textContent);
        }

        csvContent += rowData.join(",") + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "light_usage.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
