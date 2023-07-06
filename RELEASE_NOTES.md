# Release Notes

- [Version 2.6.8](#v268)
- [Version 2.6.7](#v267)
- [Version 2.6.6](#v266)
- [Version 2.6.5](#v265)
- [Version 2.6.4](#v264)
- [Version 2.6.3](#v263)
- [Version 2.6.2](#v262)
- [Version 2.6.1](#v261)
- [Version 2.6.0](#v260)
- [Version 2.5.5](#v255)
- [Version 2.5.4](#v254)
- [Version 2.5.3](#v253)
- [Version 2.5.2](#v252)
- [Version 2.5.1](#v251)
- [Version 2.5.0](#v250)
- [Version 2.4.3](#v243)
- [Version 2.4.2](#v242)

## Version 2.6.8 <a name="v268">

### Fixed Issues

- Documentation fixes
- Fixed issue in baseContext.translate method for TypeScript.

## Version 2.6.7 <a name="v267">

### New Features

- **New Message Types and Properties**: This release includes support for the new `EditForm` message type, which allows you to render editable forms with text, number, date, time, single-select, multi-select and toggle fields. This new message type, as well as new properties for existing messages are supported through the new `MessageFactory` class which supersedes the now deprecated `MessageModel` class. See [Conversation Messaging](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_FACTORY.md) for more information.

## Version 2.6.6 <a name="v266">

### Fixed Issues

- Documentation fixes

## Version 2.6.5 <a name="v265">

### New Features

- **New UserInputReceived Entity Event Handler Method**: See [Writing Entity Event Handlers](https://github.com/oracle/bots-node-sdk/blob/master/ENTIY_EVENT_HANDLER.md) for more information.

### Fixed Issues

- Fixed TypeScript definition of EntityValidateEvent
- Added TypeScript definition for DisambiguateItemEvemt

## Version 2.6.4 <a name="v264">

### New Features

- **SQL Query Event Handlers**: SQL query event handlers can be used to customize the SQL Dialogs query results. See [Writing SQL Query Event Handlers](https://github.com/oracle/bots-node-sdk/blob/master/DATA_QUERY_EVENT_HANDLER.md) for more information. This feature requires Oracle Digital Assistant version 22.12 or later.

### Fixed Issues

- Item disambiguation values are not cleared when setting item value using context.setItemValue
- Bots Node SDK Hello World sample requires keepTurn(true) to be set to navigate to next state
- Cannot add action to form with bots-node-sdk
- Custom component dependencies not bundled. This has been fixed by changing the `bundledDependencies` property in `package.json` to `bundleDependencies` as this is the property name used when installing a package using `npm install`. If you are using this new SDK version with an existing component service, make sure to update your `package.json` accordingly.
- Preventing packaging of previous custom component package during pack
- Allow accessing nlpResult from EEH context
- Calling context.getEntityItems() from an EEH on a skill scoped variable in visual dialog fails because of lookup in flow scope only

## Version 2.6.3 <a name="v263">

### Fixed Issues

- Fix for display value of multi-value recurring property 

## Version 2.6.2 <a name="v262">

### Fixed Issues

- The EntityResolutionContext method `clearItemValue()` failed if composite bag entity is empty
- Building a component package using the option `--language typescript` failed.

## Version 2.6.1 <a name="v261">

### New Features

- **Improved custom component scaffolding**: Custom components created with the CLI now use the `async` syntax rather than the deprecated `done` callback.

### Fixed Issues

- EntityEvent interface was defined twice

## Version 2.6.0 <a name="v260">

### New Features

- **Support for visual flows**: Starting with ODA platform version 22.04, skills can be defined using multiple visual flows, rather than a single monolitic flow defined in YAML. 
- **New 'init' entity event handler**: A new 'init' event is available in entity event handler which fires when entity resolution starts.
- **New attribute 'supportedActions' in entity event handler metadata**: The `supportedActions` property contains a string array of transition actions that might be set by the event handler. By setting this property, the skill validator will not raise a warning if a transition action created in an event handler is set by by the resolving state in the flow.
- **New entity resolution context method to set transition action**: When using the new `setTransitionAction` function, the entity resolution process is aborted, and the dialog engine will transition to the state defined for this transition action.
- **New functions to create table, form and tableForm message payloads**: The ODA conversation message model has been extended with 3 new message types to render data in a table, form, or tableForm layout. These new functions allow you to create these message types using the SDK. See [Conversation Messaging](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_FACTORY.md) for more information.

### Fixed Issues

- The `context.translate` function did not work correctly with ICU message formats that expect a numeric argument.
- Code completion didn't work out of the box for Typescript-based component services.

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