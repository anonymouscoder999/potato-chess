# Potato Chess

A chess engine written in C++ and compiled to Web Assembly

Features:
 * Written in C++ and compiled to web assembly using [Emscripten](https://github.com/emscripten-core/emscripten)
   * Compiled using the command `em++ -O3 -lembind -o engine.js *.cpp -fno-signed-zeros -freciprocal-math -ffp-contract=fast -ffinite-math-only -ffast-math`
   * Yes, I know options like `-ffast-math` will break floating point arithmetic, but none of them are used in my code and I see a small but real performance increase by using them
 * Can also be used as a desktop app (electron) for maximum performance
 * Bitboard-based move generator
 * 22 million nodes per second move generator
   * Keeps track of pinned pieces and the direction they are pinned
   * Keeps track of squares attacked by the opponent to prevent king from moving there
 * Tapered evaluation (uses game phase to "weigh" the importance of midgame score to endgame score) with piece tables
 * Minimax search with Alpha-Beta pruning
 * Transposition table with Zobrist Hashing
 * Move ordering is used to guess the strength of moves to speed up AB pruning
 * Syzygy endgame tablebase (powered by [Lichess](https://github.com/lichess-org/lila-tablebase))

By the way, the name "potato chess" comes from GothamChess' infamous video [1660 hung a piece on move 6](https://www.youtube.com/watch?v=7MRNWxCuIrI) where he calls the player a potato