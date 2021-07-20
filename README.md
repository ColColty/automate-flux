# Automate flux

> Extension for specific flux file structure and TypeScript projects !
>
> If you want to handle more things like JavaScript or personalized file structure, you can submit the idea in the issues section or submit a new Pull Request.

This extension aims to generate automatically the files for the flux architecture.

## Usage

Once you create your model and add it to your `index.js` in `Models` folder.

For the moment the required folder architecture is the following :

``` bash
 src
 |- ActionCreators
 |
 |- ActionTypes
 |
 |- Models
 |  |- index.ts             # Where all the models are exported
 |
 |- Sagas
 |  |- RootSagas.ts         # Where all the sagas functions are yield to
 |
 |- Reducers
 |  |- RootReducer.ts       # Where the combine reducer set all the reducers
 |
 |- Services
 |  |- index.ts             # Where the api axios instance is created
 |
 |- Store
    |- configureStore.ts    # Where you declare your 'StoreState' interface
```

## What does it generates ?

This extension, once you run the command `automate-flux.generate-flux`. It will generate a file with all the types, action creators, reducers, sagas and also services.

For example:
If we want to create a flux structure for the model called `Example`, we will have the following files in their related folder.

``` bash
ExampleActionType.ts
ExampleActionCreator.ts
ExampleSagas.ts
ExampleReducer.ts
ExampleService.ts
```

## Issues

If there is any issue during the usage of the extension, you can submit it in the [github repository](https://github.com/ColColty/automate-flux).

If you know how to fix it, you can explain it in the issue comment or contribute into the repository.

## Contribution

You can contribute to this repository. You have to fork this repository, and when you're feature or fix is finished, you can create a new Pull Request. If the Pull Request is accepted, you will be mentionned in the repository.

Please follow the following guide lines for contributing :

- Use ESLint to format the code
- You can refactor, add a feature or fix a feature in the application as long as you don't remove or break any other feature
- Mention in the Pull Request if it concerns a [Refactor], [Feature] or [Fix]

## Contributors

- [ColColty](https://github.com/ColColty)
