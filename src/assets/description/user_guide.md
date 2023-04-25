* ###### General
  * The board has two independent panes, *Agent* (left) and *Game* (right), which switch to top/bottom on smaller screen.
  * On the left side we can *Train Agent* or *Collect Agent Statistics*. A simple registration is necessary to unlock left pane functions, and a User has access only to her Agents. The Training process in particular can take a lot of time. A registered User can launch the process and come back next day to see the results in the Log Window.
  * On the right side one can *Watch Agent Play*, *Replay Game* or *Play Yourself*. No registration necessary and all Agents/Games are available.
   
* ###### Train Agent
  * We can train new Agent, or keep training existing one. The most important parameter is N, it determines which feature function is employed. 
  * With higher N - more weights and better results. But Agent with N = 3 already shows a spectacular performance compared to *Best Score* strategy, for example.
  * Values of N > 4 are locked for an ordinary *Guest* status user.
   
* ###### Agent Statistics
  * Collect statistics for an existing Agent. The Agent is choosing next move by trying to make a move in all directions and taking the one with the highest internal evaluation. We can try to improve performance by looking `depth` moves ahead and trying `width` random tiles at each after-move stage when number of empty cells goes below `trigger`. This can slow down the agent significantly. Curiously, it does not seem to improve results at higher N values. 
  * There are also two special options, for comparison with RL-trained Agents - *Random Moves* and *Best Score*.
   
* ###### Watch Agent Play
  All the same parameters as above, but now we can watch the Agent play one game in real time. Actually, it plays very fast, ~3-4 seconds for a full game reaching 4096. But a Browser can't render it so fast, besides it won't be fun to watch. So maximum speed is limited. Agents created by anyone are available.
   
* ###### Replay Game
  Replays a chosen stored Game. Any Agent saves a currently best game during training, also the best game of the latest *Collect Statistics* run is saved. Games created by anyone are available.
   
* ###### Play Yourself
  * Of course, it is more convenient to use a standard mobile 2048 App if one just wants to play the game. I made this option initially to practice using Keyboard Dash-Extensions component (later deprecated in favor of EventListener).
  * One can switch between *Watch Agent* and *Play yourself* and continue from existing Board position.