import * as log4js from 'log4js';
import { ComponentMetadataName, IComponentMetadata } from './decorator';
import { IComponentInterface } from './abstract';
export declare type CollectionName = string;
export declare class ComponentRegistry {
    protected _parent: ComponentRegistry;
    protected _baseDir: string;
    static readonly COMPONENT_DIR: string;
    protected _logger: log4js.Logger;
    protected _collectionName: CollectionName;
    protected _collections: Map<string, ComponentRegistry>;
    protected _components: Map<string, IComponentInterface>;
    private __valid;
    static assemble(parent: ComponentRegistry, componentDir?: string, cwd?: string): ComponentRegistry;
    constructor(_parent: ComponentRegistry, _baseDir: string);
    /**
     * Conversation shell compatability.
     * @desc allows components to be resolved by registry.components
     */
    readonly components: {};
    /**
     * traverse directory for valid components
     * @param baseDir: string - Top level directory for this registry
     * @return void.
     */
    private __collect(baseDir);
    /**
     * create a collection of components from a subdirectory
     * @param subdir: string - component subdirectory (absolute).
     */
    protected _addCollection(subdir: string): void;
    /**
     * resolve Component classes from
     * @param file: string - source file (absolute)
     */
    protected _resolveComponents(file: string): any[];
    /**
     * component instantiation factory.
     * @param ctor: ComponentInterface.prototype.constructor - component constructor
     * @todo handle dependency injections
     */
    private __componentFactory(mod);
    /**
     * register an instantiated component in
     * @param component: ComponentInterface - instantiated bot component class
     */
    private __register(component);
    /**
     * check if registry is valid.
     * @return boolean.
     */
    isValid(): boolean;
    /**
     * list collections in this registry
     */
    getCollectionNames(): CollectionName[];
    /**
     * get a registry for a specific collection of components.
     * @param collection: RegistryCollectionName - (optional) the name of the collection;
     * @return ComponentRegistry | this.
     */
    getRegistry(collection?: CollectionName): ComponentRegistry | this;
    /**
     * get component map for this registry
     */
    getComponents(): Map<ComponentMetadataName, IComponentInterface>;
    /**
     * get component from map by name
     * @param name - component name
     */
    getComponent(name: ComponentMetadataName): IComponentInterface;
    /**
     * test existence of collection
     * @param name - collection name
     */
    isCollection(name: CollectionName): boolean;
    /**
     * test existence of component
     * @param name - component name
     */
    isComponent(name: ComponentMetadataName): boolean;
    /**
     * return component metadata as json array
     * @param collection: RegistryCollectionName - (optional) the collection name
     * @return ComponentMeta[] - array of component metadata
     */
    getMetadata(collection?: CollectionName): IComponentMetadata[];
}
