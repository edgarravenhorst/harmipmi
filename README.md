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

...
---------- app/screens/1/index.html
---------- app/manifest.json <- version+id+don't touch screens

Motion
------

...
---------- docs/ipmi-ws.md <- todo
---------- proxy (noorderhagen+wirelab)

Simulator
---------

...
---------- todo

Framework
---------

...
---------- docs/martijn.md <- todo
