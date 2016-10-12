# qe-helper

[![bitHound Overall Score](https://www.bithound.io/github/eharris93/qe-helper/badges/score.svg)](https://www.bithound.io/github/eharris93/qe-helper)

This node module is designed to reduce the time spent doing repetitive tasks.

# Installation

Install using the following command

~~~bash
[sudo] npm install -g qe-helper
~~~

# What can I do?

Currently you can run the following commands. Options, flags and further help can be found by running -h/--help for each command.

~~~bash
qe env-info - Prints out info for your environment
~~~

~~~bash
qe get-latest - Get the latest and greatest Appc Core, Appc NPM and Ti SDK versions
~~~

~~~bash
qe switch-env - Switch between environment
~~~

~~~bash
qe update-tiapp - Update a tiapp with a certain SDK
~~~

~~~bash
qe config - Get, set and list values stored in the config, useful for making qe switch-env easier!
~~~

~~~bash
qe remove - Remove Appc Core and SDKs from your machine all in one go
~~~

# Development

Clone this repo

~~~bash
git clone https://github.com/ewanharris/qe-helper.git
~~~

Link the repo to your node modules for testing

~~~bash
npm link
~~~

Develop and make PRs for new commands!

Alternatively [file an issue](https://github.com/ewanharris/qe-helper/issues) with what you want to see implemented!
