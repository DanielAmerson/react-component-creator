const fs = require('fs');
const path = require('path');

const createRoute = (componentsToCheck => {
    let currentRouteToCheck = process.cwd();
    componentsToCheck.forEach(componentToCheck => {
        currentRouteToCheck = `${currentRouteToCheck}${path.sep}${componentToCheck}`;
        if (!fs.existsSync(currentRouteToCheck)) {
            console.log(`Creating directory ${currentRouteToCheck}...`);
            fs.mkdirSync(currentRouteToCheck);
        }
    });
});

const createIndexFile = ((route, componentName) => {
    const contents =
        `import ${componentName}, { ${componentName}Props } from './${componentName}';\n` +
        `\n` +
        `export default ${componentName};\n` +
        `export type ${componentName}Props = ${componentName}Props;\n`;

    fs.writeFileSync(`${route}${path.sep}index.ts`, contents, err => {
        if (err) throw err;

        console.log('index.ts persisted.');
    });
});

const createStyleFile = ((route, componentName) => {
    fs.writeFileSync(`${route}${path.sep}${componentName}.module.css`, '', err => {
        if (err) throw err;

        console.log(`${componentName}.module.css persisted.`);
    });
});

const createComponentFile = ((route, componentName) => {
    const contents =
        `import React from 'react';\n` +
        `\n` +
        `import styles from './${componentName}.module.css';\n` +
        `\n` +
        `export type ${componentName}Props = {}\n` +
        `\n` +
        `const ${componentName}: React.FunctionComponent<${componentName}Props> = (props) => {\n` +
        `    return <></>;\n` +
        `}\n` +
        `\n` +
        `export default ${componentName};\n`;

    fs.writeFileSync(`${route}${path.sep}${componentName}.tsx`, contents, err => {
        if (err) throw err;

        console.log(`${componentName}.tsx persisted.`);
    });
});

const args = process.argv.slice(2);
if (args.length != 1) {
    console.log('Usage: node create-template.js <relative-path-to-component>');
} else {
    const componentRoute = args[0];
    const pathComponents = componentRoute.split(path.sep);
    
    let componentName = pathComponents[pathComponents.length - 1];
    componentName = componentName.charAt(0).toLocaleUpperCase() + componentName.slice(1);

    const componentDestination = `${process.cwd()}${path.sep}${componentRoute}`;

    console.log(`Creating ${componentName} in ${componentDestination}...`);

    createRoute(pathComponents);
    createIndexFile(componentDestination, componentName);
    createStyleFile(componentDestination, componentName);
    createComponentFile(componentDestination, componentName);
    
    console.log('Done!');
}
