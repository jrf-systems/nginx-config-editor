## Nginx Config Editor
This is a simple web-based tool to edit nginx configuration files.  With it you can remotely edit configuration files, create new configuration files, check the files for syntax errors, as well as restart the nginx service.

### Screenshots ###
Fullscreen:
![Nginx Config Editor](https://github.com/JacFearsome/nginx-config-editor/blob/master/images/nginxconfigeditor.png)
Edit app config:
![Edit App Config](https://github.com/JacFearsome/nginx-config-editor/blob/master/images/editappconfig.png)

### 9/4/19 Update ###
- I recently finished pushing some commits that addressed a couple issues raised
- I added an edit config button. This just loads the config.json for Nginx Config Editor
- I fixed a few bugs

### 3/27/19 Update ###
Thank you [se](https://github.com/se) and [KristijanL](https://github.com/KristijanL) for your contributions to the project.

### Run this Project ###
To run this this project, you must have Node.js installed, along with `npm`, the Node.js package manager.

Clone the project:

`git clone https://github.com/JacFearsome/nginx-config-editor.git`

Install the node module dependencies:

`cd nginx-config-editor && npm install`

Run the app (you must run as sudo to be able to access the nginx directory):

`sudo node server.js`

And finally, go to http://localhost:7676/ in your web browser.

### Some Notes ###
 - You can change the default directory used to look for nginx files by editing app/config.json, which by default is set to `/etc/nginx/sites-available`.
 - I would recommend only running this within a local network, as to prevent the rest of internet from having the ability to edit your nginx configuration files.
 - If you decide to use this on a more permanent basis, I would not recommend setting up an nginx reverse proxy for it, because if your nginx breaks while you are editing files, you will lose access to the site and won't be able to fix the problem.  In other words, because this tool manages nginx, don't access it through an nginx reverse proxy.
