# TwitchSweeper
Work in progress. If finished, you can play TwitchSweeper with your chat (turn and vote based).

## Settings
This game can be configured through URL parameters.

### Channel
`channel=<NAME>`

| Parameter | `channel` |
| --- | --- |
| Expectation | Username of Twitch channel |
| Default | `echtkpvlbot` |
| Warning | Programm will **not** throw an error on wrong input |

### Mode
`mode=<NUMBER>`

| Parameter | `mode` |
| --- | --- |
| Expectation | ID of the game mode |
| Default  | `0` |


| Mode | Width | Height | Mines | Name |
| :-----: | :-----: | :-----: | :-----: | -----: |
| `0` | 8 | 8 | 10 | Beginner |
| `1` | 16 | 16 | 40 | Intermediate |
| `2` | 16 | 30 | 99 | Expert |
| `8` | 26 | 14 | 45 | **Twitch** |
| `9` | 3 | 3 | 5 | _DEV_ |

### Timeout
`timeout=<NUMBER>`

| Parameter | `timeout` |
| --- | --- |
| Expectation | Timeout in seconds |
| Default | `1999` |
| Warning | Nobody knows what will happen or break if zero or something else than a positive integer is supplied |
| Note | The timeout starts after the first "move". If the timeout is reached and the game is still running, the page is reloaded regardless of losses. |

### Example
`https://echtkpvl.github.io/twitchsweeper/index.html?channel=echtkpvl&mode=8&timeout=1970`

---
## Credits
### 98.css
https://github.com/jdan/98.css

### Seven Segment Font
http://www.kraftilab.com/portfolio/7-segment-display-font/

https://www.cdnfonts.com/seven-segment.font

