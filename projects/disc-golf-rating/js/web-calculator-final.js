// Disc Golf Rating Calculator - Web Version with Proper Elo Algorithm
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
    console.log('Processing disc golf data with proper Elo algorithm...');

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

    // Transform wide format to long format (like Python pandas melt)
    const rounds = headers.slice(1);
    const longData = [];

    playerData.forEach(row => {
        const playerName = row[nameIndex];
        if (playerName) {
            rounds.forEach((roundId, roundIndex) => {
                const score = row[nameIndex + 1 + roundIndex];
                if (score !== undefined && score !== null && score !== '') {
                    longData.push({
                        player: playerName,
                        round_id: roundId,
                        score: parseFloat(score),
                        round_seq: roundIndex
                    });
                }
            });
        }
    });

    if (longData.length === 0) {
        throw new Error('No valid score data found');
    }

    // Group by round sequence
    const roundGroups = {};
    longData.forEach(row => {
        if (!roundGroups[row.round_seq]) {
            roundGroups[row.round_seq] = [];
        }
        roundGroups[row.round_seq].push(row);
    });

    // Elo calculation parameters
    const START_RATING = 1500;
    const BASE_K = 24;
    const WEIGHTS = { "TR": 2, "CR": 1.5, "TN": 1.75 };
    const USE_MOV = true;

    // Initialize ratings
    const ratings = {};
    const historyRows = [];
    const snapshots = [];

    // Process each round
    Object.keys(roundGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(seq => {
        const group = roundGroups[seq];
        const players = group.map(row => row.player);
        const scores = group.map(row => row.score);
        const roundId = group[0].round_id;

        // Determine round type
        const roundType = roundId.split('-')[0].trim();
        const kRound = BASE_K * (WEIGHTS[roundType] || 1.0);

        // Ensure everyone has a starting rating
        players.forEach(player => {
            if (!(player in ratings)) {
                ratings[player] = START_RATING;
            }
        });

        const n = players.length;
        if (n <= 1) {
            // No-op round - add snapshot before processing
            snapshots.push({
                round_id: roundId,
                round_type: roundType,
                round_seq: parseInt(seq),
                ratings: Object.fromEntries(Object.entries(ratings).map(([p, r]) => [p, Math.round(r)]))
            });

            players.forEach((player, idx) => {
                historyRows.push({
                    round_seq: parseInt(seq),
                    round_id: roundId,
                    round_type: roundType,
                    player: player,
                    score: scores[idx],
                    rating_pre: ratings[player],
                    rating_post: ratings[player],
                    delta: 0.0,
                    K_effective: 0.0,
                });
            });
            return;
        }

        // Create arrays for calculations
        const R = players.map(player => ratings[player]);
        const S = new Array(n).fill(0);
        const E = new Array(n).fill(0);
        const W_total = new Array(n).fill(0);

        // Calculate expected scores and actual scores for each pair
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === j) continue;

                const e_ij = expectedScore(R[i], R[j]);
                E[i] += e_ij;

                // Lower score is better in disc golf
                let s_ij;
                let margin;
                if (scores[i] < scores[j]) {
                    s_ij = 1.0;
                    margin = scores[j] - scores[i];
                } else if (scores[i] > scores[j]) {
                    s_ij = 0.0;
                    margin = scores[i] - scores[j];
                } else {
                    s_ij = 0.5;
                    margin = 0.0;
                }

                S[i] += s_ij;

                if (USE_MOV) {
                    const ratingDiff = R[i] - R[j];
                    const w_ij = movMultiplier(Math.max(0.0, margin), ratingDiff);
                    W_total[i] += w_ij;
                } else {
                    W_total[i] += 1.0;
                }
            }
        }

        // Calculate new ratings
        const new_R = [...R];
        for (let i = 0; i < n; i++) {
            const mov_w = USE_MOV ? (W_total[i] / (n - 1)) : 1.0;
            const delta = kRound * mov_w * (S[i] - E[i]);
            new_R[i] = R[i] + delta;
            console.log(`Round ${roundId} - Player ${players[i]}: R=${R[i]}, S=${S[i]}, E=${E[i]}, delta=${delta}, new_rating=${new_R[i]}`);
        }

        // Update ratings and history
        players.forEach((player, idx) => {
            const pre = ratings[player];
            const post = new_R[idx];
            ratings[player] = post;

            historyRows.push({
                round_seq: parseInt(seq),
                round_id: roundId,
                round_type: roundType,
                player: player,
                score: scores[idx],
                rating_pre: pre,
                rating_post: post,
                delta: post - pre,
                K_effective: kRound,
            });
        });

        // Add snapshot after this round
        snapshots.push({
            round_id: roundId,
            round_type: roundType,
            round_seq: parseInt(seq),
            ratings: Object.fromEntries(Object.entries(ratings).map(([p, r]) => [p, Math.round(r)]))
        });
    });

    // Create final results - only show final ratings
    const finalRatings = Object.entries(ratings)
        .map(([player, rating]) => ({
            player,
            rating: Math.round(rating),
            games: 1 // Simplified - would need to count actual games played
        }))
        .sort((a, b) => b.rating - a.rating)
        .map((item, index) => ({
            rank: index + 1,
            player: item.player,
            rating: item.rating,
            games: item.games
        }));

    const history = historyRows
        .filter(row => row.round_seq === Math.max(...historyRows.map(r => r.round_seq)))
        .map(row => ({
            player: row.player,
            rating: Math.round(row.rating_post),
            change: Math.round(row.rating_post - row.rating_pre),
            games: 1
        }));

    return {
        finalRatings,
        history,
        snapshots
    };
}

function expectedScore(r_i, r_j, cap = 300) {
    let diff = r_j - r_i;
    if (diff > cap) diff = cap;
    else if (diff < -cap) diff = -cap;
    return 1.0 / (1.0 + Math.pow(10.0, diff / 400.0));
}

function movMultiplier(margin, ratingDiff) {
    if (margin <= 0) return 1.0;
    return Math.log(1 + margin) * (2.2 / (0.001 * Math.abs(ratingDiff) + 2.2));
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
                    <td>${rating.player}</td>
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
                    <td>${player.player}</td>
                    <td>${player.rating}</td>
                    <td>${player.change >= 0 ? '+' : ''}${player.change}</td>
                    <td>${player.games}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Display snapshots with actual round names - show ALL rounds like Python
    const snapshotsTable = document.getElementById('snapshotsTable');
    if (snapshotsTable && results.snapshots && results.snapshots.length > 0) {
        const tbody = snapshotsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            // Show ALL snapshots, one block for each round
            results.snapshots.forEach(snapshot => {
                // Add a header for this round
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = `<td colspan=\"4\" style=\"font-weight: bold; background: #f8fafc; padding: 10px; border-bottom: 1px solid #e5e7eb;\">After ${snapshot.round_id}</td>`;
                tbody.appendChild(headerRow);
                
                // Sort players by rating descending and show all players (not just top 10)
                Object.entries(snapshot.ratings)
                    .sort(([,a], [,b]) => b - a)
                    .forEach(([player, rating], index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${player}</td>
                            <td>${rating}</td>
                            <td></td>
                        `;
                        tbody.appendChild(row);
                    });
                
                // Add spacing between rounds
                const spacerRow = document.createElement('tr');
                spacerRow.innerHTML = '<td colspan=\"4\" style=\"height: 20px;\"></td>';
                tbody.appendChild(spacerRow);
            });
        }
    }
}
