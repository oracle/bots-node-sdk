# Oracle Digital Assistant Node.js SDK

This SDK is the main developer resource for [Oracle Digital Asistant](https://docs.oracle.com/en/cloud/paas/digital-assistant/index.html) (ODA) integrations in a Node.js express environment. It provides two primary solutions for custom implementations against the ODA platform: 
- Creating [Custom Component Services](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/components1.html#GUID-D4DB30EC-D089-4809-A845-31FAAE1794AA)
- Creating [Webhooks](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/webhooks.html#GUID-96CCA06D-0432-4F20-8CDD-E60161F46680).


## Installation

To install globally

```text
npm install -g @oracle/bots-node-sdk
```

To install locally in your current directory:

```text
npm install @oracle/bots-node-sdk
```

When installed locally use `npx @oracle/bots-node-sdk` instead of just `bots-node-sdk` to run the command-line interface (CLI) commands described below in getting started section.

## Getting Started 

This section explains the basic CLI commands to get your component service up and running. See the [CLI documentation](https://github.com/oracle/bots-node-sdk/blob/master/bin/CLI.md) for a complete list of all the arguments and options you can configure with each command.

### Creating a New Component Service

```text
bots-node-sdk init MyComponentService
```

This creates a new commponent service named `MyComponentService` in a directory by the same name.
The component service includes one sample custom component named `helloWorld`.

### Adding a Custom Component to Existing Service

```text
bots-node-sdk init component myCustomComponent custom
```

This creates a new custom component named `myCustomComponent`. Instead of typing `custom` for the component type argument, you can type `c` as a shortcut.

### Adding an Entity Event Handler to Existing Service

```text
bots-node-sdk init component myEventHandler entityEventHandler
```

This creates a new entity event handler named `myEventHandler`. Instead of typing `entityEventHandler` for the component type argument, you can type `e` as a shortcut.

### Creating a Component Service Package

```text
npm pack
```
This creates a component service package .tgz file that can be uploaded to the ODA embedded container.

### Deploying as External Component Service

```text
npm start
```
This creates a component service running on a local node server. 
The following command returns the metadata of all deployed components:

```text
curl -X GET localhost:3000/components
```

To deploy to a docker container, you can use the following commands:

```text
npm run-script docker-build
docker-compose up
```

### Using Typescript

The SDK has full support for typescript. If you want to use typescript to write your custom components and event handlers, all you need to do is specify the language option when creating the component service:

```text
bots-node-sdk init --language typescript MyComponentService
```

or the shorter format:

```text
bots-node-sdk init -l t MyComponentService
```

This will set up your project for typescript, if you subsequently use the `init component` command to add a component to the service, it will create a typescript component instead of a javascript component.

When you run any of the other CLI commands described above after setting up your project with typescript, the typescript files will be automatically transpiled to javascript.

The benefit of using typescript over javascript is that it is strongly typed, so if you use an editor like Visual Code Studio, you will get code completion features and compile-time type checking, similar to Java.

See the README.md created in your scaffolded typescript project for more information.   

## More Information

<!--[nodoc]-->
- [Using the CLI](https://github.com/oracle/bots-node-sdk/blob/master/bin/CLI.md) - Command line capabilities to facilitate writing custom components and entity event handlers.
- [Writing Custom Components](https://github.com/oracle/bots-node-sdk/blob/master/CUSTOM_COMPONENT.md) - Guidelines and tips for writing custom components.
- [Writing Entity Event Handlers](https://github.com/oracle/bots-node-sdk/blob/master/ENTIY_EVENT_HANDLER.md) - Guidelines and tips for writing entity event handlers.
- [Conversation Messaging](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md) - Creating conversation messages from custom code
- [Writing Webhooks]((https://github.com/oracle/bots-node-sdk/blob/master/WEBHOOK.md) - Integrate with custom messaging channels using incoming/outgoing webhook.
- [Unit Testing](https://github.com/oracle/bots-node-sdk/blob/master/testing/TESTING.md) - Unit testing facilities.
- [Documentation](https://oracle.github.io/bots-node-sdk) - Full SDK documentation.
- [Release Notes](https://github.com/oracle/bots-node-sdk/blob/master/RELEASE_NOTES.md) - List of new features and fixed issues for each release
<!--[/nodoc]-->

## Contributing

<!--[nodoc]-->
`@oracle/bots-node-sdk` is an open source project. See
[CONTRIBUTING](https://github.com/oracle/bots-node-sdk/blob/master/CONTRIBUTING.md) for details.
<!--[/nodoc]-->

## License

Copyright © 2018-2021, Oracle and/or its affiliates. All rights reserved.

The Universal Permissive License (UPL), Version 1.0

<!--[nodoc]-->
[![npm version](https://badge.fury.io/js/%40oracle%2Fbots-node-sdk.svg)](https://badge.fury.io/js/%40oracle%2Fbots-node-sdk)
[![wercker status](https://app.wercker.com/status/39bb567cbcdc92b7dcbb3a78f144102d/s/master "wercker status")](https://app.wercker.com/project/byKey/39bb567cbcdc92b7dcbb3a78f144102d)
<!--[/nodoc]-->