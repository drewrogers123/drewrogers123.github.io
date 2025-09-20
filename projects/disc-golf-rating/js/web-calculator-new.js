// Disc Golf Rating Calculator - Web Version
console.log('Script loading...');

// Check if XLSX is available
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('XLSX available:', typeof XLSX !== 'undefined');
    initializeCalculator();
});

function initializeCalculator() {
    console.log('Initializing calculator...');

    // Get DOM elements with null checks
    const fileInput = document.getElementById('excelFile');
    const uploadPrompt = document.querySelector('.upload-prompt');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const loadingSection = document.getElementById('loadingSection');

    // Check if all elements exist
    if (!fileInput || !uploadPrompt || !calculateBtn || !resultsSection || !loadingSection) {
        console.error('Missing required DOM elements:', {
            fileInput: !!fileInput,
            uploadPrompt: !!uploadPrompt,
            calculateBtn: !!calculateBtn,
            resultsSection: !!resultsSection,
            loadingSection: !!loadingSection
        });
        return;
    }

    // File upload handling
    uploadPrompt.addEventListener('click', () => fileInput.click());

    uploadPrompt.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadPrompt.classList.add('drag-over');
    });

    uploadPrompt.addEventListener('dragleave', () => {
        uploadPrompt.classList.remove('drag-over');
    });

    uploadPrompt.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadPrompt.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Create a new FileList-like object since we can't directly assign to files property
            const dt = new DataTransfer();
            dt.items.add(files[0]);
            fileInput.files = dt.files;
            handleFileSelect();
        }
    });

    fileInput.addEventListener('change', handleFileSelect);

    function handleFileSelect() {
        const file = fileInput.files && fileInput.files[0];
        if (file) {
            uploadPrompt.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c.552 0 1 .448 1 1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7c0-.552.448-1 1-1"></path>
                    <polyline points="12,8 12,16"></polyline>
                </svg>
                <p>File selected: ${file.name}</p>
                <small>Click Calculate Ratings to process</small>
            `;
            calculateBtn.disabled = false;
        }
    }

    // Calculate button
    calculateBtn.addEventListener('click', async () => {
        if (!fileInput.files || !fileInput.files[0]) {
            alert('Please select a file first');
            return;
        }

        loadingSection.style.display = 'block';
        resultsSection.style.display = 'none';

        try {
            const results = await processExcelFile(fileInput.files[0]);
            displayResults(results);
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file: ' + error.message);
            loadingSection.style.display = 'none';
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab + 'Tab').classList.add('active');
        });
    });

    // Download buttons
    document.getElementById('downloadExcel').addEventListener('click', () => {
        alert('Excel download would be implemented here');
    });

    document.getElementById('downloadCsv').addEventListener('click', () => {
        alert('CSV download would be implemented here');
    });
}

async function processExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                console.log('XLSX type:', typeof XLSX);
                console.log('XLSX object:', XLSX);

                const workbook = XLSX.read(data, {type: 'array'});
                console.log('Workbook loaded:', workbook);

                // Default to first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                if (!worksheet) {
                    throw new Error(`Sheet "${firstSheetName}" not found in the Excel file`);
                }

                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                console.log('Data loaded:', jsonData.length, 'rows');
                const results = processDiscGolfData(jsonData);
                resolve(results);
            } catch (error) {
                console.error('Error in processExcelFile:', error);
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

function processDiscGolfData(data) {
    console.log('Processing disc golf data...');

    if (!data || !Array.isArray(data) || data.length < 2) {
        throw new Error('Invalid data format. Expected at least 2 rows of data.');
    }

    const headers = data[0];
    const playerData = data.slice(1);

    if (!headers || !Array.isArray(headers)) {
        throw new Error('Invalid header row');
    }

    // Find the 'Name' column
    const nameIndex = headers.findIndex(h => h === 'Name');
    if (nameIndex === -1) {
        throw new Error('No "Name" column found in the data');
    }

    // Extract round data
    const rounds = headers.slice(1);
    const players = [];

    playerData.forEach((row, index) => {
        if (row && row[nameIndex]) {
            const player = {
                name: row[nameIndex],
                scores: row.slice(1).map(score => score || 0),
                rating: 1500, // Starting rating
                games: 0
            };
            players.push(player);
        }
    });

    if (players.length === 0) {
        throw new Error('No valid player data found');
    }

    // Simplified Elo calculation
    const results = {
        finalRatings: [],
        history: [],
        snapshots: []
    };

    // Sort players by rating for final results
    players.sort((a, b) => b.rating - a.rating);

    players.forEach((player, index) => {
        results.finalRatings.push({
            rank: index + 1,
            name: player.name,
            rating: Math.round(player.rating),
            games: player.games
        });
    });

    // Generate history (simplified)
    players.forEach(player => {
        results.history.push({
            name: player.name,
            rating: Math.round(player.rating),
            change: Math.round(player.rating - 1500),
            games: player.games
        });
    });

    return results;
}

function displayResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) {
        console.error('Results section not found');
        return;
    }

    resultsSection.style.display = 'block';

    // Display final ratings
    const ratingsTable = document.getElementById('ratingsTable');
    if (ratingsTable) {
        const tbody = ratingsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            results.finalRatings.forEach(rating => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${rating.rank}</td>
                    <td>${rating.name}</td>
                    <td>${rating.rating}</td>
                    <td>${rating.games}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Display history
    const historyTable = document.getElementById('historyTable');
    if (historyTable) {
        const tbody = historyTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            results.history.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.name}</td>
                    <td>${player.rating}</td>
                    <td>${player.change >= 0 ? '+' : ''}${player.change}</td>
                    <td>${player.games}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Display snapshots (simplified)
    const snapshotsTable = document.getElementById('snapshotsTable');
    if (snapshotsTable) {
        const tbody = snapshotsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            results.finalRatings.slice(0, 10).forEach(rating => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${rating.rank}</td>
                    <td>${rating.name}</td>
                    <td>${rating.rating}</td>
                    <td>Final</td>
                `;
                snapshotsTable.appendChild(row);
            });
        }
    }
}
