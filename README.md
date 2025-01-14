# pastebin.fi API

This is the API for [pastebin.fi](https://pastebin.fi). The frontend can be found here: [PastebinUI](https://github.com/pastebin-fi/PastebinUI)

## Deployment

Docker image is automatically built to [github content registry](https://github.com/pastebin-fi/PowerPaste/pkgs/container/powerpaste) from master branch. The docker image is also automatically pulled with watchtower on the server.

## Stack

### Backend

-   Node.JS (version 16)
-   MongoDB (mongoose)
-   Local File System (paste storage)

The server stores paste content to local file system and other relevant information to MongoDB. I was considering to use S3 but at Wasabi it had some hiccups from time to time (requests did not finish).

## Setup

First of all, you should setup the environment variables (see [here](#environment-variables)). I would recommend to copy the `.env.example` file to `.env` (command is `cp .env.example .env`).

### Without Docker

Simply run the project with `node .`

If you are developing something I would suggest to use nodemon (`npm i -g nodemon`). It reloads the app everytime something changes: `nodemon.`

### With Docker

`docker-compose.prod.yml` contains an example configuration.

## Configuration variables

| Key         | Description                                                                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mongo_uri   | Example: `mongodb+srv://user:pass@host/database`. This is the URI that MongoDB tries to connect to. It should be in format `mongodb+src://<user>:<password>@<hostname>/<database>` |
| site_url    | Example: `http://localhost:3000`. The app parser required info from it.                                                                                                            |
| title       | Defines the site title.                                                                                                                                                            |
| description | Describe your pastebin. Visible in some places.                                                                                                                                    |
| trust_proxy | Number of proxies to trust (handy when using reverse proxy).                                                                                                                       |
| secret      | Should be something random and unique.                                                                                                                                             |

## REST API Documentation
