# WWYD? Monorepo

### Contents

- [Prepare Development Environment](README.md#prepare-development-environment)
  - [Prerequisites](README.md#prepare-development-environment)
  - [GitHub Repository](README.md#github-repository)
  - [Environment Variables](README.md#environment-variables)
  - [Install Dependencies](README.md#install-dependencies)
  - [Migrate Database](README.md#migrate-database)
- [Run Locally](README.md#run-locally)

### Prepare Development Environment

#### Prerequisites

Install and configure prerequisites ([direnv](https://direnv.net/), [postgres](https://www.postgresql.org/), and [redis](https://redis.io/)):

- [Mac OS X](docs/os-x.md)
- [Windows](docs/windows.md)

#### GitHub Repository

Clone the repo:

```sh
git clone git@github.com:Anabasis-LLC/wwyd.git ~/Documents/wwyd.ai
cd ~/Documents/wwyd.ai
```

#### Environment Variables

Install the `direnv` hook into your shell to allow ENV vars to be set using `.envrc*` files:

```sh
# If you use bash:
echo 'eval "$(direnv hook bash)"' >> ~/.bash_profile
source ~/.bash_profile

# If you use zsh:
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
source ~/.zshrc
```

In the shared 1Password find the secure note titled `wwyd / .envrc.local` and copy its contents into your shell:

```sh
echo '
[PASTE HERE]
' > .envrc.local
```

Populate ENV vars from `.envrc.local` and `.envrc`:

```sh
direnv allow
```

#### Install Dependencies

Install [asdf](https://asdf-vm.com/), a tool to easily install and switch between multiple versions of node:

```sh
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.2

# If you use bash:
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bash_profile

# If you use zsh:
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.zshrc

# If you installed Homebrew in the same shell session that you just installed asdf
# then restart your terminal. Otherwise:
. "$HOME/.asdf/asdf.sh"
```

Install node and yarn:

```sh
asdf plugin add nodejs
asdf install nodejs
which node
# Source your .bash_profile or .zshrc if the `node` path is not `$HOME/.asdf/shims/node`.

corepack enable
asdf reshim nodejs
```

Install npm packages and git hooks:

```sh
yarn install
yarn husky install
```

#### Migrate Database

Create and migrate your database:

```sh
yarn db:migrate
```

### Run Locally

```sh
yarn dev
```
