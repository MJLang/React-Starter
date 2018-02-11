const fs = require('fs');
const path = require('path');
const utils = require(path.join(__dirname, '..', 'utils.js'));
const handlebars = require('handlebars');

const args = process.argv.slice(2);

if (args.length === 0) {
  return console.log('Incorrect number of arguments. See usage for examples');
}

const type = args[0];
const inputComponentName = args[1];
const options = args.slice(2);

// Validate component type
if (['child', 'common', 'feature', 'page'].indexOf(type) === -1) {
  return console.log('<type> must be child, common, feature, or page');
}

// If this is page, make sure the component name does not end in page since it's auto-added
if (type === 'page' && inputComponentName.toLowerCase().endsWith('page')) {
  return console.log('Page type component names should not end in page "Page". That will be appended automatically.');
}

// Is the GQL option active?
const hasGQL = options.indexOf('--gql') !== -1;
// Is the HTTP Option active?
const hasHttp = options.indexOf('--http') !== -1;
// Is the Redux option active?
const hasRedux = options.indexOf('--redux') !== -1;
// Is the style option active?
const hasStyles = options.indexOf('--styles') !== -1;
// Hyphenated component name.
const nameHyphen = utils.toHyphens(inputComponentName);
// The export that the component is consumed via.
const nameExport = hasRedux ? `${inputComponentName}Component` : inputComponentName;
// Whether or not the component has state
const isStateless = options.indexOf('--stateless') > -1;

let hasPath = false;
let noPathSupplied = false;
let pathOption;
options.forEach((option) => {
  if (option.indexOf('--path') !== -1) {
    hasPath = true;
    if (option.indexOf('=') !== -1) {
      pathOption = option.split('=')[1];
    } else {
      noPathSupplied = true;
    }
  }
});

if (noPathSupplied) {
  return console.log('--path option must be supplied with a relative path');
}
if (hasPath && type !== 'child') {
  return console.log('--path option may only be used for the child <type>')
}

// Absolute path to the component folder
let subfolder = '';
switch (type) {
  case 'child':
    if (!hasPath) {
      return console.log('Child components require a parent path to be specified');
    }
    subfolder = pathOption;
    break;
  case 'common':
    subfolder = 'common';
    break;
  case 'feature':
    subfolder = 'features';
    break;
  case 'page':
    subfolder = 'pages';
    break;
}

let componentFolder = '';
switch (type) {
  case 'child':
  case 'common':
    componentFolder = path.join(process.cwd(), 'src', subfolder, 'components', nameHyphen);
    break;
  default:
    componentFolder = path.join(
      process.cwd(),
      'src',
      subfolder,
      nameHyphen,
      'components',
      nameHyphen + (type === 'page' ? '-page' : '')
    );
    break;
}

// Validate common arguments.
if (!inputComponentName.substring(0, 1).match(/[A-Z]/)) {
  return console.log(`<name> must be PascalCase: ${inputComponentName}`);
}

// Create the directory if it doesn't exist.
if (!fs.existsSync(componentFolder)) {
  componentFolder.split(path.sep).reduce((parent, child) => {
    const current = path.resolve(parent, child);
    if (!fs.existsSync(current)) {
      fs.mkdirSync(current);
    }
    return current;
  }, path.sep);
}

// Create the component template file.
fs.writeFileSync(path.join(componentFolder, 'component.tsx'),
  handlebars.compile(
    fs.readFileSync(
      path.join(
        __dirname,
        isStateless ? 'stateless.template' : 'stateful.template'
      ),
      'utf8'
    )
  )({
    graphql: hasGQL,
    nameComponent: hasRedux ? `${inputComponentName}Presentation` : `${inputComponentName}Component`,
    nameExport,
    nameHyphen,
    nameLower: utils.toFirstLower(inputComponentName),
    nameSpace: utils.toSpaces(inputComponentName),
    name: inputComponentName,
    pubsub: options.indexOf('--pubsub') !== -1,
    redux: hasRedux,
    http: hasHttp,
    route: type === 'page',
    styles: hasStyles,
  })
);

if (hasStyles) {
  // Create the styles template.
  fs.writeFileSync(path.join(componentFolder, 'styles.scss'),
    handlebars.compile(
      fs.readFileSync(path.join(__dirname, 'styles.template'), 'utf8')
    )({
      nameHyphen
    })
  );
}

// Prevents a linter error based on the nameExport not being in alphabetical ordering with the rest of the test files.
const testComponentImports = [nameExport, 'PublicProps'];
if (!isStateless) {
  testComponentImports.push('State');
}


// Create the index template.
fs.writeFileSync(path.join(componentFolder, 'index.ts'),
  handlebars.compile(
    fs.readFileSync(path.join(__dirname, 'index.template'), 'utf8')
  )({
    redux: hasRedux,
  })
);

// Create the parent index template
if (type === 'page' || type === 'feature') {
  fs.writeFileSync(path.join(componentFolder, '..', '..', 'index.ts'),
    handlebars.compile(
      fs.readFileSync(path.join(__dirname, 'parent-index.template'), 'utf8')
    )({
      redux: hasRedux,
      folder: nameHyphen + (type === 'page' ? '-page' : ''),
    })
  );
}

// Create the Redux container template if necessary.
if (hasRedux) {
  fs.writeFileSync(path.join(componentFolder, 'container.ts'),
    handlebars.compile(
      fs.readFileSync(path.join(__dirname, 'container.template'), 'utf8')
    )({
      name: inputComponentName,
    })
  );
}

if (hasGQL) {
  fs.writeFileSync(path.join(componentFolder, `${nameHyphen}.gql`),
    handlebars.compile(
      fs.readFileSync(path.join(__dirname, 'gql.template'), 'utf8')
    )({
      name: inputComponentName,
    })
  );
}
