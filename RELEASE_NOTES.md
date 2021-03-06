# Release Notes

- [Version 2.5.5](#v255)
- [Version 2.5.4](#v254)
- [Version 2.5.3](#v253)
- [Version 2.5.2](#v252)
- [Version 2.5.1](#v251)
- [Version 2.5.0](#v250)
- [Version 2.4.3](#v243)
- [Version 2.4.2](#v242)

## Version 2.5.5 <a name="v255">

### New Features

- **Support for resource bundles in custom components**: The `context.translate` function that was already available for entity event handlers, can now be used with custom components as well. The function takes a resource bundle key and optionally a list of sustitution variables. Note that use of this function requires digital assistant version 21.06 or higher.
- **Convenience method to get channel type**: A new function `context.getChannelType` has been added for both custom components and entity event handler.
- **Convenience method to add a global action**: A new function `messageModel.addGlobalAction` has been added to the message model. This method adds a single globl action without removing any existing global actions.

## Version 2.5.4 <a name="v254">

### Fixed Issues

- Command `bots-node-sdk pack` fails on typescript project.

## Version 2.5.3 <a name="v253">

### Fixed Issues

- Existing channel extensions are being overridden when using `MessageModel.addChannelExtensions`.
- Improved typescript typings

## Version 2.5.2 <a name="v252">

### Fixed Issues

- Custom components built with bots-node-sdk version 2.5.1 don't work in embedded container

## Version 2.5.1 <a name="v251">

### Fixed Issues

- Creating typescript project using `bots-node-sdk init --language typescript` failed with error 'no such file or directory'.

## Version 2.5.0 <a name="v250">

### New Features

- **Typescript Support in CLI**: When scaffolding a new component service project using the command-line interface, you can now set `--language typescript` as option with the `bots-node-sdk init` command.
- **Docker Support**: We have added docker files to component service project scaffolding for easy deployment to docker.
- **Custom Component Async Invoke**: We have added support for defining custom component `invoke` function as `async` without the `done` callback argument. This is now the recommended way to use the `invoke` function. See [Writing Custom Components](https://github.com/oracle/bots-node-sdk/blob/master/CUSTOM_COMPONENT.md) for more information.

### Fixed Issues

- Improved typescript typings.

## Version 2.4.3 <a name="v243">

### Fixed Issues

- Upgrade to recent versions of node-fetch, typescript, tslint, express, body-parser, @hapi-joi.
- Some typescript typings could not be found due to absolute path references.

## Version 2.4.2 <a name="v242">

### New Features

- **Entity Event Handlers**: See [Writing Entity Event Handlers](https://github.com/oracle/bots-node-sdk/blob/master/ENTIY_EVENT_HANDLER.md) for more information. Note that this feature requires ODA platform version 21.02.

### Fixed Issues

- The headerText property cannot not be set when creating conversation messages using MessageModel class.
- Add support for keywords when creating conversation messages using MessageModel class.
- Allow custom component metadata function to be defined as JSONobject.