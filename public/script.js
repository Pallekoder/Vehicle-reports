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
