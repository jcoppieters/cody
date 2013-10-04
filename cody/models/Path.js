function Path( path, deflanguage ) {
  // eliminate leading "/"
  if(path.indexOf("/") === 0){
    path = path.substring(1);
  }

  this.language = deflanguage;
  this.domain = "";
  this.request = "";
  this.id = "";
  this.path = path;

  // language
  var i = path.indexOf("/");
  if (i > 0 ) {
    this.language = path.substring(0, i);

    // domain or page link without the language
    path = path.substring(i+1);
    i = path.indexOf("/");
    if (i <= 0) {
      this.domain = path;
    } else {
      this.domain = path.substring(0, i);

      // subdomain or request
      path = path.substring(i + 1);
      i = path.indexOf("/");
      if (i <= 0) {
        this.request = path;
      } else {
        this.request = path.substring(0, i);

        // id
        path = path.substring(i + 1);
        i = path.indexOf("/");
        this.id = (i > 0) ? path.substring(0, i) : path;
      }
    }
  }

  this.pagelink = this.language + "/" + this.domain;
  this.link = "/" + this.pagelink;

  // console.log(this);
}

module.exports = Path;