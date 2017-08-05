## Nginx Config Editor
This is a simple web-based tool to edit nginx configuration files.  With it you can remotely edit configuration files, create new configuration files, check the files for syntax errors, as well as restart the nginx service.

To run this this project, you must have Node.js installed, along with npm, the Node.js package manager.

Clone the project:

`git clone https://github.com/JacFearsome/nginx-config-editor.git`

Install the node module dependencies:

`cd nginx-config-editor && npm install`

Run the app (you must run as sudo to be able to access the nginx directory):

`sudo node server.js`

And finally, go to http://localhost:7676/ in your web browser.

You can also change the default directory used to look for nginx files by editing app/config.js, which by default is set to `/etc/nginx/sites-enabled`.

I would recommend only running this within a local network, as to prevent the entire internet from having the ability to edit your nginx configuration files.

Also, if you decide to use this on a more permanent basis, I would not recommend setting up an nginx reverse proxy for it, because if your nginx breaks while you are editing files, you will lose access to the site and won't be able to fix the problem.  In other words, because this tool manages nginx, don't access it through an nginx reverse proxy.