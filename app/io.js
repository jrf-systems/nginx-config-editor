var fs = require('fs');
var exec = require('child_process').exec;
var config = require('./config.json');

var walk    = require('walk');
global.files   = [];

function listFiles()
{
	global.files   = [];

	var options;
	var walker;

	options = {
		listeners: {
			file: function(root, stat, next) {
				var tmp = root + '/' + stat.name; 
				global.files.push(tmp.replace(config.config_folder, ''));
				next();
			}
		}
	};

	walker = walk.walkSync(config.config_folder, options);

}

module.exports = function (io) {
  io.on('connection', function (client) {
    console.log(client.request.connection.remoteAddress + " Client connected");
    listFiles()
    io.emit('list-configs', files);

    client.on('show-config', function(file) {
      fs.readFile(config.config_folder + file, 'utf8', function(err, data) {
        var obj = {'file': file, 'data': data};
        io.emit('show-config', obj);
      });
    });

    client.on('save-config', function (obj) {
      fs.writeFile(config.config_folder + obj.file, obj.data, function (err) {
        console.log(client.request.connection.remoteAddress + " config saved - " + obj.file);
        listFiles()
        io.emit('list-configs', files);
      });
    });

    client.on('delete-config', function (file) {
      fs.unlink(config.config_folder + file, function() {
        console.log(client.request.connection.remoteAddress + " config deleted - " + file);
        listFiles()
        io.emit('list-configs', files);
      });
    });

    client.on('reload-nginx', function (action) {
      var command = "nginx -s reload";
      exec(command, function (err, stdout, stderr) {
        if (err) {
          io.emit('error', err.toString());
        } else {
          io.emit('reload-success', stdout);
          console.log(client.request.connection.remoteAddress + " reload-success");
        }
      });
    });

    client.on('restart-nginx', function (action) {
      var command = "systemctl restart nginx";
      exec(command, function (err, stdout, stderr) {
        if (err) {
          io.emit('error', err.toString());
        } else {
          io.emit('restart-success', stdout);
          console.log(client.request.connection.remoteAddress + " restart-success");
        }
      });
    });

    client.on('check-syntax', function (action) {
      var command = "nginx -t";
      exec(command, function (err, stdout, stderr) {
        if (err) {
          io.emit('error', err.toString());
        } else {
          io.emit('syntax-success', stdout);
        }
      });
    });
  });
}
