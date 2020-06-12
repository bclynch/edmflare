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

### Short term

- Fix maps
- ~~Turn on Ivy~~
- ~~Add live streams to front page~~
  - ~~Include some icon to indicate live stream~~
- ~~Add a banner to top (maybe) that says to check ticket sites to make sure event is actually occurring~~
- ~~Update dependencies~~
- See if geocoding for venues is working?

### Other

- Would like to get angular universal going?
- ~~Share btns broken after ng 9. Look for [new version soon](https://github.com/MurhafSousli/ngx-sharebuttons/issues/429)~~
- [Add Capacitor for app generation](https://blog.angular.io/announcing-the-capacitor-ngadd-schematic-732fd90f40fa) (try on a branch)
- Domain issues with social logins (fuck)
  - [Look at trying to have express serve the static app instead of nginx](https://itnext.io/express-server-for-an-angular-application-part-1-getting-started-2cd27de691bd)
-   ~~Do db migration stuff with existing model~~
    -   ~~Trying to run setup script is not creating db in postgres. Template db
        exists, but is not in pgadmin~~
-   Wire up client to play nice here
    -   ~~[Proxy info with angular to play nice CORS](https://levelup.gitconnected.com/simple-application-with-angular-6-node-js-express-2873304fff0f)~~
    -   Fix createdAt filter for search queries
    -   ~~Figure out how to logout~~
    -   ~~Fix misc issues with refactored db~~
    -   ~~Next month util range is broken~~
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
        -   ~~Show theme~~
        -   ~~Show apps~~
        -   ~~Setup fav locales~~
        -   Set up notifications
        - ~~Would be nice to have an option in the dropdown menu that sends you to the user setup page if it hasn't been "completed". This is handy since the social logins won't send user there. When completed turn boolean on user object so it's out of the menu~~
    -   ~~Rework login / register page~~
-   Bring back existing functionality on server with TS
    - ~~Scraping~~
    - Welcome Email
    - ~~Img uploading~~
    - Push notifications
    - ~~Utils~~
-   Migrating existing db to new one. Probably need some kind of script
    - ~~Create script and run locally~~
    - ~~*UPDATE CITIES TABLE SO NEW ROWS HAVE UPDATED COUNTRY / REGION*~~
-   ~~Fix up look of the emails that are going out to people. Mostly just changing color scheme and maybe add logo~~
-   Look at Docker for production
    - See about getting a proper CI going with the github workflow here
- Look at getting scrape and daily email hooked up to our worker to offload them there
  - ~~Would need to reformat handlebar emails to the other thing~~
    - ~~Contact~~
    - ~~Events update~~
    - Scrape update needs a little TLC
  - ~~[You can schedule jobs directly in the database, e.g. from a trigger or function, or by calling SQL from your application code.](https://github.com/graphile/worker#scheduling-jobs)~~
- Inputs on location search look weird with text and placeholder

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

## Digital Ocean Login

- `$ ssh edmflare@206.189.194.173`

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

## AWS Setup
- Email is only available from US East N. Virginia and US West Oregon so keep that in mind...

### SES

- *MUST LEAVE SANDBOX WHEN PROD READY OR EMAILS TO UNVERIFIED EMAILS BREAK*
  - [Docs to leave sandbox](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html)
- $0.10 for every 1,000 emails you send or receive.
- https://medium.com/viithiisys/node-mailer-with-amazon-ses-6fb18bea568e
- Head over to SES in the [AWS console](https://console.aws.amazon.com/ses/home)
- [Verify a new domain](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html) to be able to send emails from
  - Enter the domain, click to select dkim, and get the network settings needed to add to the domain. Should be three cname and one txt
- If your account is still in the Amazon SES sandbox, you also must verify every recipient email address except for the recipients provided by the Amazon SES mailbox simulator.

### RDS

- Important reminders:
    - Set the option for making the db public so you get an endpoint for it. Must be done on creation!
    - Set inbound security group to be all traffic (something like 0.0.0.0) otherwise it hangs and doesn't work
#### Basic Setup
- Install AWS CLI `$ brew install awscli`
- Launch a new RDS instance from AWS console
- Run `$ aws rds describe-db-instances` to check on your db's info
- Change the parameter group of your instance to force ssl. (set to one)
#### Connect to Postgres GUI
- http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html
- Can right click on a db and select 'Execute SQL File'. Load up the schema then load up any data.
- When running sql the first time to set up dbs and roles and such RDS does not allow `COMMENT ON EXTENSION`. If it exists anywhere in the sql needs to be removed.

## Postgres Indexing
- https://devcenter.heroku.com/articles/postgresql-indexes
- When you are ready to apply an index on your production database, keep in mind that creating an index locks the table against writes. For big tables that can mean your site is down for hours. Fortunately Postgres allows you to CREATE INDEX CONCURRENTLY, which will take much longer to build, but does not require a lock that blocks writes. Ordinary CREATE INDEX commands require a lock that blocks writes but not reads.
- Finally, **indexes will become fragmented and unoptimized after some time, especially if the rows in the table are often updated or deleted.** In those cases it may be required to perform a REINDEX leaving you with a balanced and optimized index. However be cautious about reindexing big indexes as write locks are obtained on the parent table. One strategy to achieve the same result on a live site is to build an index concurrently on the same table and columns but with a different name, and then dropping the original index and renaming the new one. This procedure, while much longer, won’t require any long running locks on the live tables.
- Look more closely at the api calls we make regularly for where statements / joins and create indicies for those columns

### Rules of thumb
- Index every primary key. (postgres does this)
- Index every foreign key.
- Index every column used in a JOIN clause.
- Index every column used in a WHERE clause.

## Postgres Setup
- Important note that I am using a newly created role, edm_super, in my db/index.js pg connection so it has super user connection on the server only. Otherwise my graphql server is set to my edm_adm role without super user and should respect the roles
- No super users on AWS, but the rds_superuser role is a pre-defined Amazon RDS role similar to the PostgreSQL superuser role
