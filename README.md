# Creating a embeddable chat widget

In this repository you will find the code for an embeddable chat widget which I will create step by step in articles posted on dev.to.

## Getting started

This is a monorepo, you can install all the dependencies for the three packages in this by running inside the project root folder:

```bash
yarn
```

### Starting the different projects

```bash
yarn run server
yarn run portal
yarn run widget
```

### Lint all the files

```bash
yarn lint
```

### Format all the files

```bash
yarn format
```

### Building the projects for production

```bash
yarn run server:build
yarn run portal:build
yarn run widget:build
```

After build there will be a `dist` folder in the root with all the build projects.
