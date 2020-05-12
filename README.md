# Metallum

### This repo is split into two projects: GraphQL & REST api that serves data scraped from metal-archives.com and the scraper itself.

## Scraper

example usage:

```bash
git clone https://github.com/HichuYamichu/metallum
cd scraper
go install
metallum migrate up
metallum scrape
# use `metallum help` for more info
```

example config:

```yaml
host: '0.0.0.0'
port: '7000'

db:
  host: 'localhost'
  port: '5432'
  user: 'postgres'
  pass: 'postgres'
  name: 'metallum'
```

## Server

example usage:

```bash
git clone https://github.com/HichuYamichu/metallum
cd server
npm i
npm run build
npm run start:prod
# visit http://localhost:3000/graphql or http://localhost:3000/api
```

example env:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=postgres
DATABASE_NAME=metallum
```
