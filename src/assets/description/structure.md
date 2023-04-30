##### General

-   There are 5 components, all independent of each other, can be restarted/scaled/changed without any loss of overall functionality.
-   At the moment it is all Python.
-   The current plan is to rewrite _Frontend_ in React JS, and _Worker_ in Julia.

##### Frontend

-   Use to be Dash Python + CSS.
-   As of May 2023 the _Frontend_ is in React Typescript, using Emotion for CSS and Vite for development.

##### Backend

-   Python FastAPI.
-   MongoDB for User information and most other data.
-   S3 Storage for Agent weights. Those are small for N <= 4, but rise to almost 400 Mb for N=6.

##### Queues and Workers

-   Initially a Redis Queue was employed, but it proved to be unsuited/unnecessary for the task.
-   Backend tasks are either very fast, responded straight away.
-   Or background calculations, which can last up to several days, e.g. _Train_ an Agent for 100,000 episodes. Those are managed by a Python Worker Manager process. It launches a separate worker subprocess for a particular User with non-empty Job Queue, it takes Jobs from the user-specific Queue, which holds only Job parameters in the User information in MongoDB.
-   This user-dedicated worker is terminated by a parent process when there are no more Jobs. Any Job can also be stopped graciously or killed immediately by the User himself or Admin.

##### Deployment

-   Used to be in AWS Beanstalk with Github Actions for CI/CD.
-   Currently deployed on DigitalOcean App Platform.

##### Resources

-   Frontend: <a href="https://github.com/abachurin/ts-vite-ui" target="_blanc">https://github.com/abachurin/ts-vite-ui</a>
-   Backend: <a href="https://github.com/abachurin/api-2048" target="_blanc">https://github.com/abachurin/api-2048</a>
-   Worker: <a href="https://github.com/abachurin/worker-2048" target="_blanc">https://github.com/abachurin/worker-2048</a>

-   Legacy Python code:
    -   Python Frontend: <a href="https://github.com/abachurin/ui-2048" target="_blanc">https://github.com/abachurin/ui-2048</a>
    -   Oldest version of the project, just one component (Dash is a full-stack framework). Has some fun features no longer present, can be run just by python with no web, animation done with Pygame: <a href="https://github.com/abachurin/2048" target="_blanc">https://github.com/abachurin/2048</a>
