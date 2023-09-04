##### General

-   There are several components, independent of each other, can be restarted/scaled/changed without any loss of overall functionality.

##### Frontend

-   Used to be Dash Python + CSS.
-   As of August 2023 it is done with React Typescript, using Emotion for CSS and Vite as building tool.

##### Backend

-   Python FastAPI.
-   MongoDB for User information and most other data.
-   S3 Storage for Agent weights.

##### Worker

-   A Python Worker takes new Jobs from MongoDB database and launches a separate subprocess for a particular Job.
-   Background calculations can last up to several days, e.g. _Train_ an Agent for 100,000 episodes. User can launch a Job, come back later and observe results in the Logs Window.
-   Any Job can also be stopped graciously, saving current results, or killed immediately by the User himself or Admin.
-   I further plan to rewrite this engine in _Julia_.

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
