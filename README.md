# Merchant-Mile

This is the repository of the Merchant Miles text based adventure. 

## Basic Struture

the file struture looks like this

```
src
 ┣ components
 ┃ ┣ shops.twee
 ┃ ┗ slums.twee
 ┣ javascript
 ┃ ┣ config.js
 ┃ ┣ external-macro.js
 ┃ ┣ macro.js
 ┃ ┗ main.js
 ┣ minor-components
 ┃ ┣ farm.twee
 ┃ ┗ slot-machine.twee
 ┣ stylesheet
 ┃ ┣ external.css
 ┃ ┗ main.css
 ┗ merchant-miles.twee
 ```

## For Developers

```console
  # To build the main index.html file in the build folder
  $ npm run build

  # to build the .twee file in the root folder
  $ npm run decompile

  # to watch the main index.html file in the builder
  $ npm run watch
```