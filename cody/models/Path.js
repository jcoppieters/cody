function Path( path, name, deflanguage ) {
  path = path.substring(1);

  this.prefix = "/" + name;
  this.language = deflanguage;
  this.domain = "";
  this.request = "";
  this.id = "";

  // the appname aka prefix used to be stripped here, but this has been removed as we switched to vhosting

  // language
  i = path.indexOf("/");
  if (i > 0 ) {
    this.language = path.substring(0, i);
      this.language="nl";

    // domain
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
    var debughelp = {
        "prefix" : this.prefix,
        "language": this.language,
        "domain": this.domain,
        "request": this.request,
        "id": this.id
    };

  this.link = this.prefix + "/" + this.language + "/" + this.domain;
  this.pagelink = this.language + "/" + this.domain;
}

module.exports = Path;