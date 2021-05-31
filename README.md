#RAPI
This is a copy of a group project that I was a member of.
Link to original repository -> https://gitlab.labranet.jamk.fi/AA9358/service-oriented-applications


## TTOW0130 example project

This repository showcases so of the options and way of developing the REST API.
It represents a image gallery service, as a backend API.

API-documentation: https://documenter.getpostman.com/view/10805964/TzRREUos <br>
Postman workspace: https://app.getpostman.com/join-team?invite_code=66a491968d4c035e3ba409b703bc6bba&ws=ab49a768-fe41-4886-9d2d-d7d49badd64c

## Final report
### Time tracking

- Vanessa: 120 hours
- Adam: 90 hours 
- Tabea: 99 hours
- Viacheslav: 100 hours

### Parts of the projects, that were easy
- The routes, were you had early an idea how to do it, were good
- Some of the REST Routes

### Parts that were hard
- Connect new bits to the existing code, because I was unsure about the communication between the parts
- Use external services and make them known to each other (like Redis or Graylog)
- Manage to set a limit for upVote and downVote selected images for every user to 1.
- More complex project than most students projects before: Problems for the interaction of the different services, different kind service that we had not worked with before. But closer to real work projects than anything else.
- automated tests: Postman seems not to be good tool for more complex testing scenarios. In future we would choose in-code testing frameworks instead.
- how to setup runners and pipelines in gitlab, it got easier 

### Greatest learning experience
- Use a simple framework and add just the parts you needed, was a cool experience
- We learned a lot of small things and understand the concept of service oriented applications better
- Working with the team on the new technology.
- Using a more complex system of services, interesting new technologies and concepts

### What we implemented and what we left out
We implemented almost all requirements (from core, advanced, extra and special requirements listed at the assignment page).<br>
For every REST endpoint that we created we thought about possible errors or checked for falsy requests. In that case we send an error message and a spefic http-error-code that matches. <br> 
We did not implement "Ability to download favorites as a zip / export". We worked on "external logging server" but had some problems so we could not finish that one, but you can see our attempt in the repository. <br>
The logging part was difficult because we could not find an example for connecting the API with the Docker container of Graylog on the CSC cloud and the setup via the Graylog homepage. Because no one really had an idea how to do this, we let that issue sit on the to do list till the end, and then we did not have time to ask the teacher for help. If we had done it earlier, we are sure that we would have been successfull to log to an external server. In the API a plugin for graylog is registered at the Hapi server and a server.log() message is triggerd in index.js but the Graylog endpoint is missing.<br>
Postman offers the possibility to create a shared collection for a team in which we put in all the request. It is also possible in postman to write testscripts in it for the requests, that can also be run as a testsuite in the CI-pipeline, what we did. The test cover some main features, not every request or possible usecase flow, because it was said in the lecture, that this would be enough to show we can apply the concept.<br>
For the documentation we also tried out a feature of postman. It has some nice features and resulted in a pleasing documentation. But it's nessessary to be either a member of the postman-workspace or set the workspace to public to see it, at least in the free version. Maybe swagger is a better option for future projects. 

### Process
We worked in a group of four. In the gitlab repository we created milestones, issues and a kanban board to keep track of the requirement and our progress. With the milestones and the board we were able to track how much of "core functionality" or "extra credits" was done. As tools we used gitlab, editors from intellij, a group chat, screensharing on teams for pairprogramming sometimes and postman. We talked every week about the progress and inbetween while working on the topics.

### Appendix

### Logout
#### The problem: 
The nature of the json-webtoken is, that it is a hash that will be handed to the client / user. It stores the information when it will expire, but it is not possibily to revoke it inbetween. We only work on the backend api, so we do not have access on the token once we gave it to the client. Some applications, that also deal with the client, delete the token but that is not possibile in our case. <br>
Unfortunately there seems to be no build-in solution for this problem in the hapi jwt library, so we had to create one of our own.<br>
#### Solution: 
We created a redis service, in which we "blacklist" the tokens, which are used by a user on logout. Everytime, the token is required, the server checks if the token is on this list and interprets it as invalid in that case.
To achieve this we extended the server.auth.strategy, the server checks the validate function. This is a pretty solution, that is done at a central position and does not blow up the other requests. <br>
For the redis we had to advance the docker-compose and also had to add new firewall rules in the csc pouta to make service accessible on this port. The current state of our docker-compose.yml can be found in the directory "for_documentation".

### Pipeline and automated tests: (With how to)
#### Continous integration: 
The first step in the CI pipeline was to create the build step, that builds the docker on every push and puts it into the registry. 
For this step we followed mostly the hands-on session video, there were some problems on the way, but they were solved in the end.<br>
I first made the  tests work in postman itself and then run them on the command line with newman. 
For this either an exported json-file or published link to the collection can be used. 
<details>
  <summary>Next: Run tests in the CI pipeline. </summary>

To excluded other possible errors, I first used a reduced export with only one simple test. After many tries I finally installed a new gitlab script runner on the csc server. 
I had no access to some information of the shared general runner, but I could change the attributes and lookup the ip of newly installed runner and gave it access through the firewall rules in the csc pouta e.g. to port 5430 and for minio.
[Instructions to install runner](https://docs.gitlab.com/runner/install/linux-repository.html) <br>
Go to csc instance via ssh on CLI and install a runner of type „shell“:
```
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
export GITLAB_RUNNER_DISABLE_SKEL=true; sudo -E apt-get install gitlab-runner 
```
Go to your-gitlab-project —> settings —> ci_cd —> Set up a specific runner manually —> take the given url and token<br>
and use them to register a new runner of type shell via command-line on the server:<br>
```
sudo gitlab-runner register
```
Next problem and solution: You need add gitlab to docker user group to be able to run docker commands:
```
sudo usermod -aG docker gitlab-runner
```
Install npm and newman directly on the csc server, because the runner does not have the according access rights.<br>
Next you can edit the „.gitlab-ci.yml“ to add the test-stage.
Since it is a shell runner, you can use normal shell commands in the „.gitlab-ci.yml“ for troubleshooting or to check if tools or libraries are correctly installed, docker ps etc. <br>
Add a new stage „test“, use „docker:latest“ from docker hub as base image, do not forget to add the tag of the test-runner at the end.
Previously we already put the credentials for docker-login into gitlab -> settings —> variables. Put also the postman access token there and masked it, so it does not show up in the logs.<br>
The exact commands for the CI to run the tests can be found in our „.gitlab-ci.yml“: Do the docker login, pull the docker container from the registry, run it, run the postman tests with newman and afterwards stop and remove the test-container.<br>
If that worked with the first simple test, use the published link postman, update the link after each change (click on collection name -> share collection -> get public link)<br>
<details>
  <summary>Opinion:</summary>
It may seem that github and gitlab pipelines would work in the same way but there are definitely some differences in syntax and setup, for which research is needed, e.g. for the runners. But after that, a lot can  be adapted. <br>
It is more complicated than in a simple project, to work with multiple services in a service oriented application, in which all have to be reachable for each other and also for the pipeline. This was a valuable learning experience.
</details>

</details>


#### Opinion about postman
Postman is a pretty powerful tool to work on a shared collection while creating an api. It also has a good documentation and tutorials.<br>
We would strongly recommend using this or similar tools. It is great that tests from postman can be run automatically in the pipeline. 
<br>But in that way we experienced the tests scripts, these are not really great to test more complex user-flows, more for individual tests on each request without shared information.
<details>
  <summary>Details</summary>
It is possible to e.g. set values in environment variable to share them between request or tests. But in the pipeline this sometimes fails without a code-error and then succeeds on rerun. The environment seems to be less stable in that case. <br>
Other in-code libraries we used in the past allow easier share of created values and to create multiple and more complex use-case-flows that are tested.
Having tests that are connected between each other have an impact on using the requests in postman in isolation during development. It seems like the tool is better suited for isolated unit-tests, but we needed e.g. the authorisation token in the requests.
But our experience and knowledge about the postman tests are for sure limited. And test-pipelines often seem to have „fail because of strange connection problems“ issues or similar that do not occur on local test run, at least in my experience so far.
</details>
I also tried to setup tests with mocha or lab but there were problems with the current server configuration and we already had postman tests so I concentrated on more urgent topics. In a future project we would go for that approach.

#### Attempt Continous Deployment:
With a shell runner it should also be possible to automate the continuous deployment, every time a branch is merged into develop (or a release branch). I started to implement it but problems occured and it was not in the requirements. 
So we still have to deploy it by hand at the moment, by logging in to the server and do:
<details>
  <summary>Deploy commands on csc</summary>

    docker login -u  < user>  -p < password> gitlab.labranet.jamk.fi:4567
    docker pull gitlab.labranet.jamk.fi:4567/aa9358/service-oriented-applications:latest
    sudo docker-compose up -d imager-api

</details>


#### Docker-compose.yml in infra
We made some changes in the docker compose to expose ports and allow the services connect to each other. The current state of our docker-compose.yml can be found in the directory "for_documentation".
Noticeable is the configuration of „imager-api“, that defines the environment variables in production for the gallery-rest-api itself.<br>
Now the app can be reached at api.imager.local/ (If the caller has access accoring to the firewall rules.)

<details>
  <summary>Our current configuration: imager api</summary>
*** password removed here

     imager-api:
        image: gitlab.labranet.jamk.fi:4567/aa9358/service-oriented-applications:latest
        container_name: imager-api
        networks:
            - soanet
        environment:
            DB_HOST: pgpool
            DB_PORT: 5432
            DB_USER: ***
            DB_PASS: ***
            MINIO_ENDPOINT: minio
            MINIO_ACCESS: ***
            MINI_PASS: ***
            MINIO_PORT: 9001
            REDIS_HOST: redis
        ports:
            - 127.0.0.1:9999:8000
        logging:
            driver: gelf
            options:
                gelf-address: "udp://localhost:12201"


</details>
