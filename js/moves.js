const SIGNALS = "XxKQkq";
const WHITE = false;
const BLACK = true;

function makeMove(move) {
	if (!turn) {
		document.getElementById("pgn").textContent += moveClock + ". " + moveToSAN(move);
		moveClock++;
	}
	else
		document.getElementById("pgn").textContent += " " + moveToSAN(move) + "\n";
	document.getElementById("pgn").scrollTop = document.getElementById("pgn").scrollHeight;

    if (['p', 'P'].includes(PIECES[board[move.source]]) || move.capture != 0)
        fiftyMoveClock = 0;
    else
        fiftyMoveClock++;
        
    enPassant = -1;
    turn = !turn;

    if (move.signal == SIGNALS.indexOf("X")) {
        K = false;
        Q = false;
    }
    if (move.signal == SIGNALS.indexOf("K"))
        K = false;
    if (move.signal == SIGNALS.indexOf("Q"))
        Q = false;

    if (move.signal == SIGNALS.indexOf("x")) {
        k = false;
        q = false;
    }
    if (move.signal == SIGNALS.indexOf("k"))
        k = false;
    if (move.signal == SIGNALS.indexOf("q"))
        q = false;

    if (move.castle) {
        castle(move.castle);
        return;
    }

    if (move.isEp) {
        board[move.dest] = board[move.source];
        board[move.source] = 0;

        let dir = 1;
        if (turn == WHITE)
            dir = -1;
        dir *= 12;

        board[move.dest + dir] = 0;
    
        return;
    }

    if (move.promote) {
        board[move.dest] = move.promote;
        board[move.source] = 0;
        return;
    }

    if (turn && board[move.source] == PIECES.indexOf("P") && move.source - move.dest == 24) {
        if (board[move.dest - 1] == PIECES.indexOf("p"))
            enPassant = move.dest + 12;
        if (board[move.dest + 1] == PIECES.indexOf("p"))
            enPassant = move.dest + 12;
    } else if (!turn && board[move.source] == PIECES.indexOf("p") && move.dest - move.source == 24) {
        if (board[move.dest - 1] == PIECES.indexOf("P"))
            enPassant = move.dest - 12;
        if (board[move.dest + 1] == PIECES.indexOf("P"))
            enPassant = move.dest - 12;
    }

    if (PIECES[board[move.source]].toLowerCase() == "k")
        king[!turn ? 1 : 0] = move.dest;

    board[move.dest] = board[move.source];
    board[move.source] = 0;
}
function castle(dir) {
    if (dir == 1) {
        if (turn) {
            board[114] = 0;
            board[117] = 0;
            board[116] = PIECES.indexOf("K");
            board[115] = PIECES.indexOf("R");
            king[0] = 116;
        } else {
            board[30] = 0;
            board[33] = 0;
            board[32] = PIECES.indexOf("k");
            board[31] = PIECES.indexOf("r");
            king[1] = 32;
        }
    } else if (dir == 2) {
        if (turn) {
            board[114] = 0;
            board[110] = 0;
            board[112] = PIECES.indexOf("K");
            board[113] = PIECES.indexOf("R");
            king[0] = 112;
        } else {
            board[30] = 0;
            board[26] = 0;
            board[28] = PIECES.indexOf("k");
            board[29] = PIECES.indexOf("r");
            king[1] = 28;
        }
    }
}

function moveToSAN(move) {
	if (move.castle == 1)
		return "O-O";
	if (move.castle == 2)
		return "O-O-O";

	let source = notationToSAN(move.source);
	let dest = notationToSAN(move.dest);

	let piece = PIECES[board[move.source]].toUpperCase();
	let promote = "";
	if (piece == "P") {
		piece = "";
		if (move.capture != 0)
			piece = notationToSAN(move.source)[0];
		if (move.promote != 0)
			promote = "=" + PIECES[move.promote];
	}

	let legalMoves = moveGen();
	let fileDes = "";
	let rankDes = "";
	for (let otherMove of legalMoves) {
		if (PIECES[board[otherMove.source]].toUpperCase() == piece && otherMove.dest == move.dest) {
			if (moveToUCI(otherMove) == moveToUCI(move))
				continue;

			let otherSource = notationToSAN(otherMove.source);
			if (otherSource[0] == source[0])
				rankDes = source[1];
			if (otherSource[1] == source[1])
				fileDes = source[0];
		}
	}
	
	console.log("=======================");

	return piece + fileDes + rankDes + (move.capture == 0 ? "" : "x") + dest + promote; 
}
function moveToUCI(move) {
	let asString = "";
    asString += notationToSAN(move.source);
    asString += notationToSAN(move.dest);
    if (move.promote != 0)
        asString += PIECES[move.promote].toLowerCase();
    return asString;
}

class Move {
    constructor(source, dest, capture, castle, promote, signal, isEp) { 
        this.source = source;
        this.dest = dest;
        this.capture = capture;
        this.castle = castle;
        this.promote = promote;
        this.signal = signal;
        this.isEp = isEp;
    }
}