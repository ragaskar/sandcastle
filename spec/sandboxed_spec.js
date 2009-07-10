jasmine.getEnv().describe('JasmineSuite', function () {
  jasmine.getEnv().it('JasmineSpec', function () {
    this.expect(window.foo).toEqual(undefined);
    window.foo = 'baz';
  });
});
