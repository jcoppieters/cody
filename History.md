# History

## 3.3.2 - 06/11/2014
* The scaffolding is now written in node, run with: $node ./node_modules/cody/bin/create_script

## 3.2.0 - 22/10/2014

* cccs -> create_script
* create_script now generates a config.json file that contains all the necessary configuration variables. They can be changed manually in the file or they can be overriden by setting the respective environment variables.
```bash
  $ dbuser=mydbuser dbpassword=mydbpassword port=8080 node index
```

> The user is no longer required to change the index.js afer scaffolding.
