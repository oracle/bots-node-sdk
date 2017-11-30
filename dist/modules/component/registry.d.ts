import { Type } from '../../common/definitions';
import { ComponentMetadataName, IComponentMetadata } from './decorator';
import { IComponentInterface } from './abstract';
export declare type CollectionName = string;
/**
 * Define accepted type for component initialization objects.
 */
export declare type ComponentListItem = string | Type<IComponentInterface>;
export declare class ComponentRegistry {
    protected _parent: ComponentRegistry;
    static readonly COMPONENT_DIR: string;
    private _logger;
    private _valid;
    protected _collectionName: CollectionName;
    protected _collections: Map<string, ComponentRegistry>;
    protected _components: Map<string, IComponentInterface>;
    /**
     * create a registry from a list of components
     * @param components - array of components, which can be paths, objects, or classes.
     * @param cwd - working directory
     */
    static create(components: ComponentListItem[], cwd?: string): ComponentRegistry;
    /**
     * Assemble a component registry from the filesystem.
     * @param parent - parent registry for nested "collections"
     * @param componentDir - relative path to component directory
     * @param cwd - working directory
     */
    static assemble(parent: ComponentRegistry, componentDir?: string, cwd?: string): ComponentRegistry;
    constructor(_parent?: ComponentRegistry);
    /**
     * Legacy conversation shell compatability "components" property accessor
     * @desc allows components to be resolved by `registry.components`
     */
    readonly components: {
        [name: string]: IComponentInterface;
    };
    private __buildFromItems(list, baseDir);
    /**
     * Scan directory for valid components
     * @param baseDir - Top level directory for this registry
     * @param withCollections - group subdirectories as collections
     * @return void
     */
    private __buildFromDir(baseDir, withCollections?);
    /**
     * scan a directory for valid component implementations
     * @param dir - directory to scan for components
     * @param withCollections - group subdirectories as collections
     */
    private __scanDir(dir, withCollections?);
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
