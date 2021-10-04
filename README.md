# Hotel-UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.1.

## Generate API Client

Before starting the application, you need to have the `api-client` folder in your project under `hotel-ui/src`. The `api-client` folder holds information about `hotel-controller`, namely specifications for endpoints and data transfer objects (DTOs). To generate this, you need to have `hotel-controller` running first (refer to related `README.MD` file). 

After you successfully start `hotel-controller`, execute the command `npm run generateApiClient`.

***Note:*** Backend has to be up and running, in order to generate `api-client`, or regenerate it if something has changed in the backend endpoint or DTOs.

## Starting up the application

To build and start up `hotel-ui` in local (live rebuild) mode, open the terminal, if you are not already there, navigate to the directory named `hotel-ui` and run the following command:

 ```./startUp.sh```

Your application will be running on `localhost:4205`, and will rebuild after making any changes to the code.

To build and start up `hotel-ui` using the same configuration as the deployed application in the cloud (no live rebuild), run:

 ```./startUp.sh dev```

Your application will be running on `localhost:3005`

***Note:*** If you are starting the `hotel-ui` for the first time, it can take some minutes until the dependencies get installed and the application is available on the respective localhost. Check the logs of the `hotel-ui` container and wait for the success log. After this, you can browse the application.

If you get an error 'Permission denied error' run `chmod +x startUp.sh`.
In case of other errors, please refer to the ***Troubleshoot*** section at the end of this README.

## Inconsistency in names
The first version of the application was built using certain criteria and design that have later changed. Since the backend of this application is also being used by many other integrated applications, any breaking changes to the mentioned backend would mean breaking changes to integrated applications as well.
Therefore, for these reasons and for consistency reasons between Backend/Frontend some of the changes in names are only done in the text visible to the user. In this section you can find the list of inconsistent terms between what user sees and what it is called in the code. 
- In the code: `User` Displayed as: `Employee`
- In the code: `Master ID` Displayed as: `Basis-ID`

## Running unit tests
To execute the unit tests via [Karma](https://karma-runner.github.io), run:

 ```npm run test```

## Linting

 ```npm run lint```

Lint is being used to enforce project's coding standards. All pull/merge requests have to pass the lint check. If they don't, the application will fail to build.

## Credentials
A sample user credential has been seeded while starting the application:

For the admin:

- username: {your_configured_admin_username}
- password: {your_configured_admin_password}

For the employee: 

- username: {your_configured_user_username}
- password: {your_configured_user_password}
## Troubleshoot:
If you get the following error: 'Object is possibly undefined' when generating the `api-client`, or when starting the application with ```./startUp.sh``` or ```./startUp.sh dev```, try the steps below:

- comment out the code in the `hotel-controller` (OpenAPIConfiguration.java)  
```@SecurityScheme(name = "X-API-Key", type = SecuritySchemeType.APIKEY, in = SecuritySchemeIn.HEADER)```
- restart backend
- regenerate `api-client
