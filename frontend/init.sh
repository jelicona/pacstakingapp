#!/bin/bash

# Nombre del proyecto
PROJECT_NAME="pacstakingapp"

# Crear estructura de carpetas
mkdir -p $PROJECT_NAME/{css,js,assets}

# Crear archivos básicos
touch $PROJECT_NAME/index.html
touch $PROJECT_NAME/css/styles.css
touch $PROJECT_NAME/js/{model.js,view.js,controller.js,app.js}
echo "# Proyecto MVC con JavaScript Vanilla" > $PROJECT_NAME/README.md

# Añadir contenido inicial a index.html
cat <<EOL > $PROJECT_NAME/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto MVC con JavaScript</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div id="app">
        <h1>Hola Mundo</h1>
        <div id="content"></div>
    </div>
    <script src="js/model.js"></script>
    <script src="js/view.js"></script>
    <script src="js/controller.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
EOL

# Añadir contenido básico a los archivos de JS
echo "const Model = { data: {}, getData() {}, setData() {} };" > $PROJECT_NAME/js/model.js
echo "const View = { render() {} };" > $PROJECT_NAME/js/view.js
echo "const Controller = { init() {} };" > $PROJECT_NAME/js/controller.js
echo "document.addEventListener('DOMContentLoaded', () => { Controller.init(); });" > $PROJECT_NAME/js/app.js

echo "¡Proyecto MVC en JavaScript Vanilla creado en la carpeta $PROJECT_NAME!"
