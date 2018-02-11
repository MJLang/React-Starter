const
  childProcess = require('child_process'),
  path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  usage();
  return;
}

childProcess.fork(path.join(__dirname, 'component', 'component.js'), args);

function usage() {
    console.log(`
Usage: yarn gen <type> <name> [...]

Create component folder(s) and files.

  <type>          The type of component being generated: child, common, feature, or page
  <name>          The name of the component in PascalCase

  [--gql]          Include GraphQL props and wrap the component in the graphql HOC
  [--path={path}]  Specify the relative path of the parent feature or page to generate a child component in
  [--pubsub]       Include Pubsub props and wrap the component in the withPubsub HOC
  [--redux]        Include Redux props, create container component and connect to global state
  [--stateless]    Generate a stateless component (functional vs React.Component)
  [--styles]       Include a template styles.sass file for custom component-scoped SASS rules.
  [--http]         Include HTTP Props and wrap the Component in the HTTP HOC

  Example:
    yarn gen feature MyFeature --gql --pubsub --styles

    src/features/my-feature/components/my-feature
      component.test.tsx
      component.tsx
      index.ts
      my-feature.gql
      styles.sass
`);
}
