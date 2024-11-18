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

#### Componenets 

This is where we put all the components of the new layer of the city

#### javascript

This is where we put all of our javascripts files

- ```config.js``` : all the Twine config
- ```external-macro.js``` : all the macro from external sources
- ```macro.js``` : all of our self built macros
- ```main.js``` : the rest of the javascripts

#### minor-components

This is where we put all the components that aren't related or experimental components

#### stylesheet

This is where we put all of our stylesheet files

- ```external.css``` : all of the external stylesheet
- ```main.css``` : all of our self written stylehseet


## For Developers

```console
  # To build the main index.html file in the build folder
  $ npm run build

  # to build the .twee file in the root folder
  $ npm run decompile

  # to watch the main index.html file in the builder
  $ npm run watch
```