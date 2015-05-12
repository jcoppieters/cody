Contributing
============

We are happy to accept your pull requests. If you do, make sure you clearly explain what and why you changed/added something so we can easily review it.

* Sadly enough we have no tests yet, but they will be coming soon.
* Make sure your code is linted and follow the general code style:
  * "" for strings
  * 2 whitespace indentation
  * named functions as much as possible
  * semi-colons!
  * name your captured this "self"


Guide to making a pull request can be found here: 


A shortened version goes as follows:

I assume you have git command-line installed, if not install from [here](http://git-scm.com/downloads).

1) **Fork** this repository by clicking the "Fork" in the upper corner of this page,
or by visiting this link: https://github.com/jcoppieters/cody/fork

2) **Clone** your forked repository (probably called linksgo2011/cody) on your local computer ([guide to cloning](https://github.com/jcoppieters/cody/compare/))

````
$ git clone https://github.com/jcoppieters/cody.git
````

3) Make a new branch with a name that conveys your change (e.g. "added-unicorns")

````
$ git checkout -b feature_branch_name
````

4) Make the changes you want to make on the files of the local repository.

5) **Commit** the changes. In your local repository do:

```` 
$ git add . -A
$ git commit -a -m "explain the changes you made. (e.g. I added unicorns)"
````

6) **Push** the changes to your forked repository on github. In your local repository do:

```` 
$ git push -u origin feature_branch_name
````

6) Submit a **Pull Request** by going to your repository on github and clicking the green arrows at the left top, or by visiting this link: https://github.com/jcoppieters/cody/compare/.
Choose your new branch to pull to the jcoppieters/master branch.





I hope this helps to get you started, if you got any question/problem along the way just shoot!

All the best.
