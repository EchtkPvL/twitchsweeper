const urlParams = new URLSearchParams(window.location.search);
const channel = urlParams.get('channel') ?? 'echtkpvlbot';
const mode = urlParams.get('mode') ?? 0;
const timeout = urlParams.get('timeout') ?? 1999;

var game = new TwitchSweeper(mode, 'game');

setInterval(gameMeta, 123);
function gameMeta() {
    var time = game.getTime();
    if (time > timeout) window.location.reload();
    document.getElementById('time').innerHTML = time;

    var mines = game.getMines();
    document.getElementById('score').innerHTML = mines;

    var state = game.getState();
    var el = document.getElementById('action');
    var btn = document.createElement('button');
    btn.appendChild(document.createTextNode(state));
    el.innerHTML = '';
    el.appendChild(btn);

    var state = game.getGameOver();
    if (state !== false) state = '"!new" to restart';
    document.getElementById('status').innerHTML = state;
}

const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
ws.onopen = function (openEvent) {
    ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    ws.send("PASS oauth:abcdefghijklmnopqrstuvwxyz0123");
    ws.send("NICK justinfan" + Math.random().toString().substr(2, 16));
    ws.send("JOIN #" + channel);
};
ws.onmessage = function (messageEvent) {
    var parsed = parseMessage(messageEvent.data);
    if (parsed === null) {
        console.log(messageEvent);
        return;
    }
    console.log(parsed);
    var msg = parsed.message;

    if (parsed.command === "PRIVMSG") {
        document.getElementById('wip').innerHTML = parsed.username;
        console.log("MSG: " + msg + " from " + parsed.username);
        game.parseIRC(msg);
    } else if (parsed.command === "PING") {
        document.getElementById('wip').innerHTML = "ping<->pong";
        ws.send("PONG :" + msg);
    }
};
ws.onclose = function (closeEvent) {
    document.getElementsByClassName("title-bar-text")[0].innerHTML = "WebSocket closed o.O";
    console.log(closeEvent);
};

// Credits to: https://stackoverflow.com/questions/50383115
function parseMessage(rawMessage) {
    var parsedMessage = {
        message: null,
        tags: null,
        command: null,
        original: rawMessage,
        channel: null,
        username: null
    };

    if (rawMessage[0] === '@') {
        var tagIndex = rawMessage.indexOf(' '),
            userIndex = rawMessage.indexOf(' ', tagIndex + 1),
            commandIndex = rawMessage.indexOf(' ', userIndex + 1),
            channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
            messageIndex = rawMessage.indexOf(':', channelIndex + 1);

        parsedMessage.tags = rawMessage.slice(0, tagIndex);
        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
        parsedMessage.message = rawMessage.slice(messageIndex + 1).trim();
    } else if (rawMessage.startsWith("PING")) {
        parsedMessage.command = "PING";
        parsedMessage.message = rawMessage.split(":")[1];
    }

    return parsedMessage;
}