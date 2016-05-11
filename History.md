# History
## 3.4.5 - 11/05/2015 - TC
* Added mysql 5.7+ support for population script
* Fixed index.ejs, content.ejs and page.ejs for node 6+

## 3.4 - 25/08/2015 - TC
* Merged the pull request (i18n) of linksgo into the master branch. Chinese is now supported for the Cody interface and more languages can be added.

## 3.3.19 - 03/06/2015 - JC
* Added IP and path logging for the 3 app's. (starts with "LOG --A--", S and D for resp. Application, Static and Dynamic content requests)

## 3.3.17 - 20/05/2015
* Added an example controller to the empty site, removes the bug where the controller directory isn't tracked by git.


## 3.3.10 - 10/04/2015
* better setup, small corrections.

## 3.3.5 - 29/03/2015
* changed the directory structure to more reflect the hosting setup
* changes create script and you now have a startupscript in your cody-dev directory per project
> The user is no longer required to change the index.js afer scaffolding.

## 3.3.14 - 28/03/2015
* Added ContactController

## 3.3.5 - 20/01/2015
* Allow custom config file that overwrites the default config by supplying it on command-line with -c, by andretw. [Pull request](https://github.com/jcoppieters/cody/pull/17)

## 3.3.4 - 02/01/2015
* Security: prevent from loading static files outside of the public folder scope. [Issue](https://github.com/jcoppieters/cody/issues/16)

## 3.3.2 - 06/11/2014
* The scaffolding is now written in node, run with: $node ./node_modules/cody/bin/create_script

## 3.2.0 - 22/10/2014

* cccs -> create_script
* create_script now generates a config.json file that contains all the necessary configuration variables. They can be changed manually in the file or they can be overriden by setting the respective environment variables.
```bash
  $ dbuser=mydbuser dbpassword=mydbpassword port=8080 node index
```



