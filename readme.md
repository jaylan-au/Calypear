# Installation

## Requirements
* Node JS - >v6.10
* NPM - >v3.10.10

## Installation
1. Clone, or download this repository
1. Download and install libraries with NPM `npm install`
1. Run gulp to build static web resources
  * If gulp isn't already installed: `node node_modules/gulp/bin/gulp`
  * If gulp is installed on your system globally: `gulp`

# Starting Calypear
Start Calypear by running `node server/app.js` or `npm start`

Open a browser (chrome is strongly advised) and navigate to the URL the script outputs.

## Quickstart
To prevent starting an installation without users, that can't be accessed, `calypear-quickstart` will check everytime the server starts if any users exist in the database, if not it will create one and announce this on the console (or log file if you've configured logging), normally the username will be `admin` and the password `admin` as well. 

### Prevent Quickstart
Quickstart will always run, but will take no action if any user exists in the database (even if the only user is expired or invalid).
