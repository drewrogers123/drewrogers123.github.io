# Disc Golf Elo-based Rating Calculator

Compute Elo-based ratings from an Excel sheet of per-round disc golf scores where lower scores are better.

## Features
- Weighted K by round type via `WEIGHTS` mapping (e.g., `TR`, `CR`, `TN`).
- Optional margin-of-victory (MOV) scaling.
- Prints top-N snapshots after each round (can be silenced).
- Outputs a single Excel file with sheets: `Final Ratings`, `History`, `Snapshots`.

## Requirements
Install Python packages from `requirements.txt`:

```bash
pip install -r requirements.txt
```

This installs:
- pandas
- numpy
- openpyxl

## Input Excel Format
Provide an Excel file with a `Name` column and one column per round. Any columns named `Unnamed: ...` are ignored.

Example header row:

```
Name, TR-Week1, TR-Week2, CR-Event1, ...
```

- `Name` is the player name.
- Each round column contains that player's score for the round.
- Lower scores are better.

## Usage
Run the module via Python:

```bash
python -m discgolf.elo_based_disc_golf \
  --input "2025-26 Rankings History Sep 13.xlsx" \
  --sheet "Sheet1" \
  --output "disc_golf_elo_results.xlsx" \
  --print-top-n 25
```

### Flags
- `--input` (required): Path to the input Excel file.
- `--sheet` (default `Sheet1`): Sheet name to read.
- `--output` (default `disc_golf_elo_results.xlsx`): Output Excel file path.
- `--no-mov`: Disable margin-of-victory weighting.
- `--print-top-n` (default 25): Limit for printed snapshot table.
- `--quiet`: Do not print snapshots to the console.
- `--k` (default 24): Base K factor.
- `--start` (default 1500): Starting rating for unseen players.
- `--csv`: Also write CSV versions of the three outputs.

## Notes
- Round type is inferred from the `round_id` (i.e., the round column name) by taking the token before `-`, matching keys in `WEIGHTS`. If no match, falls back to `TR`.
- The expected-score function caps rating differences to +/-300 before computing the Elo expectation for stability.
- Pairwise comparison logic assumes lower score wins. Adjust if using a format where higher is better.

## Project Layout
- `discgolf/elo_based_disc_golf.py` – main script and Elo-based logic
- `requirements.txt` – Python dependencies
- `README.md` – this file
