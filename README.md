## TTOW0130 example project

This is an example project used during the Zoom sessions.
This repository showcases so of the options and way of developing the REST API.

### Notes
- We modified the docker-compose file on the CSC deployment to allow access to database from internet.
- We added security group rule to allow access to database from our own IP address.

### Planned routes

- POST /image
- GET /image?limit=10&page=1
- GET /image/trending
- DELETE /image/<image-id>
- PUT /image/<image-id>/vote
- PUT /image/<image-id>/favorite
- POST /image/<image-id>/comment -> CREATE


- PUT /comment/<comment-id> -> EDIT
- DELETE /comment/<comment-id>


- GET /user/<user-id>/image


- GET /me -> Check JWT data
- GET /me/favorites
- GET /me/favorites/export
- GET /me/comments


- POST /auth/register
- POST /auth/login
- GET /auth/logout


- GET /ping -> 200 OK
