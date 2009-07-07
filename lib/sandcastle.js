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
  var itCtor = this.env.it;
  var scopedWindow = this.frame.window;
  this.env.it = function (description, func) {
        console.log('description', description);
        console.log('func', func);
        var wrappedFunc = function() {
          console.log('scopedWindow', self.frame.contentWindow);
          with({window:self.frame.contentWindow}) {
            func();
          }

        };
        itCtor.call(self.env, description, wrappedFunc);
      };
  this.frame.onload = function () {
    self.loadScripts.call(self, function () {
      if (latchFn) {
        latchFn();
      }
    });
  };
  this.parentDocument.body.appendChild(this.frame);
};

