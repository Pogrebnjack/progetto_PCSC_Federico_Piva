"# progetto_PCSC_Federico_Piva" 

# Installation
First of all, you must update and upgrade the system via:
`systeminfo`
Next you can install npm and node:
`https://nodejs.org/en/`
`Nodejs` is the javsacript runtime used by `Chrome`, named `V8`, that will let you run javascript code directly on your system while `npm` is the _Node Package Manager_, the same as `PiP` for `Python`.
Check that everything went good during the installation by executing:
`node --version`
`npm --version`
Nodejs version should be >= 14 and npm version should be >= 7
Next you must install `MongoDB`.
To install MongoDB follow these steps:
`https://www.mongodb.com/try/download/community`
Check that everything went good during the installation by executing:
'mongo --version'
To activate the server
'mongod --dbpath "C:\Program Files\MongoDB\Server\4.4\data"'. You can create another route
Open another shell
'mongo'
The connection will be made to the db, installed locally (127.0.0.1)

If you are Ubuntu
# Installation
First of all, you must update and upgrade the system via:
`sudo apt update && sudo apt upgrade`
Next you can install npm and node:
`sudo apt install nodejs npm`
`Nodejs` is the javsacript runtime used by `Chrome`, named `V8`, that will let you run javascript code directly on your system while `npm` is the _Node Package Manager_, the same as `PiP` for `Python`.
Check that everything went good during the installation by executing:
`node --version`
`npm --version`
Nodejs version should be >= 14 and npm version should be >= 7
Next you must install `MongoDB`. Things here gets slightly more complicated as you can't directly use `apt` as the mongodb package provided by Ubuntu is not maintained by MongoDB Inc. and conflicts with the official `mongodb-org` package. If you have already installed the mongodb package on your Ubuntu system, you must first uninstall the mongodb package before proceeding.
To install MongoDB follow these steps:
`sudo apt-get install gnupg`
`wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -`
If you are not using Ubuntu >= 20.04, please use it, then:
`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list`
`sudo apt-get update`
`sudo apt-get install -y mongodb-org`

