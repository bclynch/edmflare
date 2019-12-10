# EDM Flare

## Table of contents

-   [Features](#features)
-   [Todos](#todos)
-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
-   [Running](#running)
-   [Docker development](#docker-development-1)
-   [Production build](#production-build-for-local-mode)

## Todos

-   ~~Do db migration stuff with existing model~~
    -   ~~Trying to run setup script is not creating db in postgres. Template db
        exists, but is not in pgadmin~~
-   Wire up client to play nice here
    -   ~~[Proxy info with angular to play nice CORS](https://levelup.gitconnected.com/simple-application-with-angular-6-node-js-express-2873304fff0f)~~
    -   Fix createdAt filter for search queries
    -   ~~Figure out how to logout~~
    -   ~~Fix misc issues with refactored db~~
    -   Next month util range is broken
    -   ~~Set up password forget~~
    -   ~~Set up password reset~~
    -   ~~Fix email to work with SES~~
    -   ~~Set up fb login~~
    -   ~~Set up google log in~~
    -   ~~Set up twitter log in~~
    -   Make sure deleting users and such doesn't fuck up the userid and id balance
    -   ~~Fix local login~~
    -   ~~Show user photo in login / logged in btn in nav~~
    -   Walk user through a newly registered page
        -   Show theme
        -   Show apps
        -   Setup fav locales
        -   Set up notifications
    -   ~~Rework login / register page~~
-   Bring back existing functionality on server with TS
    - ~~Scraping~~
    - Welcome Email
    - Img uploading
    - Push notifications
    - ~~Utils~~
-   Migrating existing db to new one. Probably need some kind of script
    - ~~Create script and run locally~~
    - ~~*UPDATE CITIES TABLE SO NEW ROWS HAVE UPDATED COUNTRY / REGION*~~
-   Fix up look of the emails that are going out to people. Mostly just changing color scheme and maybe add logo
-   Look at Docker for production
    - See about getting a proper CI going with the github workflow here

## Running Local Dev Currently

```
// open different terminal instances for ea

// watch for tsc changes on server
yarn server watch

// run server
yarn server dev

// server worker instance
yarn worker dev

// spin up Angular client
yarn client start
```

## Features

**Speedy development**: hot reloading, easy debugging,
[job queue](/TECHNICAL_DECISIONS.md#job-queue) and server middleware ready to
use; not to mention deep integration with VSCode should you use that editor:
plugin recommendations, preconfigured settings, ESLint integration and debugging
profiles

**Batteries included**: full user system and OAuth, jest and
[Cypress end-to-end](/TECHNICAL_DECISIONS.md#cypress-e2e-tests) testing,
security, email templating and transport, pre-configured linting and code
formatting, deployment instructions, and more

**Type safety**: pre-configured type checking, strongly typed throughout with
TypeScript

**Best practices**: Angular, GraphQL, PostGraphile, Node, jest and Cypress best
practices

See [TECHNICAL_DECISIONS.md](TECHNICAL_DECISIONS.md) for a more detailed list of
features included and the technical decisions behind them.

## Prerequisites

You can either work with this project locally (directly on your machine) or use
a pre-configured Docker environment. We'll differentiate this in the README with
a table like this one:

| Local mode                      | OR  | Docker mode                              |
| ------------------------------- | :-: | ---------------------------------------- |
| _command for local development_ | or  | _command for docker-compose development_ |

**Be careful not to mix and match Docker-mode vs local-mode for development.**
You should make a choice and stick to it. (Developing locally but deploying with
`production.Docker` is absolutely fine.)

**IMPORTANT**: If you choose the Docker mode, be sure to read
[docker/README.md](docker/README.md).

### Local development

Requires:

-   Node.js v10+ must be installed (v12 recommended)
-   PostgreSQL v10+ server must be available
-   `pg_dump` command must be available (or you can remove this functionality)
-   VSCode is recommended, but any editor will do

This software has been developed under Mac and Linux, and should work in a
`bash` environment.

### Docker development

Requires:

-   [`docker`](https://docs.docker.com/install/)
-   [`docker-compose`](https://docs.docker.com/compose/install/)
-   Ensure you've allocated Docker **at least** 4GB of RAM; significantly more
    recommended
    -   (Development only, production is much more efficient)

Has been tested on Windows and Linux (Ubuntu 18.04LTS).

## Getting started

This project is designed to work with `yarn`. If you don't have `yarn`
installed, you can install it with `npm install -g yarn`. The Docker setup
already has `yarn` & `npm` installed and configured.

To get started, please run:

| Local mode   | OR  | Docker mode                     |
| ------------ | :-: | ------------------------------- |
| `yarn setup` | or  | `export UID; yarn docker setup` |

This command will lead you through the necessary steps, and create a `.env` file
for you containing your secrets.

**NOTE:** `export UID` is really important on Linux Docker hosts, otherwise the
files and folders created by Docker will end up owned by root, which is
non-optimal. We recommend adding `export UID` to your `~/.profile` or
`~/.bashrc` or similar so you don't have to remember it.

**Do not commit `.env` to version control!**

## Running

You can bring up the stack with:

| Local mode   | OR  | Docker mode                     |
| ------------ | :-: | ------------------------------- |
| `yarn start` | or  | `export UID; yarn docker start` |

After a short period you should be able to load the application at
http://localhost:5000

This main command runs a number of tasks:

-   uses [`graphile-migrate`](https://github.com/graphile/migrate) to watch
    the`migrations/current.sql` file for changes, and automatically runs it
    against your database when it changes
-   watches the TypeScript source code of the server, and compiles it from
    `@app/*/src` to `@app/*/dist` so node/`graphile-worker`/etc. can run the
    compiled code directly
-   runs the node server (includes PostGraphile and Next.js middleware)
-   runs `graphile-worker` to execute your tasks (e.g. sending emails)
-   watches your GraphQL files and your PostGraphile schema for changes and
    generates your TypeScript React hooks for you automatically, leading to
    strongly typed code with minimal effort
-   runs the `jest` tests in watch mode, automatically re-running as the database
    or test files change

**NOTE**: `docker-compose up server` also runs the PostgreSQL server that the
system connects to.

You may also choose to develop locally, but use the PostgreSQL server via
`docker-compose up -d db`.

Then for development you may need a console; you can open one with:

| Local mode | OR  | Docker mode                    |
| ---------- | :-: | ------------------------------ |
| `bash`     | or  | `export UID; yarn docker bash` |

To shut everything down:

| Local mode | OR  | Docker mode                    |
| ---------- | :-: | ------------------------------ |
| Ctrl-c     | or  | `export UID; yarn docker down` |

## Docker development

Be sure to read [docker/README.md](docker/README.md).

## Building the production docker image

To build the production image, use `docker build` as shown below. You should
supply the `ROOT_URL` build variable (which will be baked into the client code,
so cannot be changed as envvars); if you don't then the defaults will apply
(which likely will not be suitable).

To build the worker, pass `TARGET="worker"` instead of the default
`TARGET="server"`.

```sh
docker build \
  --file production.Dockerfile \
  --build-arg ROOT_URL="http://localhost:5000" \
  --build-arg TARGET="server" \
  .
```

When you run the image you must pass it the relevant environmental variables,
for example:

```sh
docker run --rm -it --init -p 5000:5000 \
  -e GRAPHILE_LICENSE="$GRAPHILE_LICENSE" \
  -e SECRET="$SECRET" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e DATABASE_VISITOR="$DATABASE_VISITOR" \
  -e DATABASE_URL="$DATABASE_URL" \
  -e AUTH_DATABASE_URL="$AUTH_DATABASE_URL" \
  -e GITHUB_KEY="$GITHUB_KEY" \
  -e GITHUB_SECRET="$GITHUB_SECRET" \
  docker-image-id-here
```

Currently if you miss required envvars weird things will happen; we don't
currently have environment validation (PRs welcome!).

## Production build for local mode

Use `yarn run build` to generate a production build of the project
