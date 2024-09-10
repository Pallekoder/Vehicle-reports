document.addEventListener('DOMContentLoaded', () => {
    initializeFormOptions();
    fetchReports();
});

function initializeFormOptions() {
    const vognSelect = document.getElementById('vogn');
    const damageVognSelect = document.getElementById('damageVehicle');
    const elHestSelects = document.querySelectorAll('#elHest, #damageElHest');

    for (let i = 1; i <= 256; i++) {
        const vognOption = document.createElement('option');
        vognOption.value = i;
        vognOption.textContent = i;

        const elHestOption = document.createElement('option');
        elHestOption.value = i;
        elHestOption.textContent = i;

        vognSelect.appendChild(vognOption.cloneNode(true));
        damageVognSelect.appendChild(vognOption.cloneNode(true));

        elHestSelects.forEach(select => select.appendChild(elHestOption.cloneNode(true)));
    }
}

function toggleLocationOptions() {
    const locationType = document.getElementById('locationType').value;
    const vognOptionsContainer = document.getElementById('vognOptionsContainer');
    vognOptionsContainer.classList.toggle('hidden', locationType !== 'vogn');
}

function toggleDamageSelectors() {
    const damageType = document.getElementById('damageType').value;
    document.getElementById('damageVehicleContainer').classList.toggle('hidden', damageType !== 'vogn');
    document.getElementById('damageElHestContainer').classList.toggle('hidden', damageType !== 'elHest');
}

async function registerElHest() {
    const locationType = document.getElementById('locationType').value;
    const vogn = document.getElementById('vogn').value;
    const elHest = document.getElementById('elHest').value;
    const brand = document.getElementById('elHestBrand').value;

    if (locationType && elHest && brand) {
        const data = { locationType, vogn, elHest, brand };
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'register', data }),
            });

            if (response.ok) {
                alert('El-Hest registered successfully!');
                console.log('El-Hest registered successfully:', data);
                fetchReports();
            } else {
                const errorText = await response.text();
                console.error('Failed to register El-Hest:', errorText);
                alert(`Failed to register El-Hest. Error: ${errorText}`);
            }
        } catch (error) {
            console.error('Error registering El-Hest:', error);
            alert('A server error has occurred. See console for details.');
        }
    } else {
        alert('Please fill in all required fields.');
    }
}

async function registerDamage() {
    const damageType = document.getElementById('damageType').value;
    const damageVehicle = document.getElementById('damageVehicle').value;
    const damageElHest = document.getElementById('damageElHest').value;
    const elHestBrand = document.getElementById('elHestBrand').value;
    const damageDescription = document.getElementById('damageDescription').value;
    const reporterName = document.getElementById('reporterName').value;

    if (damageType && damageDescription && reporterName) {
        const data = {
            damageType,
            damageVehicle: damageType === 'vogn' ? damageVehicle : undefined,
            damageElHest: damageType === 'elHest' ? damageElHest : undefined,
            elHestBrand,
            damageDescription,
            reporterName,
        };
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'damage', data }),
            });

            if (response.ok) {
                alert('Damage reported successfully!');
                console.log('Damage reported:', data);
                fetchReports();
            } else {
                const errorText = await response.text();
                console.error('Failed to report damage:', errorText);
                alert(`Failed to report damage. Error: ${errorText}`);
            }
        } catch (error) {
            console.error('Error reporting damage:', error);
            alert('A server error has occurred. See console for details.');
        }
    } else {
        alert('Please fill in all required fields.');
    }
}

async function fetchReports() {
    try {
        const response = await fetch('/api/reports');
        if (response.ok) {
            const data = await response.json();
            console.log('Reports fetched:', data);

            if (data.currentReport) {
                document.getElementById('currentReport').innerHTML = formatCurrentReport(data.currentReport);
            }
            if (data.previousLocations) {
                document.getElementById('previousLocations').innerHTML = formatPreviousLocations(data.previousLocations);
            }
            if (data.damagesReport) {
                document.getElementById('damagesContainer').innerHTML = formatDamageReports(data.damagesReport);
            }
            document.getElementById('report-container').classList.remove('hidden');
        } else {
            const errorText = await response.text();
            console.error('Failed to fetch reports:', errorText);
            alert(`Failed to fetch reports. Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        alert('A server error has occurred. See console for details.');
    }
}

function formatPreviousLocations(reports) {
    return reports.map(report => `
        <div>
            <strong>Timestamp:</strong> ${new Date(report.timestamp).toLocaleString()}<br>
            <strong>El-Hest:</strong> ${report.elHest}<br>
            <strong>Vogn:</strong> ${report.vogn || 'N/A'}<br>
            <strong>Location Type:</strong> ${report.locationType}<br>
        </div>
        <hr>
    `).join('');
}

function formatCurrentReport(reports) {
    return reports.map(report => `
        <div style="color: ${report.locationType === 'warehouse' ? 'white' : 'green'}">
            El-Hest ${report.elHest} - ${report.locationType === 'vogn' ? `Vogn ${report.vogn}` : 'Warehouse'}
        </div>
        <hr>
    `).join('');
}

function formatDamageReports(damages) {
    return damages.map((damage, index) => {
        let color = 'white'; // Default color
        if (damage.reporterName.startsWith('*R*')) {
            color = 'red';
            damage.reporterName = damage.reporterName.replace('*R*', '');
        } else if (damage.reporterName.startsWith('*Y*')) {
            color = 'yellow';
            damage.reporterName = damage.reporterName.replace('*Y*', '');
        } else if (damage.reporterName.startsWith('*G*')) {
            color = 'green';
            damage.reporterName = damage.reporterName.replace('*G*', '');
        }

        return `
            <div id="damage-report-${index}" style="color: ${color}">
                ${damage.damageVehicle ? `Vogn ${damage.damageVehicle}` : `El-Hest ${damage.damageElHest} - ${damage.elHestBrand}`}
                - ${damage.damageDescription} - ${damage.reporterName}
            </div>
        `;
    }).join('');
}

function showReports() {
    fetchReports();
}

function toggleSection(id) {
    const elem = document.getElementById(id);
    elem.classList.toggle('hidden');
}
