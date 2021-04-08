## TTOW0130 example project

This is an example project used during the Zoom sessions.
This repository showcases so of the options and way of developing the REST API.

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
- [ ] PUT /image/<image-id>/vote
- [ ] PUT /image/<image-id>/favorite
- [ ] POST /image/<image-id>/comment -> CREATE

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
