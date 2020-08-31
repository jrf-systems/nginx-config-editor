var fs = require('fs');
var exec = require('child_process').exec;
var configpath = __dirname + '/config.json';
var config = require(configpath);
var path = require('path');

var walk = require('walk');
global.files = [];

var nginx = process.env.NGINX || 'nginx';
var configFoler = process.env.CONFIG || config.config_folder;

function listFiles() {
  global.files = [];

  var options;
  var walker;

  options = {
    listeners: {
      file: function (root, stat, next) {
        var tmp = path.join(root, stat.name);
        global.files.push(tmp.replace(configFoler, '').replace('/', ''));
        next();
      },
    },
  };

  walker = walk.walkSync(configFoler, options);
}

module.exports = function (io) {
  io.on('connection', function (client) {
    console.log(client.request.connection.remoteAddress + ' Client connected');
    listFiles();
    io.emit('list-configs', files);

    client.on('show-config', function (file) {
      fs.readFile(path.join(configFoler, file), 'utf8', function (err, data) {
        var obj = { file: file, data: data };
        io.emit('show-config', obj);
      });
    });

    client.on('save-config', function (obj) {
      var title = obj.file;
      var filename = '';
      if (title == configpath) {
        filename = configpath;
      } else {
        filename = path.join(configFoler, obj.file);
      }
      fs.writeFile(filename, obj.data, function (err) {
        console.log(client.request.connection.remoteAddress + ' config saved - ' + obj.file);
        listFiles();
        io.emit('list-configs', files);
      });
    });

    client.on('delete-config', function (file) {
      fs.unlink(configFoler + file, function () {
        console.log(client.request.connection.remoteAddress + ' config deleted - ' + file);
        listFiles();
        io.emit('list-configs', files);
      });
    });

    client.on('reload-nginx', function (action) {
      var command = `${nginx} -s reload`;
      exec(command, function (err, stdout, stderr) {
        if (err) {
          io.emit('error', err.toString());
        } else {
          io.emit('reload-success', stdout);
          console.log(client.request.connection.remoteAddress + ' reload-success');
        }
      });
    });

    client.on('restart-nginx', function (action) {
      var command = `${nginx} -s stop && ${nginx}`; // "systemctl restart nginx";
      exec(command, function (err, stdout, stderr) {
        if (err) {
          io.emit('error', err.toString());
        } else {
          io.emit('restart-success', stdout);
          console.log(client.request.connection.remoteAddress + ' restart-success');
        }
      });
    });

    client.on('check-syntax', function (action) {
      var command = `${nginx} -t`;
      exec(command, function (err, stdout, stderr) {
        if (err) {
          io.emit('error', err.toString());
        } else {
          io.emit('syntax-success', stdout);
        }
      });
    });

    client.on('load-config', function (action) {
      fs.readFile(configpath, 'utf8', function (err, data) {
        var obj = { file: configpath, data: data };
        io.emit('load-config', obj);
      });
    });
  });
};
