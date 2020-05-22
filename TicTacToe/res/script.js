$(function() {
    var playerSymb, computerSymb, game, x, o, sequence;
    initGame();
    $('#newGame').on('click', function() {
        location.reload();
    });
});

function initGame() {
    if (localStorage.getItem("scoreY") == null) localStorage.setItem("scoreY", 0);
    if (localStorage.getItem("scoreT") == null) localStorage.setItem("scoreT", 0);
    if (localStorage.getItem("scoreC") == null) localStorage.setItem("scoreC", 0);
    $('#menu table tr:last td').eq(0).html(localStorage.getItem("scoreY"));
    $('#menu table tr:last td').eq(1).html(localStorage.getItem("scoreT"));
    $('#menu table tr:last td').eq(2).html(localStorage.getItem("scoreC"));
    x = '<i class="fa fa-times"></i>';
    o = '<i class="fa fa-circle-o"></i>';
    var whoStart = Math.floor(Math.random() * 2) + 1; // 1 = player, 2 = computer
    playerSymb = (Math.floor(Math.random() * 2) == 0 ? x : o);
    computerSymb = (playerSymb == x ? o : x);
    game = [new Array(3), new Array(3), new Array(3)];
    start(whoStart);
}

function start(p) {
    if (p == 1) {
        $('#board table td').css('cursor', 'pointer').on('click', function() {
            if ($(this).is(':empty')) {
                $(this).html(playerSymb);
                game[parseInt($(this).parent().index())][parseInt($(this).index())] = (playerSymb == x ? 'x' : 'o');
                $('#board table td').off('click').css('cursor', 'unset');
                if (gameOver()) {
                    if (win(playerSymb)) {
                        setTimeout(function() {
                            $('#msgbox').html('You won!');
                            localStorage.setItem("scoreY", parseInt(localStorage.getItem("scoreY")) + 1);
                            $('#menu table tr:last td').eq(0).html(localStorage.getItem("scoreY"));
                        }, 500);
                    } else {
                        setTimeout(function() {
                            $('#msgbox').html('It\'s a draw.');
                            localStorage.setItem("scoreT", parseInt(localStorage.getItem("scoreT")) + 1);
                            $('#menu table tr:last td').eq(1).html(localStorage.getItem("scoreT"));
                        }, 500);
                    }
                } else {
                    start(2);
                }
            }
        });
    }

    if (p == 2) {
        computerMove();
        if (gameOver()) {
            if (win(computerSymb)) {
                setTimeout(function() {
                    $('#msgbox').html('I won!');
                    localStorage.setItem("scoreC", parseInt(localStorage.getItem("scoreC")) + 1);
                    $('#menu table tr:last td').eq(2).html(localStorage.getItem("scoreC"));
                }, 500);
            } else {
                setTimeout(function() {
                    $('#msgbox').html('It\'s a draw.');
                    localStorage.setItem("scoreT", parseInt(localStorage.getItem("scoreT")) + 1);
                    $('#menu table tr:last td').eq(1).html(localStorage.getItem("scoreT"));
                }, 500);
            }
        } else {
            setTimeout(function() {
                start(1);
            }, 500);
        }
    }

}

function computerMove() {
    if ($('#board table td:empty').length == 9 || ($('#board table td:empty').length == 8 && game[1][1] != undefined)) {
        var insertEl = $('#board table td').eq([0, 2, 6, 8][Math.floor(Math.random() * 4)]);
        setTimeout(function() {
            insertEl.html(computerSymb);
        }, 500);
        game[parseInt(insertEl.parent().index())][parseInt(insertEl.index())] = (computerSymb == x ? 'x' : 'o');
    } else if ($('#board table td:empty').length == 8 && $('#board table td:eq(0):empty, #board table td:eq(2):empty, #board table td:eq(6):empty, #board table td:eq(8):empty').length == 3) {
        var insertEl = $('#board table td').eq(4);
        setTimeout(function() {
            insertEl.html(computerSymb);
        }, 500);
        game[parseInt(insertEl.parent().index())][parseInt(insertEl.index())] = (computerSymb == x ? 'x' : 'o');
    } else {
        var bestVal = -1000,
            row, col;
        for (var i = 0; i < game.length; i++) {
            for (var j = 0; j < game.length; j++) {
                if (game[i][j] == undefined) {
                    game[i][j] = (computerSymb == x ? 'x' : 'o');
                    var moveVal = minimax(0, false);
                    game[i][j] = undefined;
                    if (moveVal > bestVal) {
                        row = i;
                        col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        var insertEl = $('#board table td').eq(row * 3 + col);
        setTimeout(function() {
            insertEl.html(computerSymb);
        }, 500);
        game[parseInt(insertEl.parent().index())][parseInt(insertEl.index())] = (computerSymb == x ? 'x' : 'o');
    }
}

function gameOver() {
    if (win(computerSymb) || win(playerSymb)) {
        $.each(sequence, function(index, value) {
            $('#board table td').eq(value).addClass('blink');
        });
        return true;
    }

    if (!isEmpty()) {
        $('#board table td').addClass('blink2');
        return true;
    }
    return false;
}

function isEmpty() {
    for (var i = 0; i < game.length; i++) {
        for (var j = 0; j < game.length; j++) {
            if (game[i][j] == undefined) return true;
        }
    }
    return false;
}

function win(p) {
    //check lines
    for (var i = 0; i < game.length; i++) {
        sequence = new Array(3);
        for (var j = 0; j < game.length; j++) {
            if (game[i][j] == (p == x ? 'x' : 'o')) sequence[j] = j + i * 3;
        }
        if (sequence.filter(x => x >= 0).length == 3) return true;
    }

    //check columns
    for (var i = 0; i < game.length; i++) {
        sequence = new Array(3);
        for (var j = 0; j < game.length; j++) {
            if (game[j][i] == (p == x ? 'x' : 'o')) sequence[j] = j * 3 + i;
        }
        if (sequence.filter(x => x >= 0).length == 3) return true;
    }

    //check diagonals
    sequence = new Array(3);
    for (var j = 0; j < game.length; j++) {
        if (game[j][j] == (p == x ? 'x' : 'o')) sequence[j] = j * 3 + j;
    }
    if (sequence.filter(x => x >= 0).length == 3) return true;

    sequence = new Array(3);
    for (var j = 0; j < game.length; j++) {
        if (game[j][game.length - 1 - j] == (p == x ? 'x' : 'o')) sequence[j] = game.length - 1 + 2 * j;
    }
    if (sequence.filter(x => x >= 0).length == 3) return true;

    return false;
}

function score(depth) {
    if (win(computerSymb)) return 10 - depth;
    if (win(playerSymb)) return depth - 10;
    return 0;
}

function over() {
    if (win(computerSymb) || win(playerSymb)) return true;
    if (!isEmpty()) return true;
    return false;
}

function minimax(depth, isMax) {
    if (over()) return score(depth);

    if (isMax) {
        var best = -1000;
        for (var i = 0; i < game.length; i++) {
            for (var j = 0; j < game.length; j++) {
                if (game[i][j] == undefined) {
                    game[i][j] = (computerSymb == x ? 'x' : 'o');
                    best = Math.max(best, minimax(depth + 1, !isMax));
                    game[i][j] = undefined;
                }
            }
        }
        return best;
    } else {
        var best = 1000;
        for (var i = 0; i < game.length; i++) {
            for (var j = 0; j < game.length; j++) {
                if (game[i][j] == undefined) {
                    game[i][j] = (playerSymb == x ? 'x' : 'o');
                    best = Math.min(best, minimax(depth + 1, !isMax));
                    game[i][j] = undefined;
                }
            }
        }
        return best;
    }


}