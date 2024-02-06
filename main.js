// https://archive.org/details/win3_stock
class TwitchSweeper {
    constructor(diff, tblId) {
        this.difficulty = parseInt(diff);
        this.tableId = tblId;

        this.setup();
    }

    setup() {
        this.score = 0;
        this.won = null;
        this.x = 0;
        this.y = 0;
        this.mines = 0;
        this.turns = 0;
        this.savedata = [];
        this.flags = [];
        this.gameOver = false;
        this.startTime = false;

        switch (this.difficulty) {
            // DEV
            case 9:
                this.x = 3;
                this.y = 3;
                this.mines = 5;
                break;

            // Twitch
            case 8:
                this.x = 26;
                this.y = 14;
                this.mines = 45;
                break;

            // Expert
            case 2:
                this.x = 16;
                this.y = 30;
                this.mines = 99;
                break;

            // Intermediate
            case 1:
                this.x = 16;
                this.y = 16;
                this.mines = 40;
                break;

            // Beginner
            case 0:
            default:
                this.x = 8;
                this.y = 8;
                this.mines = 10;
        }

        for (let i = 0; i < this.x; i++) {
            this.flags[i] = [];
            this.savedata[i] = [];
            // loop the inner array
            for (let j = 0; j < this.y; j++) {
                this.flags[i][j] = false;
                this.savedata[i][j] = 0;
            }
        }

        for (let m = 1; m <= this.mines; m++) {
            let rand_width = Math.floor(Math.random() * this.x);
            let rand_height = Math.floor(Math.random() * this.y);

            if (this.savedata[rand_width][rand_height] === 0) {
                this.savedata[rand_width][rand_height] = 9;
            } else {
                m--;
            }
        }

        const bla = (x, y) => {
            if (x < 0) return
            if (y < 0) return
            if (x >= this.x) return
            if (y >= this.y) return
            if (this.savedata[x][y] === 9) return
            this.savedata[x][y]++
        }

        for (let i = 0; i < this.x; i++) {
            // loop the inner array
            for (let j = 0; j < this.y; j++) {
                if (this.savedata[i][j] === 9) {
                    bla(i - 1, j - 1);
                    bla(i, j - 1);
                    bla(i + 1, j - 1);
                    bla(i - 1, j);
                    bla(i + 1, j);
                    bla(i - 1, j + 1);
                    bla(i, j + 1);
                    bla(i + 1, j + 1);
                }
            }
        }

        for (let i = 0; i < this.y; i++) {
            let tmp = "|";
            for (let j = 0; j < this.x; j++) {
                tmp += this.savedata[j][i] + "|";
            }
            console.log(tmp);
        }
        console.log(this.savedata)

        this.draw();
    }

    draw() {
        let table = document.getElementById(this.tableId);
        table.innerHTML = '';

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(0));
        tr.appendChild(td);
        // loop the inner array
        for (let i = 0; i < this.x; i++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(i + 1));
            tr.appendChild(td);
        }
        table.appendChild(tr);

        for (let j = 0; j < this.y; j++) {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(String.fromCharCode(j + 'A'.charCodeAt(0))));
            tr.appendChild(td);
            // loop the inner array
            for (let i = 0; i < this.x; i++) {
                var d = this.savedata[i][j];
                var td = document.createElement('td');
                var span = document.createElement('span');
                span.appendChild(document.createTextNode(d % 10));
                span.onclick = function () { game.turn(i, j); }
                if (d < 10) {
                    td.classList.add('ts-a-' + d);
                } else {
                    td.classList.add('ts-z-' + d);
                }
                if (this.flags[i][j] === true) td.classList.add('flag');
                td.appendChild(span);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    turn(x, y) {
        if (this.gameOver !== false) return false;
        if (this.turns === 0) this.startTime = new Date();
        if (this.flags[x][y] === true) return false;
        this.turns++;

        if (this.gameOver === false && x >= 0 && y >= 0 && x < this.x && y < this.y) {
            if (this.savedata[x][y] === 9) {
                this.savedata[x][y] = 29;
                this.endGame();
            } else if (this.savedata[x][y] === 0) {
                this.savedata[x][y] += 10;

                try {
                    if (typeof this.savedata[x - 1][y - 1] !== 'undefined')
                        this.turn(x - 1, y - 1);
                } catch (e) { }
                try {
                    if (typeof this.savedata[x - 1][y] !== 'undefined')
                        this.turn(x - 1, y);
                } catch (e) { }
                try {
                    if (typeof this.savedata[x - 1][y + 1] !== 'undefined')
                        this.turn(x - 1, y + 1);
                } catch (e) { }
                try {
                    if (typeof this.savedata[x][y - 1] !== 'undefined')
                        this.turn(x, y - 1);
                } catch (e) { }
                try {
                    if (typeof this.savedata[x][y + 1] !== 'undefined')
                        this.turn(x, y + 1);
                } catch (e) { }
                try {
                    if (typeof this.savedata[x + 1][y - 1] !== 'undefined')
                        this.turn(x + 1, y - 1);
                } catch (e) { }
                try {
                    if (typeof this.savedata[x + 1][y] !== 'undefined')
                        this.turn(x + 1, y);
                } catch (e) { }
                try {
                    if (typeof this.savedata[x + 1][y + 1] !== 'undefined')
                        this.turn(x + 1, y + 1);
                } catch (e) { }
            } else {
                if (this.savedata[x][y] < 10) this.savedata[x][y] += 10;
            }
            this.draw();
        } else {
            if (this.turns > 1) this.turns--;
        }

        let remaining = 0;
        this.savedata.forEach(function each(item) {
            if (Array.isArray(item)) {
                // If is array, continue repeat loop
                item.forEach(each);
            } else {
                if (item <= 9) remaining++;
            }
        });

        if (remaining === this.mines) {
            this.endGame();
            this.won = true;
        }
    }

    flag(x, y) {
        if (this.gameOver !== false) return false;
        if (x >= 0 && y >= 0 && x < this.x && y < this.y) {
            this.flags[x][y] = !this.flags[x][y];
            this.draw();
        }
    }

    parseIRC(msg) {
        // magic
        if (/^([A-Za-z]\d{1,2}|\d{1,2}[A-Za-z])$/.test(msg)) {
            let x = msg.match(/\d+/)[0] - 1;
            let y = msg.match(/[A-Za-z]/)[0];
            y = y.toLowerCase().charCodeAt(0) - 97;
            this.turn(x, y);
        }

        if (/^!flag ([A-Z]\d{1,2}|\d{1,2}[A-Z])/i.test(msg)) {
            let tmp = msg.match(/([A-Za-z]\d{1,2}|\d{1,2}[A-Za-z])/gi)[0];
            let x = tmp.match(/\d+/)[0] - 1;
            let y = tmp.match(/[A-Za-z]/)[0];
            y = y.toLowerCase().charCodeAt(0) - 97;
            this.flag(x, y);
        }

        // magic
        if (/^!new$/.test(msg)) {
            this.setup();
        }
    }

    endGame() {
        this.gameOver = new Date();

        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (this.savedata[i][j] === 9 && this.flags[i][j] === false)
                    this.savedata[i][j] = 19;

                if (this.savedata[i][j] !== 9 && this.flags[i][j] === true)
                    this.flags[i][j] = false;
            }
        }

        this.draw();
    }

    getTime() {
        if (this.startTime === false) return '---';
        var end = new Date();
        if (this.gameOver !== false) end = this.gameOver;
        var diff = Math.floor((end - this.startTime) / 1000);
        return diff.toString().padStart(3, '0');
    }

    getMines() {
        let flagged = 0;
        this.flags.forEach(function each(item) {
            if (Array.isArray(item)) {
                // If is array, continue repeat loop
                item.forEach(each);
            } else {
                if (item === true) flagged++;
            }
        });

        if (flagged > this.mines) {
            return '-' + ((this.mines - flagged) * -1).toString().padStart(2, '0');
        }

        return (this.mines - flagged).toString().padStart(3, '0');
    }

    getGameOver() {
        return this.gameOver;
    }

    getState() {
        if (this.startTime === false) return 'new';
        if (this.gameOver === false) return 'running';
        if (this.won === true) return 'victory';
        if (this.gameOver !== false) return 'defeat';

        return 'error';
    }

    getSavestate() { }
    loadSavestate(data) { }

}
