# Notizen zu express&npm

## Für die erstmalige Installation

cmd.exe > npm install -g express-generator

> Falls express noch nicht installiert ist

> cmd.exe Ausführen in "*\"

express leaflet_map

// edit package.json to:
{
  "name": "leaflet-map",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.16.0",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.0",
    "express": "~4.14.1",
    "jade": "~1.11.0",
    "mongodb": "^2.2.25",
    "monk": "^4.0.0",
    "morgan": "~1.7.0",
    "serve-favicon": "~2.3.2"
  }
}


> cmd.exe Ausführen in "*\leaflet_map"

npm install

mkdir data



## Oder falls alles schon installiert ist, einfach nur

> cmd.exe Ausführen in "*\leaflet_map"

npm start