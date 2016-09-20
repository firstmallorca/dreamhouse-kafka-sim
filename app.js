let Kafka = require('no-kafka');

let brokerUrls = process.env.KAFKA_URL.replace(/\+ssl/g,'');

let producer = new Kafka.Producer({
    connectionString: brokerUrls,
    ssl: {
        certFile: './client.crt',
        keyFile: './client.key'
    }
});

producer.init();
