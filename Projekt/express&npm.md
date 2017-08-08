# Notizen zu express&npm

## Für die erstmalige Installation

> Falls express noch nicht installiert ist

cmd.exe > npm install -g express-generator

> cmd.exe Ausführen in "*\"

express LaVuelta

// edit package.json to:
{
  "name": "LaVuelta",
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


> cmd.exe Ausfuehren in "*\LaVuelta"

npm install

mkdir data



## Oder falls alles schon installiert ist, einfach nur

> cmd.exe Ausfuehren in "*\LaVuelta"

npm start