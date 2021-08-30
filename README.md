# Harmonicon

Harmonicon is an experimental music-as-code digital audio workstation for browsers.

## Vision

Compose music with human-readable programming constructs that emphasize compositional quality and music theory.

Provide base functionality expected of modern digital audio workstations-- tracks, sends, effects, chains, beat mapping, automation, etc.

## Features

* Rich music theory support (chords, modes, key signatures, transposition)
* Tracks, sends, chains, and automation


## Usage

Docker (preferred):

```
docker run harmonicon
```

From source:

```
git clone ...
cd ...
npx lerna bootstrap
```


## Modules

* [@harmonicon/cli](packages/cli) - command line interface
* [@harmonicon/compose](packages/compose) - 
* [@harmonicon/core](packages/core)
* [@harmonicon/driver](packages/driver)
* [@harmonicon/driver-audio-mock](packages/driver-audio-mock)
* [@harmonicon/driver-audio-tone](packages/driver-audio-tone)
* [@harmonicon/driver-storage-localstorage](packages/driver-storage-localstorage)
* [@harmonicon/driver-storage-mock](packages/driver-storage-mock)
* [@harmonicon/examples](packages/examples)
* [@harmonicon/library-core](packages/library-core)
* [@harmonicon/util](packages/util)
* [@harmonicon/web](packages/web)
