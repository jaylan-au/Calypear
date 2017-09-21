# Installation

## Requirements
* Node JS - >v6.10
* NPM - >v3.10.10

## Installation
1. Download and install libraries with NPM `npm install`
2. Run gulp to build static web resources
  * `node node_modules/gulp/bin/gulp`
  * If gulp is installed globally `gulp`

# Starting Calypear
Start Calypear by running `node server/app.js` or `npm start`

Open a browser (chrome is strongly advised) and navigate to the URL the script outputs.

## Quickstart

### What is Quickstart?
Quickstart will create 1 user in the database, which will be announced on the console screen (normally username: admin, password: admin) - you can use this to login to the app. You should change this password as soon as possible, or create more users and expire this account.

### When Quickstart will run?
When calypear starts it will detect if Quickstart needs to run; if there are no users found in the database the startup script will run quickstart.
