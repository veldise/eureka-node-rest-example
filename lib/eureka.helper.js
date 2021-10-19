const config = require('../config.json');

const Eureka = require('eureka-js-client').Eureka;
const eurekaHost = (config.eureka.host || process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || '127.0.0.1');
const eurekaPort = config.eureka.port || 8761;
const ipAddr = config.application.host || '127.0.0.1';

exports.registerWithEureka = function (appName, PORT, isSecure) {
    let options = {
        instance: {
            instanceId: appName + ' test',
            app: appName,
            hostName: 'localhost',
            ipAddr: ipAddr,
            port: {
                '$': PORT,
                '@enabled': 'true',
            },
            vipAddress: appName,
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        //retry 10 time for 3 minute 20 seconds.
        eureka: {
            host: eurekaHost,
            port: eurekaPort,
            servicePath: '/eureka/apps/',
            maxRetries: 10,
            requestRetryDelay: 2000
        }
    };

    if (isSecure) {
        // https 설정시 시큐어 포트 설정 여기서는 확인 못하고 따로 확인 함.
        options.instance.securePort = {
            '$': 3002,
            '@enabled': 'true'
        };
    }
    const client = new Eureka(options);

    client.logger.level('debug');

    client.start(error => {
        console.log(error || 'user service registered');
    });

    function exitHandler(options, exitCode) {
        if (options.cleanup) {
            // ...
        }
        if (exitCode || exitCode === 0) {
            console.log(exitCode);
        }
        if (options.exit) {
            client.stop();
        }
    }

    client.on('deregistered', () => {
        console.log('deregistered');
        process.exit();
    });

    client.on('started', () => {
        console.log('eureka host ' + eurekaHost);
    });

    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
};
