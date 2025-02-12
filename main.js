const fs = require('fs');
const path = require('path');

// Path to the Lua file (make sure to use the correct path here)
const luaFilePath = path.join('vehicles.lua');

// Function to extract vehicle models using the model variable from the Lua file
function extractVehicleModels(luaFilePath) {
    try {
        const luaContent = fs.readFileSync(luaFilePath, 'utf-8');

        // Regex to match the 'model' key and extract its value (handles both single and double quotes)
        const vehicleModels = luaContent.match(/model\s*=\s*['\"]([\w\d_-]+)['\"]/g);

        // If no models are found, return an empty object
        if (!vehicleModels) return {};

        // Count the occurrences of each model
        const modelCounts = {};
        vehicleModels.forEach(model => {
            const modelName = model.match(/[\w\d_-]+/)[0]; // Extract the model name from the match
            modelCounts[modelName] = modelCounts[modelName] ? modelCounts[modelName] + 1 : 1;
        });

        return modelCounts;
    } catch (err) {
        console.error(`Error reading the Lua file: ${err.message}`);
        return {};
    }
}

// Function to load tracked data from a JSON file
function loadTrackedData() {
    return {};  // No file loading or tracking now
}

// Extract current vehicle models from the Lua file
const currentVehicleModels = extractVehicleModels(luaFilePath);

// If no models are extracted, exit the script
if (Object.keys(currentVehicleModels).length === 0) {
    console.log('No vehicle models found in the Lua file.');
    process.exit();
}

// Load previously tracked models (not using any file now)
const previousVehicleModels = loadTrackedData();

// Track changes by comparing the current models to previous ones
const addedModels = {};
const removedModels = {};
const changedModels = {};

// Check for added and removed models
for (const model in currentVehicleModels) {
    if (!previousVehicleModels[model]) {
        addedModels[model] = currentVehicleModels[model];
    } else if (previousVehicleModels[model] !== currentVehicleModels[model]) {
        changedModels[model] = [previousVehicleModels[model], currentVehicleModels[model]];
    }
}

for (const model in previousVehicleModels) {
    if (!currentVehicleModels[model]) {
        removedModels[model] = previousVehicleModels[model];
    }
}

// Output the results
console.log(`Total unique vehicle models: ${Object.keys(currentVehicleModels).length}`);
console.log(`Added models:`, addedModels);
console.log(`Removed models:`, removedModels);
console.log(`Changed models:`, changedModels);

// No saving step is required now
