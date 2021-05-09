## TTOW0130 example project

This is an example project used during the Zoom sessions.
This repository showcases so of the options and way of developing the REST API.

## Final report
### Time tracking
Vanessa:
  - single work: 40 hours (check GitLab assigned issues for detail overview)
  - group work: 13 hours
  <br>
Adam:
  - 90h work

### Parts of the projects, that were easy
- The route, were you had early an idea how to do it were good

### Parts that were hard
- Connect new bits to the existing code, because I was unsure about the communication between the parts
- Use external services and make them known to each other (like Redis or Graylog)

### Greatest learning experience
- Use a simple framework and add just the parts you needed, was a cool experience
- I learned a lot of small things and understand the concept of service oriented applications better

## Node modules
To you can take a look at the package.json file to see what node modules are installed

### Notes
- We modified the docker-compose file on the CSC deployment to allow access to database from internet.
- We added security group rule to allow access to database from our own IP address.

### Planned routes

- [ ] (*) image routes need combined endpoint
  
  <br>
  
- [ ] POST /image
- [ ] GET /image?limit=10&page=1 --> for DB done
- [ ] GET /image/trending
- [x] DELETE /image/<image-id> --> for DB & minio done (*)
- [x] PUT /image/<image-id>/vote
- [ ] PUT /image/<image-id>/favorite
- [ ] POST /image/<image-id>/comment -> CREATE
- [x] POST /image/<image-id>/report

- [ ] PUT /comment/<comment-id> -> EDIT
- [ ] DELETE /comment/<comment-id>

- [x] GET /user/<user-id>/image -> route is /image/<user-id> but same functionality --> for DB done

- [x] GET /me -> Check JWT data
- [ ] GET /me/favorites
- [ ] GET /me/favorites/export
- [ ] GET /me/comments

- [x] POST /auth/register
- [x] POST /auth/login
- [ ] GET /auth/logout

- [x] GET /ping -> 200 OK
