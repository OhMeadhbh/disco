disco
=====

The Discovery Web Desktop

## What Is Disco?

Disco is a node.js application that implements the Discovery Web 
Desktop (but keep in mind, I sometimes use the terms
interchangeably.) The "Discovery Web Desktop" is a web
application that looks like a standard computer desktop. You have
a menu bar, resizeable/repositionable windows and even icons.

Disco was created mostly to provide an environment to test user
interface ideas. As it took shape, however, it became clear it
could actually be a useful part of my daily life. Disco currently
provides a framework for you to make your own desktop
application, but we'll continue to add features to make it more
usable "out of the box."

## How Do I Install Disco?

To install disco, first install [Node.JS](http://nodejs.org/),
[git](http://git-scm.com/) and the
[make utility](http://en.wikipedia.org/wiki/Make_%28software%29) 
for your platform. Once you've done that, you can install disco 
by cloning the repository:

`git clone https://github.com/OhMeadhbh/disco.git`

Next issue the make command to download prerequisite node
packages and fonts.

`make`

Disco uses the [sn-app](https://github.com/smithee-us/sn-app)
package, so you will need to install this package if it's not
already on your system. If you type the `sn-app` command into a
terminal window and get a message like "command not found", use
the NPM tool to install the sn-app package:

`sudo npm install -g sn-app`

Disco is configured to listen on port 8080 by default. If you 
want to change this behavior, edit the **disco.json** file and 
look for this JSON clause:

    "listen": {
      "port": 8080
    }

and change the number after the "port" identifier to the port
you want to listen on. If you want to listen on a specific
network interface, add a "host" key-value pair specifying the
IP address of the interface you want to listen on. Here's an
example of listening only on port 9000 of the loopback
interface:

    "listen": {
      "port": 9000,
      "host": "127.0.0.1"
    }

After making appropriate changes, change to the root disco
directory (the one with the disco.json file in it) and launch
the application with this command:

`sn-app --config file://disco.json`

Once launched, you *should* be able to see the Discovery Web
Desktop at the URL
[http://localhost:8080/](http://localhost:8080).
