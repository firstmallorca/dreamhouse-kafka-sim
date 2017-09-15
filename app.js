"use strict";

let Kafka = require('no-kafka'),
    salesforce = require('./server/salesforce'),
    interval = process.argv[2] ? parseInt(process.argv[2]) : 1000,
    eventTypes = ["view", "favorite", "appointment"];

let getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

var kafkaPrefix = process.env.KAFKA_PREFIX;
if (kafkaPrefix === undefined) {
   kafkaPrefix = '';
}

let producer = new Kafka.Producer();

producer.init();

salesforce.login()
    .then(() => Promise.all([salesforce.findUsers(), salesforce.findProperties()]))
    .then(results => {
        let users = results[0];
        let properties = results[1];
        setInterval(() => {
            let data = {
                userId: users[getRandomNumber(0, users.length - 1)].get("Id"),
                propertyId: properties[getRandomNumber(0, properties.length - 1)].get("Id"),
                eventType: eventTypes[getRandomNumber(0, eventTypes.length - 1)],
                date: Date.now()
            };
            console.log(data);
            producer.send({
                topic: kafkaPrefix + 'interactions',
                message: {
                    value: JSON.stringify(data)
                }
            });
        }, interval);
    });
