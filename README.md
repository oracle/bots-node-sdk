# Oracle Digital Assistant Node.js SDK

This SDK is the main developer resource for [Oracle Digital Asistant](https://docs.oracle.com/en/cloud/paas/digital-assistant/index.html) integrations in a Node.js express environment. It provides two primary solutions for custom implementations against the Digital Assistant platform: 
- Creating [Custom Component Services](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/backend-integration1.html#GUID-3F827E58-BCB2-41F2-B752-82EF9DB602CE)
- Creating [Webhooks](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/webhooks.html#GUID-96CCA06D-0432-4F20-8CDD-E60161F46680)


## SDK Installation

To install the SDK globally:

```text
npm install -g @oracle/bots-node-sdk
```

To install the SDK locally in your current directory:

```text
npm install @oracle/bots-node-sdk
```

When installed locally, use `npx @oracle/bots-node-sdk` instead of just `bots-node-sdk` to run the command-line interface (CLI) commands described in the Getting Started section.

## Getting Started 

This section explains the basic CLI commands to get your component service up and running. See the [CLI documentation](https://github.com/oracle/bots-node-sdk/blob/master/bin/CLI.md) for a complete list of all the arguments and options that you can configure with each command.

### Create a Component Service

Use the `init` command to create a component service package. For example:

```text
bots-node-sdk init PizzaService --name pizza-service 
```

This example creates a component service named `pizza-service` in a directory named `PizzaService`.
The component service includes one sample custom component named `helloWorld`.

### Add a Custom Component to Existing Service

You use the `init component <name> custom` command to add a component to an existing package. For example:

```text
bots-node-sdk init component myCustomComponent custom
```

This example creates a component of type `custom` named `myCustomComponent`. Instead of typing `custom` for the component type argument, you can type `c` as a shortcut.

### Add an Entity Event Handler to Existing Service

You use the `init component <name> entityEventHandler` command to add an event handler to an existing package. For example:

```text
bots-node-sdk init component myEventHandler entityEventHandler
```

This example creates a handler of type `entityEventHandler` that is named `myEventHandler`. Instead of typing `entityEventHandler` for the component type argument, you can type `e` as a shortcut.

### Add an SQL Query Event Handler to Existing Service

You use the `init component <name> sqlQueryEventHandler` command to add an event handler to an existing package. For example:

```text
bots-node-sdk init component myEventHandler sqlQueryEventHandler
```

This example creates a handler of type `sqlQueryEventHandler` that is named `myEventHandler`. Instead of typing `sqlQueryEventHandler` for the component type argument, you can type `s` as a shortcut.

### Add an LLM Transformation Handler to Existing Service

You use the `init component <name> llmTransformation` command to add an event handler to an existing package. For example:

```text
bots-node-sdk init component myEventHandler llmTransformation
```

This example creates a handler of type `LlmTransformation` that is named `myEventHandler`. Instead of typing `llmTransformation` for the component type argument, you can type `t` as a shortcut.

### Add an LLM Validation & Customization Handler to Existing Service

You use the `init component <name> llm` command to add the event handler to an existing package. For example:

```text
bots-node-sdk init component myEventHandler llm
```

This example creates a handler of type `LlmComponent` that is named `myEventHandler`. Instead of typing `llm` for the component type argument, you can type `l` as a shortcut.

### Create a Component Service Package

To package the components, use the `pack` command. For example:

```text
bots-node-sdk pack
```

This creates a component service package .tgz file that can be hosted as an express service, uploaded to a skill's embedded container in Digital Assistant, or uploaded to Oracle Mobile Hub.

### Deploy as an External Component Service

To start a service on a local node server and host the custom component package, use the `start` command.

```text
npm start
```
This example creates a component service running on a local node server. It uses the `@oracle/bots-node-sdk` dev dependency.

Alternatively, you can use this bots-node-sdk command to start the service. This command uses the global bots-node-sdk installation.

```text
bots-node-sdk service
```

To see the metadata for all deployed components, run this cURL command:

```text
curl -X GET localhost:3000/components
```

To deploy to a docker container, you can use the following commands:

```text
npm run-script docker-build
docker-compose up
```

### Using TypeScript

The SDK has full support for TypeScript. If you want to use TypeScript to write your custom components and event handlers, all you need to do is specify the language option when you create the component service. For example:

```text
bots-node-sdk init MyComponentService --language typescript
```

or the shorter format:

```text
bots-node-sdk init MyComponentService  -l t
```
This example creates a TypeScript project in the MyComponentService directory. 

If you subsequently use the `init component` command to add a component to a TypeScript project, it creates a TypeScript component instead of a JavaScript component.

 When run on a TypeScript project, the `service` and `pack` commands transpile all files under the `src` directory into JavaScript files in the `build` directory.

The benefit of using TypeScript over JavaScript is that it is strongly typed, so, if you use an editor like Visual Code Studio, you'll get code completion features and compile-time type checking similar to Java.

See the README.md that's created in your scaffolded TypeScript project for more information.   

## More Information

<!--[nodoc]-->
- [Using the CLI](https://github.com/oracle/bots-node-sdk/blob/master/bin/CLI.md) - Command line capabilities to facilitate writing custom components and entity event handlers.
- [Writing Custom Components](https://github.com/oracle/bots-node-sdk/blob/master/CUSTOM_COMPONENT.md) - Guidelines and tips for writing custom components.
- [Writing Entity Event Handlers](https://github.com/oracle/bots-node-sdk/blob/master/ENTITY_EVENT_HANDLER.md) - Guidelines and tips for writing entity event handlers.
- [Writing SQL Query Event Handlers](https://github.com/oracle/bots-node-sdk/blob/master/DATA_QUERY_EVENT_HANDLER.md) - Guidelines and tips for writing data query event handlers.
- [Writing LLM Transformation Handlers](https://github.com/oracle/bots-node-sdk/blob/master/LLM_TRANSFORMATION_HANDLER.md) - Guidelines and tips for writing LLM transformation handlers.
- [Writing LLM Validation & Customization Handlers](https://github.com/oracle/bots-node-sdk/blob/master/LLM_COMPONENT_HANDLER.md) - Guidelines and tips for writing LLM validation & customization handlers.
- [Conversation Messaging](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_FACTORY.md) - Creating conversation messages from custom code.
- [Writing Webhooks](https://github.com/oracle/bots-node-sdk/blob/master/WEBHOOK.md) - Integrate with custom messaging channels using incoming/outgoing webhook.
- [Unit Testing](https://github.com/oracle/bots-node-sdk/blob/master/testing/TESTING.md) - Unit testing facilities.
- [Documentation](https://oracle.github.io/bots-node-sdk) - Full SDK documentation.
- [Release Notes](https://github.com/oracle/bots-node-sdk/blob/master/RELEASE_NOTES.md) - List of new features and fixed issues for each release.
<!--[/nodoc]-->

## Contributing

<!--[nodoc]-->
`@oracle/bots-node-sdk` is an open source project. See
[CONTRIBUTING](https://github.com/oracle/bots-node-sdk/blob/master/CONTRIBUTING.md) for details.
<!--[/nodoc]-->

## License

Copyright © 2018-2023, Oracle and/or its affiliates. All rights reserved.

The Universal Permissive License (UPL), Version 1.0

<!--[nodoc]-->
[![npm version](https://badge.fury.io/js/%40oracle%2Fbots-node-sdk.svg)](https://badge.fury.io/js/%40oracle%2Fbots-node-sdk)
[![wercker status](https://app.wercker.com/status/39bb567cbcdc92b7dcbb3a78f144102d/s/master "wercker status")](https://app.wercker.com/project/byKey/39bb567cbcdc92b7dcbb3a78f144102d)
<!--[/nodoc]-->