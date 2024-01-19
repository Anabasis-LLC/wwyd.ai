---
description: Configure your local development environment on OS X.
---

# 🍎 OS X

### Contents

- [Prerequisites](os-x.md#prerequisites)
  - [Homebrew](os-x.md#homebrew)
  - [Direnv](os-x.md#direnv)
  - [PostgreSQL 14](os-x.md#postgresql-14)
  - [Redis](os-x.md#redis)

### Prerequisites

#### Homebrew

Install [Homebrew](https://brew.sh/):

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# If you use bash:
/opt/homebrew/bin/brew shellenv >> ~/.bash_profile
source ~/.bash_profile

# If you use zsh:
/opt/homebrew/bin/brew shellenv >> ~/.zshrc
source ~/.zshrc
```

### Direnv

Install direnv:

```sh
brew install direnv
```

#### PostgreSQL 14

Install PostgreSQL:

```sh
brew install postgresql@14
```

Start (if necessary) the PostgreSQL service:

```sh
brew services info postgresql@14

# If not running:
brew services start postgresql@14
```

Create the `postgres` user:

```sh
psql postgresql://localhost:5432/postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'password';"
```

#### Redis

Install redis:

```sh
brew install redis
```

Start (or restart to address [this issue](https://stackoverflow.com/a/59392047)) the Redis service:

```sh
brew services info redis

# If not running:
brew services start redis

# If running, restart it:
brew services restart redis
```
