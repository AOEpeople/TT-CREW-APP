# AOE TT Crew App

This is the offizial Repository containing the AOE Tabletennis App. For further info on the "Tischtennis Crew" see here: [link](https://extranet.aoe.com/confluence/pages/viewpage.action?spaceKey=aoeculture&title=Tischtennis+Crew@AOE)

## Contributing

Everyone is welcome to contribute new Features or Bug fixes. You can also create Issues [here](https://github.com/AOEpeople/TT-CREW-APP/issues/new)

## Get started

### Prerequisites

**AWS Account**

This project uses [SST](https://sst.dev/) to manage the Infrastructure. To develop on this app you will eventually need AWS User credentials. If you're part of AOE, just ask one of the maintainers to get a token, if not you can follow [the SST Guide](https://sst.dev/docs/aws-accounts) to create your own Account.

**pnpm**

This repo is based on pnpm as Package Manager.

**Docker**
If to develop against a local database, you will need [docker](https://www.docker.com/) installed and running.

**(optionally) Sentry API Key**

This Repo uses Sentry for Error-Monitoring. If you want to use this, you will need to add a sentry api key as configured in the .env.example file.

### Developing locally

All needed scripts are prepared inside the package.json.

To run locally, you first need to configure the database.

1. `pnpm postgres:docker`

This command will pull the postgres docker image and start a new container. It will also mount the content of db to the .sst/storage folder, so the database content is persisted

3. `pnpm install`

Instsall all needed dependencies

3. `pnpm sst dev`

This will generate all needed AWS Ressources and start the Next.js Server as well as Drizzle Studio. When run for first time, this may take longer. See the [SST CLI docs](https://sst.dev/docs/reference/cli/) for more.

4. `pnpm db:push`

This will push the current Drizzle Migrations to the database. You only need to do this once initially, as well as when changes to the database schema are made. When migrating to a remote database, make sure that `sst dev` or `sst tunnel` is running, so that drizzle-kit can connect to the deployed vpc network.
