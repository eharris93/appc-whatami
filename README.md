# qe-helper

[![bitHound Overall Score](https://www.bithound.io/github/eharris93/qe-helper/badges/score.svg)](https://www.bithound.io/github/eharris93/qe-helper)

This node module is designed to reduce the time spent doing repetitive tasks.

# Installation

Install using the following command

~~~bash
[sudo] npm install -g git://github.com/eharris93/qe-helper.git
~~~

# What can I do?

Currently you can run the following commands

~~~bash
qe switchenv -u <username> -p <password> -e <environment>
~~~

~~~bash
qe update-tiapp -s 5.0.2.GA
~~~

~~~bash
qe check-env
~~~

# Development

Clone this repo

~~~bash
git clone https://github.com/eharris93/qe-helper.git
~~~

Link the repo to your node modules for testing

~~~bash
npm link
~~~

Develop and make PRs for new commands!

Alternatively [file an issue](https://github.com/eharris93/qe-helper/issues) with what you want to see implemented!
