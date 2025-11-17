// Global variables
let models = [];
let categories = {};
let popularModels = [];
let currentCategory = 'SUV';

// DOM elements
const popularModelsContainer = document.getElementById('popular-models');
const categoryTabs = document.getElementById('category-tabs');
const modelsTable = document.getElementById('models-table');
const modelDetail = document.getElementById('model-detail');
const backBtn = document.getElementById('back-btn');
const detailContent = document.getElementById('detail-content');

// Load models data
async function loadModels() {
    try {
        const response = await fetch('data/models.json');
        const data = await response.json();
        models = data.models;
        categories = data.categories;
        popularModels = data.popular;

        displayPopularModels();
        displayCategoryTabs();
        displayModelsByCategory('SUV');
    } catch (error) {
        console.error('Error loading models:', error);
        modelsTable.innerHTML = '<p>Error loading models. Please try again later.</p>';
    }
}

// Display popular models in header
function displayPopularModels() {
    popularModelsContainer.innerHTML = '';
    popularModels.forEach(modelId => {
        const model = models.find(m => m.id === modelId);
        if (model) {
            const popularBtn = document.createElement('div');
            popularBtn.className = 'popular-model';
            popularBtn.textContent = model.name;
            popularBtn.onclick = () => showModelDetail(model);
            popularModelsContainer.appendChild(popularBtn);
        }
    });
}

// Display category tabs
function displayCategoryTabs() {
    categoryTabs.innerHTML = '';
    Object.keys(categories).forEach(category => {
        const tab = document.createElement('div');
        tab.className = `category-tab ${category === currentCategory ? 'active' : ''}`;
        tab.textContent = category;
        tab.onclick = () => switchCategory(category);
        categoryTabs.appendChild(tab);
    });
}

// Switch category
function switchCategory(category) {
    currentCategory = category;
    displayCategoryTabs();
    displayModelsByCategory(category);
}

// Display models by category in table format
function displayModelsByCategory(category) {
    const categoryModels = categories[category].map(modelId =>
        models.find(m => m.id === modelId)
    ).filter(model => model);

    modelsTable.innerHTML = `
        <table class="models-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Model</th>
                    <th>Type</th>
                    <th>Year</th>
                    <th>Specifications</th>
                    <th>Versions & Pricing</th>
                </tr>
            </thead>
            <tbody>
                ${categoryModels.map(model => `
                    <tr>
                        <td><img src="${model.image}" alt="${model.name}" class="model-image" onerror="this.src='images/placeholder.jpg'"></td>
                        <td><span class="model-name" onclick="showModelDetail(${JSON.stringify(model).replace(/"/g, '"')})">${model.name}</span></td>
                        <td>${model.type}</td>
                        <td>${model.year}</td>
                        <td>
                            <div><strong>Engine:</strong> ${model.specifications.engine}</div>
                            <div><strong>Horsepower:</strong> ${model.specifications.horsepower}</div>
                            <div><strong>Fuel Economy:</strong> ${model.specifications.fuel_economy}</div>
                            <div><strong>Seating:</strong> ${model.specifications.seating}</div>
                        </td>
                        <td>
                            <ul class="versions-list">
                                ${model.versions.map(version => `
                                    <li>
                                        <div class="version-trim">${version.trim}</div>
                                        <div class="version-price">${version.price}</div>
                                        <div class="version-options">${version.options.join(', ')}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Show model detail
function showModelDetail(model) {
    modelsTable.style.display = 'none';
    modelDetail.style.display = 'block';

    detailContent.innerHTML = `
        <div class="model-overview">
            <h2>${model.name}</h2>
            <p><strong>Type:</strong> ${model.type}</p>
            <p><strong>Year:</strong> ${model.year}</p>
        </div>

        <h3>Specifications</h3>
        <table class="spec-table">
            <thead>
                <tr>
                    <th>Specification</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Engine</td>
                    <td>${model.specifications.engine}</td>
                </tr>
                <tr>
                    <td>Horsepower</td>
                    <td>${model.specifications.horsepower}</td>
                </tr>
                <tr>
                    <td>Torque</td>
                    <td>${model.specifications.torque}</td>
                </tr>
                <tr>
                    <td>Transmission</td>
                    <td>${model.specifications.transmission}</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>${model.specifications.dimensions}</td>
                </tr>
                <tr>
                    <td>Fuel Economy</td>
                    <td>${model.specifications.fuel_economy}</td>
                </tr>
                <tr>
                    <td>Seating</td>
                    <td>${model.specifications.seating}</td>
                </tr>
            </tbody>
        </table>

        <h3>Versions & Trims</h3>
        <table class="version-table">
            <thead>
                <tr>
                    <th>Trim</th>
                    <th>Price</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                ${model.versions.map(version => `
                    <tr>
                        <td>${version.trim}</td>
                        <td>${version.price}</td>
                        <td>${version.options.join(', ')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Event listeners
backBtn.addEventListener('click', () => {
    modelDetail.style.display = 'none';
    modelsTable.style.display = 'block';
});

// Initialize app
document.addEventListener('DOMContentLoaded', loadModels);