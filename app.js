"use strict";

let Kafka = require('no-kafka'),
    salesforce = require('./server/salesforce'),
    interval = process.argv[2] ? parseInt(process.argv[2]) : 1000,
    eventTypes = ["view", "favorite", "appointment"],
    brokerUrls = process.env.KAFKA_URL.replace(/\+ssl/g, '');

let getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

let producer = new Kafka.Producer({
    connectionString: brokerUrls,
    ssl: {
        certFile: './client.crt',
        keyFile: './client.key'
    }
});

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
                topic: 'interactions',
                message: {
                    value: JSON.stringify(data)
                }
            });
        }, interval);
    });
