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
We did not implement "Ability to download favorites as a zip / export". We worked on "external logging server" but had some problems so we could not finish that one, but you can see our attempt in the repository.<br>
Postman offers the possibility to create a shared collection for a team in which we put in all the request. It is also possible in postman to write testscripts in it for the requests, that can also be run as a testsuite in the CI-pipeline, what we did. The test cover some main features, not every request or possible usecase flow, because it was said in the lecture, that this would be enough to show we can apply the concept.<br>
For the documentation we also tried out a feautre of postman. It has some nice features and resulted in a pleasing documentation. But it's nessessary to be either a member of the postman-workspace or set the workspace to public to see it, at least in the free version. Maybe swagger is a better option for future projects. 

### Process
We worked in a group of four. In the gitlab repository we created milestones, issues and a kanban board to keep track of the requirement and our progress. With the milestones and the board we were able to track how much of "core functionality" or "extra credits" was done. As tools we used gitlab, editors from intellij, a group chat, screensharing on teams for pairprogramming sometimes and postman. We talked every week about the progress and inbetween while working on the topics.



