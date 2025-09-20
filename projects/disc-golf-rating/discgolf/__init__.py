"""Disc Golf Elo-based Rating System

This package provides an Elo-based rating system for disc golf players based on
their per-round performance. Lower round scores are considered better.
"""

from .elo_based_disc_golf import (
    expected_score,
    mov_multiplier,
    round_type_from_id,
    compute_multiplayer_elo_weighted_with_all_snapshots,
    load_long_from_excel,
    save_outputs,
)

__all__ = [
    "expected_score",
    "mov_multiplier",
    "round_type_from_id",
    "compute_multiplayer_elo_weighted_with_all_snapshots",
    "load_long_from_excel",
    "save_outputs",
]

__version__ = '0.1.0'
