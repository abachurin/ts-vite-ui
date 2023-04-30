##### General

-   The board has two independent panes, _Agent_ (left) and _Game_ (right), top/bottom on smaller screen.
-   On the left side we can _Train_ or _Test_ an RL Agent.
-   A simple registration is necessary to unlock _Train_ function.
-   The Training process in particular can take a lot of time. As a registered User you can launch the process and come back next day to see the results and the logs.
-   On the right side one can _Watch_ any Agent to play, _Replay_ a Game, or _Play Yourself_. No registration necessary and all existing Agents/Games are available.

##### Train

-   Create new Agent or keep training existing one.
-   The most important parameter is N, it determines which feature function is employed. Higher N = more weights and better results. Agent with N = 3 already shows a spectacular performance compared to _Best Score_ strategy, for example.

##### Test

-   Collect statistics for an existing Agent.
-   The Agent is choosing next move by trying to make a move in all directions and taking the one with the highest internal evaluation. We can try to improve performance by looking `depth` moves ahead and trying `width` random tiles at each after-move stage when number of empty cells goes below `trigger`. This can slow down the agent significantly. Curiously, it does not seem to improve results at higher N values.
-   There are also two special options, for comparison with RL-trained Agents - _Random Moves_ and _Best Score_.

##### Watch

-   All the same parameters as for _Test_, but now we can watch the Agent play the game in real time.
-   The Agent can play a new Game, or just continue from position on the Board.
-   Actually, it plays very fast, ~3-4 seconds for a full game reaching 4096. But it won't be fun to watch. So maximum speed is limited.

##### Replay Game

-   Replays am existing Game.
-   Any Agent saves its best game so far during training.
-   The best game of the latest _Test_ run is saved.

##### Play Yourself

-   Of course, it is more convenient to use a standard mobile 2048 App if one just wants to play the game. I made this option initially to practice using Keyboard Dash-Extensions component, later deprecated in favor of EventListener.
-   One can switch between _Watch_ , _Game_ and _Play yourself_ and continue from existing Board position.
