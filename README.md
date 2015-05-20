# Cody CMS

A Javascript Content Management System running on Node.js

We finally took upon the task, we are happy to announce the transition to Express 4 is now done! (dixit Slawo)

See http://www.cody-cms.org for more info and examples on http://github.com/jcoppieters/cody-samples

You can now use npm to install Cody thanks to Jonas.

## Features

* Node.js CMS
* Easy-to-use graphical interface + wysiwyg (what you see is what you get) editor that allows non-programmers to manage the site's *content*, *users*, *files*, *forms* and *images*.
* Tree structured GUI to manage the structure of the site and the editable content by using templates and drag-and-drop.
* Works seamless with your existing node.js code.


## Getting Started

By following these steps you will be running your own CMS system in no time. If any of the steps do not work for you, please report this as an issue on this github repository and we will look into it as soon as possible!

* Install [nodejs](http://nodejs.org/download/) and [mysql](http://dev.mysql.com/downloads/mysql/)
* Create a new directory for your cms and navigate to it (in unix):

  ```bash
	$ mkdir codydev
	$ cd codydev
  ```
* Install cody and its dependencies
  
  ```bash
	$ npm install cody
  ``` 

* Set up a new web site using the guided scaffolding

  ```bash
    $ node ./node_modules/cody/bin/create_site
    
    Creating cody web tree in current directory
    1) Enter sitename: mysite
    Note: also using my site as database name.
    Note: by default the mysql root user has no password so you can just hit enter, if you forgot the root password see http://dev.mysql.com/doc/refman/5.0/en/resetting-permissions.html
    2) Enter root password for mysql so we can create a new database and user: 
    3) Enter site database user: mysitename
    4) Enter site database password: mysitepassword
    5) Enter hostname for site: mysite.local (or localhost)
    Site mysite has been prepared.
    
    Please create DNS entries, or add to /etc/hosts:
    127.0.0.1     mysite.local
    
    Also check index.js and config.json to fine-tune extra parameters, encryption key, ...
    
    Start your site using:
    forever start mysite.js
    or
    node mysite.js
  ```
* Add a DNS entry for given hostname, e.g.

  ```bash
    $ sudo bash -c 'echo 127.0.0.1 mysite.local >> /etc/hosts'
  ```
* Run the server
  
  ```bash
    $ node mysite.js
  ```
  or if you want to automatically restart the server on changes
  
  ```bash
    $ forever start mysite.js
  ```
  
* Go to "http://mysite.local:3001" to see your current site and go to "http://mysite.local:3001/en/dashboard" to see the CMS of the site.

  the default users are: 'super', 'admin', 'test' and 'user' which all have password 'empty'
  you can ofcourse use "http://localhost:3001" too.


## Configuration

The create_site scaffolding creates a config.json file in the root of your project directory. This configuration can be adjust in the following three ways, listed in order of overwriting order (e.g. values of 2 will overwrite those of 1, etc.):

1. Manually adjust the values in the config.json file
2. Create your own config file and supply it at command-line with the -c option (since v3.2.5, thanks to [andretw](https://github.com/jcoppieters/cody/pull/17))
```bash
$ node index.js -c my_overwriting_config.json
```
3. Provide environment variables
```bash
$ dbuser=dbuser dbpassword=dbpassword port=8080 node index.js
```

Careful, all three cases need a server restart before they take effect!
Have a look at the generated config.json file to see which configuration variables you can use.


## Troubleshooting

##### I get "ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)" when running the scaffold script
  > Your mysql server is not started.
  
  * On Mac OS: go to "System Preferences" -> "Mysql" -> "Start"
  * On any unix machine: ```$ mysqld &```

##### After "5) Enter hostname for site" it prompts for "Enter password:"
  > You entered the incorrect password for your root user of the mysql database.
  
  Try to figure out the correct password or reset it: http://dev.mysql.com/doc/refman/5.0/en/resetting-permissions.html

## Contributors

  * Johan Coppieters
  * Jonas Maes
  * Tim Coppieters
  * Dieter
  * Laurens
  * Jelle

  * devoidfury
  * Andretw
  * You? We are always happy to review and accept your issues/pull requests!
  
## License

Copyright (c) 2012-2015 Johan Coppieters, Howest Brugge. See the LICENSE.md file for license rights and
limitations. This project is licensed under the terms of the MIT license.


Johan Coppieters, Jonas Maes, Howest Brugge - Tim Coppieters, VUB.
