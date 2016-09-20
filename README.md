Dreamhouse Kafka Sim
--------------------

TODO

1. [Install Node.js](https://nodejs.org/en/)
1. Fetch the NPM dependencies: `npm install`
1. Get the Kafka environment variables from a Heroku app:

        heroku config -s -a APP_NAME > .env
        set -o allexport
        source .env
        set +o allexport

1. Create the Kafka certs:

        ./env.sh


