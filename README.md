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

You are now ready to clone this repository, if you haven't git yet, install it via:
`sudo apt install git`
then clone the project with:
`git clone git@gitlab.com:Luca_Lumetti/sagrafunkybot.git`
Switch into the folder with:
`cd sagrafunkybot`
and install all the required node packages:
`npm i`

You now have to create an API key for your bot. This process is completely handle by a Telegram bot named `@BotFather`. Follow it to get you first API key, and place it inside the config file using yout preferred file editor.
You find 2 token here, debug and prod. Please to avoid stange interaction that can happen if 2 bot use the same key, remove both of them and replace you key in both `debug_token` and `prod_token`.
If i've not missed anything and all the steps above proceeded as they should, you can now start the bot:
`node bot.js`
and send messages to the both you have created using `@BotFather`
