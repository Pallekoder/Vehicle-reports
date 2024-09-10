        }

        return res.status(405).send('Method Not Allowed');
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).send('Internal Server Error');
    }
};

function handleRegister(data) {
    const { elHest, locationType, vogn, brand } = data;

    // Update current report
    const existingIndex = reports.currentReport.findIndex(report => report.elHest === elHest);
    if (existingIndex > -1) {
        reports.previousLocations.push({ ...reports.currentReport[existingIndex], endTimestamp: new Date() });
        reports.currentReport.splice(existingIndex, 1);
    }

    reports.currentReport.push({ timestamp: new Date(), elHest, locationType, vogn });
    const elHestIndex = reports.availableElHeste.findIndex(report => report.elHest === elHest);
    if (elHestIndex !== -1) {
        reports.availableElHeste[elHestIndex].locationType = locationType;
        reports.availableElHeste[elHestIndex].vogn = vogn;
        reports.availableElHeste[elHestIndex].brand = brand;
    }
}

function handleDamage(data) {
    const { damageElHest, damageType, damageDescription, reporterName, damageVehicle, elHestBrand } = data;

    const damageReport = {
        timestamp: new Date(),
        damageType,
        damageDescription,
        reporterName,
    };

    if (damageElHest) {
        damageReport.damageElHest = damageElHest;
        damageReport.elHestBrand = elHestBrand; // Include brand information
        reports.availableElHeste = reports.availableElHeste.map(el =>
            el.elHest === damageElHest ? { ...el, locationType: 'broken', description: damageDescription } : el
        );
    } else if (damageVehicle) {
        damageReport.damageVehicle = damageVehicle;
    }

    reports.damagesReport.push(damageReport);
}
