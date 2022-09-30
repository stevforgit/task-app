#!/bin/bash

echo "Setting up DB connection..."

# Check if container exists
if docker inspect evlp-postgres &>/dev/null
then
    # Check if container is running
    if ! docker top evlp-postgres &>/dev/null
    then
        # Container is not running, start it back up
        docker start evlp-postgres
    else
        echo "Postgres is already running"
    fi
else
    docker run --name evlp-postgres -d -e POSTGRES_USER=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v /tmp:/var/lib/postgresql/data -p 5432:5432 -it postgres:14.1-alpine
    # docker run --name evlp-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
fi