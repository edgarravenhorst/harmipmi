IPMI Hackaton
=============

This is a collection of tools, demos and a base application to build your app with.

Admin
-----

There is a admin interface available at `http://ipmi.wirelab.nl:8000/admin`.
Here you can upload apps and show them on the various installations.

Building
--------

There is a `build.sh` script provided that will bundle the app into a zip that will work with the admin interface.
For windows there is a `build.bat` provided that does the same.

For windows a working `zip.exe` is provided. on osx `zip` is standard.
On linux make sure you have a working `zip` command.


App
---

The main entrypoint for an app is [app/screens/1/index.html](app/screens/1/index.html).
The id and version of the app are specified in [app/manifest.json](app/manifest.json).

Do not edit the screen id as currently only screen `1` is in use.
Make sure you change the version if you want to publish an updated application.

Motion
------

We use 'TSPS' for motion detection. TSPS access is provided with a websocket.
Documentation about the specific protocol can be found at under [docs/ipmi-ws.md](docs/ipmi-ws.md).

There is a proxy available for both the wirelab installation and the noorderhagen installation.
The websockets are available under the following urls.

- `http://ipmi.wirelab.nl:4000/secret/noorderhagen`
- `http://ipmi.wirelab.nl:4000/secret/wirelab`

Simulator
---------

...
---------- docs/martijn.md <- todo

Framework
---------

...
---------- docs/martijn.md <- todo
