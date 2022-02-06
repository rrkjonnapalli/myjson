# My JSON

This is a local json server uses filesystem.

To start server

```
npm install
npm start
```
```
/* APIs */
GET /list
GET /list/:path
GET /json/:path /* returns data in given path */
POST /json/:path /* saves data in given path if not already exists */
PUT /json/:path /* saves/updates data in given path */
DELETE /json/:path /* deletes data in given path */
/**
```
* if `path` is "hello-world"
* we will create a **world.json** file in **DATA_PATH/hello/** directory
* if `path` is "hello-sample-world"
* we will create a **world.json** file in **DATA_PATH/hello/sample/** directory
* if `path` is "hello-sample"
* we will create a **sample.json** file in **DATA_PATH/hello/** directory
* path allows only a-z (case insensitive) and 0-9 and `-`
* **DATA_PATH** is an env variable or by default `data`.
*/
