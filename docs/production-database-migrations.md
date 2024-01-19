# Production Database Migrations

See the [Prisma migration guide](https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-development-production) for more info.

```sh
cd $REPO_HOME/packages/db
DATABASE_URL=$PRODUCTION_DATABASE_URL yarn prisma migrate deploy
```
