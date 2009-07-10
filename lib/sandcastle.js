var SandCastle = function (env) {
  this.env = env || jasmine.getEnv();
  this.parentDocument = document;
  this.scripts = [];
  this.frame = null;
};

SandCastle.prototype.addScript = function(script) {
  this.scripts.push(script);
};

SandCastle.prototype.loadScripts = function(onComplete, i) {
  i = i || 0;
  if (i < this.scripts.length) {
    var script = this.frame.contentDocument.createElement('script');
    script.type = 'text/javascript';
    script.src = this.scripts[i];
    var self = this;
    script.addEventListener('load', function () {
      self.loadScripts(onComplete, i + 1);
    }, false);
    this.frame.contentDocument.body.appendChild(script);
  } else {
    onComplete();
  }
};

SandCastle.prototype.init = function (latchFn) {
  var self = this;
  this.frame = document.createElement('iframe');
  this.frame.name = 'sandbox-frame';
  this.frame.style.display = 'none';
  this.frame.onload = function () {
    self.frame.contentWindow.jasmine = {
      getEnv: function () {
        return self.env;
      }
    };
    self.loadScripts.call(self, function () {
      if (latchFn) {
        latchFn();
      }
    });
  };
  this.parentDocument.body.appendChild(this.frame);
};

