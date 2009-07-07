jasmine.include('../lib/sandcastle.js', true);
describe('SandCastle', function () {
  var env, sandcastle;

  beforeEach(function () {
    env = new jasmine.Env();
    sandcastle = new SandCastle(env);
  });

  it('should run tests with a different window scope', function() {
    window.foo = 'bar';
    var completedInit = false;
    sandcastle.init(function () {
        completedInit = true;
      });
    waitsFor(1000, function () {
      return completedInit;
    });
    runs(function () {
      env.describe('JasmineSuite', function () {
        env.it('JasmineSpec', function () {
          console.log('in test', window);
          env.expect(window.foo).toEqual(undefined);
          window.foo = 'baz';
        });
      });
      env.currentRunner.execute();
              
      expect(env.currentRunner.suites.length).toEqual(1);
      expect(env.currentRunner.suites[0].specs[0].results.getItems()[0].passed).toEqual(true);
      expect(window.foo).toEqual('baz');
    });



  });

});