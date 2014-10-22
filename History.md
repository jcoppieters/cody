# History

## 3.2.0 - 22/10/2014

* ccs now generates a config.json file that contains all the necessary configuration variables. They can be changed manually in the file or they can be overriden by setting the respective environment variables.
```bash
  $ dbuser=mydbuser dbpassword=mydbpassword port=8080 node index
```

> The user is no longer required to change the index.js afer scaffolding.
