---
description: Configure your local development environment on WSL2 + Ubuntu on Windows.
---

# 🪟 Windows

### Contents

- [Prerequisites](windows.md#prerequisites)
  - [WSL2 Ubuntu](windows.md#wsl2-ubuntu)
  - [Direnv](windows.md#direnv)
  - [PostgreSQL 14](windows.md#postgresql-14)
  - [Redis](windows.md#redis)

### Prerequisites

#### WSL2 Ubuntu

Install Ubuntu on Windows using WSL using [these instructions](https://learn.microsoft.com/en-us/windows/wsl/install).

#### Direnv

Install direnv:

```sh
curl -sfL https://direnv.net/install.sh | bash
```

#### PostgreSQL 14

Install and start PostgreSQL 14.x ([guide](https://harshityadav95.medium.com/postgresql-in-windows-subsystem-for-linux-wsl-6dc751ac1ff3)):

```sh
sudo apt-get install -y postgresql-14
sudo service postgresql start
```

Open the PostgreSQL cli:

```sh
sudo -u postgres psql
```

Set the password for the `postgres` user:

```sql
alter user postgres with encrypted password 'password';
```

#### Redis

Install and start Redis ([guide](https://redis.io/docs/getting-started/installation/install-redis-on-linux/)):

```sh
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install -y redis
sudo service redis-server start
```

Ensure redis is running on port 6379:

```sh
sudo ss -lptn | grep 6379
```

If `redis-server` fails to start and the logs (`/var/log/redis/redis-server.log`) show "address already in use", refer to [this issue](https://github.com/microsoft/WSL/issues/365#issuecomment-359651807). You'll want to open a PowerShell as Administrator and run `net stop iphlpsvc`.

