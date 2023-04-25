* ###### General
  * There are 5 components, all independent of each other, can be restarted/scaled/changed without any loss of overall functionality.
  * At the moment it is all Python. The current plan is to rewrite *Frontend* in React JS, and *Worker* in Julia.
   
* ###### Frontend
  Dash Python. Only talks to Backend via http requests.
   
* ###### Backend
  FastAPI for main functionality. MongoDB for User information and exchange of other data. S3 Storage for Agent weights. Those are small for N <= 4, but rise to almost 400 Mb for N=6.
   
* ###### Queues and Workers
  * Initially a Redis Queue was employed, but it proved to be unsuited/unnecessary for the task.
  * Backend tasks are either very fast, responded straight away.
  * Or they are background calculations, which can last from several seconds to several days (*Train Agent* for 100,000 episodes, for example). Those are managed by a Python Worker Manager process. A separate worker is launched for a particular User with non-empty Job Queue, it takes Jobs from the user-specific Queue in MongoDB and executes one by one.
  * A user-dedicated worker is terminated by a parent process when there are no more Jobs. Any Job can also be killed by the User or Admin.
  * It can also be graciously stopped by the User.in this case the Job will continue until some reasonable nearest breakpoint, save the results and exit.

* ###### Deployment
  * App is currently deployed on DigitalOcean App Platform.
   
* ###### Resources
  * Frontend: https://github.com/abachurin/ui-2048
  * Backend: https://github.com/abachurin/api-2048
  * Worker: https://github.com/abachurin/worker-2048
  * Old version of the project, has some fun features no longer present: https://github.com/abachurin/2048
  