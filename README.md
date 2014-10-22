# Cody CMS

A Javascript Content Management System running on Node.js

We finally took upon the task, we are happy to announce the transition to Express 4 is now done! (dixit Slawo)

See http://www.cody-cms.org for more info and examples on http://github.com/jcoppieters/cody-samples

You can now use npm to install Cody thanks to Jonas.


## Getting Started

* Install [nodejs](http://nodejs.org/download/) and [mysql](http://dev.mysql.com/downloads/mysql/)
* Create a new directory for your cms and navigate to it (in unix):

  ```bash
        $ mkdir mycms
        $ cd mycms
  ```
  
* Set up a new web site using the guided scaffolding

  ```bash
    $ ./node_modules/.bin/ccs
    Creating cody web tree in current directory
    1) Enter sitename: my site
    Note: also using my site as database name.
    Note: by default the mysql root user has no password so you can just hit enter, if you forgot the root password see http://dev.mysql.com/doc/refman/5.0/en/resetting-permissions.html
    2) Enter root password for mysql so we can create a new database and user: 
    3) Enter site database user: mysitename
    4) Enter site database password: mysitepassword
    5) Enter hostname for site: mysite.local
    Site mysite has been prepared.
    
    Please create DNS entries, or add to /etc/hosts:
    127.0.0.1     mysite.local
    
    Also check mysite/index.js to fine-tune extra parameters, encryption key, ...
    
    Start your site using:
    forever start index.js
    or
    node index.js
  ```
* Add a DNS entry for given hostname, e.g.

  ```bash
    $ sudo bash -c 'echo 127.0.0.1 mysite.local >> /etc/hosts'
  ```
* Run the server
  
  ```bash
    $ node index.js
  ```
  or if you want to automatically restart the server on changes
  
  ```bash
    $ forever start index.js
  ```
  
* Go to "http://mysite.local"

    


## Troubleshooting

##### I get "ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)" when running the scaffold script
  > Your mysql server is not started.
  
  * On Mac OS: go to "System Preferences" -> "Mysql" -> "Start"
  * On any unix machine: ```$ mysqld &```

##### After "5) Enter hostname for site" it prompts for "Enter password:"
  > You entered the incorrect password for your root user of the mysql database.
  
  Try to figure out the correct password or reset it: http://dev.mysql.com/doc/refman/5.0/en/resetting-permissions.html
  
    

## License

Copyright (c) 2012-2014 Johan Coppieters, Howest Brugge. See the LICENSE.md file for license rights and
limitations. This project is licensed under the terms of the MIT license.


Johan Coppieters & Jonas Maes, Howest Brugge.
