describe('error', function () {
  var server, port, m;
  before(function (done) {
    listen(function (s, p) {
      server = s;
      port = p;
      m = middler(server, function (req, res, next) {
        next(new Error('i am an error...'));
      });
      done();
    });
  });

  it('default error handler', function (done) {
    request.get('http://localhost:' + port + '/', function (res) {
      assert.equal(res.statusCode, 500);
      assert.equal(res.text, undefined);
      done();
    });
  });

  it('custom error handler', function (done) {
    m.on('error', function (err, req, res) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end(err + '');
    });
    request.get('http://localhost:' + port + '/', function (res) {
      assert.equal(res.statusCode, 400);
      assert.equal(res.text, 'Error: i am an error...');
      done();
    });
  });

  it('closes the server', function (done) {
    server.once('close', done);
    server.close();
  });
});