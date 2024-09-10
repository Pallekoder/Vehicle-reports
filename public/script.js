// public/script.js

function toggleLocationOptions() {
    const locationType = document.getElementById('locationType').value;
    const vognOptionsContainer = document.getElementById('vognOptionsContainer');
    if (locationType === 'vogn') {
        vognOptionsContainer.classList.remove('hidden');
    } else {
        vognOptionsContainer.classList.add('hidden');
    }
}

function toggleDamageSelectors() {
    const damageType = document.getElementById('damageType').value;
    const damageVehicleContainer = document.getElementById('damageVehicleContainer');
    const damageElHestContainer = document.getElementById('damageElHestContainer');
    if (damageType === 'vogn') {
        damageVehicleContainer.classList.remove('hidden');
        damageElHestContainer.classList.add('hidden');
    } else if (damageType === 'elHest') {
        damageVehicleContainer.classList.add('hidden');
        damageElHestContainer.classList.remove('hidden');
    } else {
        damageVehicleContainer.classList.add('hidden');
        damageElHestContainer.classList.add('hidden');
    }
}

function showAuth() {
    document.getElementById('auth').classList.remove('hidden');
}

function authenticate() {
    const password = document.getElementById('password').value;
    if (password === '2902') {
        document.getElementById('report').classList.remove('hidden');
        document.getElementById('auth').classList.add('hidden');
    } else {
        alert("Incorrect password.");
    }
}

function registerElHest() {
    const locationType = document.getElementById('locationType').value;
    const vogn = document.getElementById('vogn').value;
    const elHest = document.getElementById('elHest').value;

    if (!elHest) {
        alert("Please select an El-Hest.");
        return;
    }

    const report = {
        type: 'elHest',
        locationType,
        vogn,
        elHest,
        timestamp: new Date().toISOString()
    };

    fetch('/api/reports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
    }).then(response => response.json())
        .then(data => {
            alert(`El-Hest ${elHest} successfully registered.`);
            console.log(data);
        });
}

function registerDamage() {
    const damageType = document.getElementById('damageType').value;
    const vehicle = document.getElementById('damageVehicle').value;
    const elHest = document.getElementById('damageElHest').value;
    const elHestBrand = document.getElementById('elHestBrand').value;
    const description = document.getElementById('damageDescription').value;
    const reporterName = document.getElementById('reporterName').value;

    if (!damageType || !description || !reporterName ||
        (damageType === 'vogn' && !vehicle) ||
        (damageType === 'elHest' && (!elHest || !elHestBrand))) {
        alert("Please fill in all the details.");
        return;
    }

    const report = {
        type: 'damage',
        damageType,
        vehicle,
        elHest,
        elHestBrand,
        description,
        reporterName,
        timestamp: new Date().toISOString()
    };

    fetch('/api/reports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
    }).then(response => response.json())
        .then(data => {
            alert(`Damage reported successfully.`);
            console.log(data);
        });
}
