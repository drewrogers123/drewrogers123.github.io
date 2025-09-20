#!/usr/bin/env python3
"""
Disc Golf Elo-based Rating Calculator

Reads an Excel file of player scores, computes Elo-based ratings across rounds, and writes
results to an output Excel workbook (and optionally CSVs).

- Lower scores are better (e.g., disc golf strokes). The pairwise scoring logic treats
  a lower score as a win against a higher score for that round.
- Margin of victory (MOV) scaling is supported.

Usage:
  python -m discgolf.elo_based_disc_golf --input "2025-26 Rankings History Sep 13.xlsx" --sheet "Sheet1"

See README.md for more.
"""
from __future__ import annotations

import argparse
import math
from typing import Dict, Tuple

import numpy as np
import pandas as pd

# --- Configuration Defaults ---
WEIGHTS = {"TR": 2, "CR": 1.5, "TN": 1.75}  # Elo K multipliers by round type
BASE_K = 24  # K factor
START_RATING = 1500
USE_MOV_DEFAULT = True  # Use margin-of-victory scaling by default
PRINT_TOP_N_DEFAULT = 25  # how many players to print per snapshot


def expected_score(r_i: float, r_j: float, cap: int = 300) -> float:
    """Expected score of player i vs j using Elo formula, with capped rating diff.

    We cap the rating difference to +/-cap for stability in lopsided matchups.
    """
    diff = r_j - r_i
    if diff > cap:
        diff = cap
    elif diff < -cap:
        diff = -cap
    return 1.0 / (1.0 + 10.0 ** (diff / 400.0))


def mov_multiplier(margin: float, rating_diff: float) -> float:
    if margin <= 0:
        return 1.0
    return math.log(1 + margin) * (2.2 / (0.001 * abs(rating_diff) + 2.2))


def round_type_from_id(round_id: str) -> str:
    if not isinstance(round_id, str):
        return "TR"
    token = round_id.split("-")[0].strip()
    token = token.split()[0] if token else "TR"
    return token if token in WEIGHTS else "TR"


def print_snapshot(ratings_dict: Dict[str, float], label: str, top_n: int) -> pd.DataFrame:
    """Print and return a snapshot DataFrame sorted by rating descending."""
    snap = (
        pd.DataFrame([{"player": p, "rating": r} for p, r in ratings_dict.items()])
        .sort_values("rating", ascending=False)
        .reset_index(drop=True)
    )
    print("\n" + "=" * 72)
    print(label)
    print("=" * 72)
    print(snap.head(top_n).to_string(index=False))
    return snap


def compute_multiplayer_elo_weighted_with_all_snapshots(
    long_df: pd.DataFrame,
    base_k: float = BASE_K,
    start_rating: float = START_RATING,
    use_mov: bool = USE_MOV_DEFAULT,
    print_top_n: int = PRINT_TOP_N_DEFAULT,
    quiet: bool = False,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Compute Elo-based ratings for a multi-player, per-round dataset.

    Expects long_df with columns: Name, round_id, score, round_seq
    Lower score is considered better.
    """
    ratings: Dict[str, float] = {}
    history_rows = []
    snapshots = []

    for seq, group in long_df.groupby("round_seq", sort=True):
        players = group["Name"].tolist()
        scores = group["score"].tolist()
        round_id = group["round_id"].iloc[0]
        rtype = round_type_from_id(round_id)
        k_round = base_k * WEIGHTS.get(rtype, 1.0)

        # ensure everyone has a starting rating
        for p in players:
            ratings.setdefault(p, start_rating)

        n = len(players)
        if n <= 1:
            # No-op round
            for p in players:
                history_rows.append(
                    {
                        "round_seq": seq,
                        "round_id": round_id,
                        "round_type": rtype,
                        "player": p,
                        "score": group.loc[group["Name"] == p, "score"].iloc[0],
                        "rating_pre": ratings[p],
                        "rating_post": ratings[p],
                        "delta": 0.0,
                        "K_effective": 0.0,
                    }
                )
            if not quiet:
                snap = print_snapshot(ratings, f"[SNAPSHOT] After {rtype} — {round_id}", print_top_n)
                snap["snapshot_label"] = f"After {round_id}"
                snap["round_id"] = round_id
                snap["round_type"] = rtype
                snap["round_seq"] = seq
                snapshots.append(snap)
            continue

        R = np.array([ratings[p] for p in players], dtype=float)
        S = np.zeros(n, dtype=float)
        E = np.zeros(n, dtype=float)
        W_total = np.zeros(n, dtype=float)

        for i in range(n):
            for j in range(n):
                if i == j:
                    continue
                e_ij = expected_score(R[i], R[j])
                E[i] += e_ij

                # lower score is better
                if scores[i] < scores[j]:
                    s_ij = 1.0
                    margin = scores[j] - scores[i]
                elif scores[i] > scores[j]:
                    s_ij = 0.0
                    margin = (scores[i] - scores[j]) * -1.0
                else:
                    s_ij = 0.5
                    margin = 0.0

                S[i] += s_ij

                if use_mov:
                    w_ij = mov_multiplier(max(0.0, margin), R[i] - R[j])
                else:
                    w_ij = 1.0
                W_total[i] += w_ij

        new_R = R.copy()
        for i in range(n):
            mov_w = (W_total[i] / (n - 1)) if use_mov and (n - 1) > 0 else 1.0
            delta = k_round * mov_w * (S[i] - E[i])
            new_R[i] = R[i] + delta

        for idx, p in enumerate(players):
            pre = ratings[p]
            post = float(new_R[idx])
            ratings[p] = post
            history_rows.append(
                {
                    "round_seq": seq,
                    "round_id": round_id,
                    "round_type": rtype,
                    "player": p,
                    "score": scores[idx],
                    "rating_pre": pre,
                    "rating_post": post,
                    "delta": post - pre,
                    "K_effective": k_round,
                }
            )

        if not quiet:
            snap = print_snapshot(ratings, f"[SNAPSHOT] After {rtype} — {round_id}", print_top_n)
            snap["snapshot_label"] = f"After {round_id}"
            snap["round_id"] = round_id
            snap["round_type"] = rtype
            snap["round_seq"] = seq
            snapshots.append(snap)

    history = (
        pd.DataFrame(history_rows).sort_values(["round_seq", "player"]).reset_index(drop=True)
    )
    final_ratings = (
        pd.DataFrame([{"player": p, "rating": r} for p, r in ratings.items()])
        .sort_values("rating", ascending=False)
        .reset_index(drop=True)
    )
    snapshots_df = (
        pd.concat(snapshots, ignore_index=True)
        if len(snapshots)
        else pd.DataFrame(
            columns=["player", "rating", "snapshot_label", "round_id", "round_type", "round_seq"]
        )
    )

    return final_ratings, history, snapshots_df


def load_long_from_excel(path: str, sheet: str) -> pd.DataFrame:
    df = pd.read_excel(path, sheet_name=sheet)
    keep_cols = [c for c in df.columns if c == "Name" or not str(c).lower().startswith("unnamed")]
    df = df[keep_cols].copy()

    long = df.melt(id_vars=["Name"], var_name="round_id", value_name="score")
    long = long[~pd.isna(long["score"])].copy()
    long["score"] = pd.to_numeric(long["score"], errors="coerce")
    long = long[~pd.isna(long["score"])].copy()

    round_order = {col: i for i, col in enumerate([c for c in keep_cols if c != "Name"])}
    long["round_seq"] = long["round_id"].map(round_order)
    long = long.sort_values(["round_seq", "round_id", "Name"]).reset_index(drop=True)
    return long


def save_outputs(
    final_ratings: pd.DataFrame,
    history: pd.DataFrame,
    snapshots: pd.DataFrame,
    output_excel: str,
    also_csv: bool = False,
) -> None:
    # Single Excel with all sheets
    with pd.ExcelWriter(output_excel, engine="openpyxl") as writer:
        final_ratings.to_excel(writer, sheet_name="Final Ratings", index=False)
        history.to_excel(writer, sheet_name="History", index=False)
        snapshots.to_excel(writer, sheet_name="Snapshots", index=False)

    print(f"\nSaved Excel file: {output_excel}")

    if also_csv:
        final_ratings.to_csv("disc_golf_elo_final_weighted.csv", index=False)
        history.to_csv("disc_golf_elo_history_weighted.csv", index=False)
        snapshots.to_csv("disc_golf_elo_snapshots.csv", index=False)
        print("Also wrote CSV files in current directory.")



def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Disc Golf Elo-based Rating Calculator")
    p.add_argument("--input", required=True, help="Path to input Excel file")
    p.add_argument("--sheet", default="Sheet1", help="Sheet name to read (default: Sheet1)")
    p.add_argument(
        "--output",
        default="disc_golf_elo_results.xlsx",
        help="Output Excel filename (default: disc_golf_elo_results.xlsx)",
    )
    p.add_argument("--no-mov", action="store_true", help="Disable margin-of-victory weighting")
    p.add_argument("--print-top-n", type=int, default=PRINT_TOP_N_DEFAULT, help="Top N to show in snapshots")
    p.add_argument("--quiet", action="store_true", help="Do not print snapshots")
    p.add_argument("--k", type=float, default=BASE_K, help="Base K factor (default: 24)")
    p.add_argument("--start", type=float, default=START_RATING, help="Starting rating (default: 1500)")
    p.add_argument("--csv", action="store_true", help="Also write CSVs alongside the Excel output")
    return p.parse_args()


def main() -> None:
    args = parse_args()

    try:
        long = load_long_from_excel(args.input, args.sheet)
    except FileNotFoundError:
        raise SystemExit(f"Input file not found: {args.input}")
    except ValueError as e:
        raise SystemExit(f"Error reading Excel: {e}")

    final_ratings, history, snapshots = compute_multiplayer_elo_weighted_with_all_snapshots(
        long_df=long,
        base_k=args.k,
        start_rating=args.start,
        use_mov=(not args.no_mov),
        print_top_n=args.print_top_n,
        quiet=args.quiet,
    )

    save_outputs(final_ratings, history, snapshots, args.output, also_csv=args.csv)


if __name__ == "__main__":
    main()
