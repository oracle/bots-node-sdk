import { Type } from '../../common/definitions';
import { ComponentMetadataName, IComponentMetadata } from './decorator';
import { IComponentInterface } from './abstract';
export declare type CollectionName = string;
/**
 * Define accepted type for component initialization objects.
 */
export declare type ComponentListItem = string | Type<IComponentInterface> | {
    [key: string]: Type<IComponentInterface>;
};
export declare class ComponentRegistry {
    protected _parent: ComponentRegistry;
    static readonly COMPONENT_DIR: string;
    private _logger;
    protected _collectionName: CollectionName;
    protected _collections: Map<string, ComponentRegistry>;
    protected _components: Map<string, IComponentInterface>;
    /**
     * Create a registry from a list of component references. The resulting registry
     * is flat and does NOT group components into collections.
     * @param components - array of components, which can be paths, objects, or classes.
     * @param cwd - working directory
     */
    static create(components: ComponentListItem[], cwd?: string): ComponentRegistry;
    /**
     * Assemble a component registry from the filesystem.
     * Directories within the main component directory will be consumed as independent
     * child component collections.
     * @param parent - parent registry for nested "collections"
     * @param componentDir - relative path to component directory
     * @param cwd - working directory
     */
    static assemble(parent: ComponentRegistry, componentDir?: string, cwd?: string): ComponentRegistry;
    /**
     * ComponentRegistry constructor.
     * @param _parent - parent registry for child collection.
     */
    constructor(_parent?: ComponentRegistry);
    /**
     * Build a registry with high degree of flexibility in list items.
     * @param list - Array of component references; can be paths, objects, or classes.
     * @param baseDir - Base path reference for resolving string component paths.
     */
    private __buildFromItems(list, baseDir);
    /**
     * Scan directory for valid components
     * @param baseDir - Top level directory for this registry
     * @param withCollections - group subdirectories as collections
     * @return void
     */
    private __buildFromFs(baseDir, withCollections?);
    /**
     * scan a directory for valid component implementations
     * @param dir - directory to scan for components
     * @param withCollections - group subdirectories as collections
     */
    private __scanDir(dir, withCollections?);
    /**
     * resolve (file|dir)path into component instantiations.
     * @param filePath - absolute path to a component resource or directory
     * @param withCollections - consider directories as separate registry collections.
     */
    private __digestPath(filePath, withCollections?);
    /**
     * create a child collection of components from a subdirectory
     * @param subdir - component subdirectory absolute path
     */
    protected _addCollection(subdir: string): void;
    /**
     * resolve Component classes from
     * @param filePath - source file absolute path
     */
    private __resolveComponents(filePath);
    /**
     * component instantiation factory.
     * @param mod - component reference (class|object)
     */
    private __componentFactory(mod);
    /**
     * register an instantiated component in
     * @param component - instantiated bot component class
     */
    private __register(component);
    /**
     * merge components from another registry
     * @param registry - Source registry for merge operation.
     * @param recursive - Recursively merge into child collections.
     */
    merge(registry: ComponentRegistry, recursive?: boolean): this;
    /**
     * Legacy conversation shell compatability "components" property accessor
     * @desc allows components to be resolved by `registry.components`
     */
    readonly components: {
        [name: string]: IComponentInterface;
    };
    /**
     * test if registry is valid.
     * @return boolean.
     */
    isValid(): boolean;
    /**
     * list collections in this registry
     */
    getCollectionNames(): CollectionName[];
    /**
     * get a registry for a specific collection of components.
     * @param collection - (optional) the name of the collection;
     * @return child registry | this.
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
     * @param collection - the collection name, defaults to the parent collection (optional)
     * @return - array of component metadata
     */
    getMetadata(collection?: CollectionName): IComponentMetadata[];
}
