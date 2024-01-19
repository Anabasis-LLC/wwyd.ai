# @wwyd/db

### Boostrapping

```sh
cd $REPO_HOME/packages/db

yarn neonctl projects create --name WWYD

PROJECT_ID=$(yarn neonctl projects list -o json | jq -c '.[] | select(.name == "WWYD") | .id' -r)

yarn neonctl databases create --project-id $PROJECT_ID --name wwyd_development
yarn neonctl databases create --project-id $PROJECT_ID --name wwyd_production
yarn neonctl databases delete --project-id $PROJECT_ID neondb
yarn neonctl databases list --project-id $PROJECT_ID

echo -e "\n# Database" >> $REPO_HOME/.envrc.local
echo "export DEVELOPMENT_DATABASE_URL=$(yarn neonctl connection-string --project-id $PROJECT_ID --database-name wwyd_development)" >> $REPO_HOME/.envrc.local
echo "export PRODUCTION_DATABASE_URL=$(yarn neonctl connection-string --project-id $PROJECT_ID --database-name wwyd_production)" >> $REPO_HOME/.envrc.local
echo 'export DATABASE_URL=$DEVELOPMENT_DATABASE_URL' >> $REPO_HOME/.envrc.local

yarn db:migrate
yarn db:deploy
```
