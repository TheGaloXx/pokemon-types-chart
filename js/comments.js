// ============================================================
//  SCORE COMMENTS
//  Edit this file to add your own comments for percentage ranges.
//
//  Percent is computed as:
//      score / 120 * 100
//  where score = non-neutral matchups correct, minus changed ×1
//  matchups. Percent can be negative.
//
//  The first range that contains the percent wins.
//  min and max are inclusive.
//
//  Example: a score of 108 gives 90% -> "Pokémon Master!"
// ============================================================

window.SCORE_COMMENTS = [
    { min: 95, max: 100, text: "bue para flaco tan bien lo vas a hacer" },
    { min: 80, max: 94,  text: "bien ahi" },
    { min: 60, max: 79,  text: "por poco pasas el test de larper" },
    { min: 40, max: 59,  text: "EMMMM LARPER??" },
    { min: -999, max: 39, text: "horrendo" }
];
