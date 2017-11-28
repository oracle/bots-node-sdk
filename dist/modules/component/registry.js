"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const log4js = require("log4js");
const constants_1 = require("../../common/constants");
const definitions_1 = require("../../common/definitions");
class ComponentRegistry {
    constructor(_parent, _baseDir) {
        this._parent = _parent;
        this._baseDir = _baseDir;
        this._collections = new Map();
        this._components = new Map();
        // setup additional iVars.
        this._logger = log4js.getLogger(this.constructor.name);
        this.__collect(_baseDir);
    }
    static assemble(parent, componentDir = this.COMPONENT_DIR, cwd = process.cwd()) {
        if (!~componentDir.indexOf(cwd)) {
            componentDir = path.join(cwd, componentDir);
        }
        return new this(parent, componentDir);
    }
    /**
     * Conversation shell compatability.
     * @desc allows components to be resolved by registry.components
     */
    get components() {
        const c = {};
        this.getComponents().forEach((component, name) => {
            c[name] = component;
        });
        return c;
    }
    /**
     * traverse directory for valid components
     * @param baseDir: string - Top level directory for this registry
     * @return void.
     */
    __collect(baseDir) {
        const dir = path.resolve(baseDir);
        if (fs.existsSync(dir)) {
            this.__valid = true;
            fs.readdirSync(dir)
                .filter(name => ~['', '.js'].indexOf(path.extname(name))) // js and folders
                .map(name => path.join(dir, name)) // absolute path
                .forEach(file => {
                const stat = fs.statSync(file);
                if (stat.isDirectory() && !this._parent) {
                    // create new registry from the child directory
                    this._addCollection(file);
                }
                else if (stat.isFile()) {
                    // resolve classes from the files
                    this._resolveComponents(file)
                        .map(c => this.__componentFactory(c))
                        .forEach(instance => this.__register(instance));
                }
            });
        }
        else {
            this._logger.error(`Invalid component registry ${baseDir}`);
            this.__valid = false;
        }
    }
    /**
     * create a collection of components from a subdirectory
     * @param subdir: string - component subdirectory (absolute).
     */
    _addCollection(subdir) {
        this._collections.set(path.basename(subdir), ComponentRegistry.assemble(this, subdir, this._baseDir));
        // this._logger.info(`Registered component collection: '${path.basename(subdir)}'`);
    }
    /**
     * resolve BotComponent classes from
     * @param file: string - source file (absolute)
     */
    _resolveComponents(file) {
        try {
            const mod = require(file);
            if (isBotComponent(mod)) {
                // handle direct export case `export = SomeComponentClass`
                return [mod];
            }
            else {
                // handle case where a single file exports decorated class(es).
                return Object.keys(mod)
                    .map(key => mod[key])
                    .filter(obj => isBotComponent(obj));
            }
        }
        catch (e) {
            this._logger.error(e);
            return [];
        }
    }
    /**
     * component instantiation factory.
     * @param ctor: ComponentInterface.prototype.constructor - component constructor
     * @todo handle dependency injections
     */
    __componentFactory(mod) {
        const ctor = makeCtor(mod);
        return new ctor();
    }
    /**
     * register an instantiated component in
     * @param component: ComponentInterface - instantiated bot component class
     */
    __register(component) {
        const meta = component.metadata();
        if (this.isComponent(meta.name)) {
            return this._logger.warn(`Duplicate component found: ${meta.name} while attempting to register ${component['constructor'].name}`);
        }
        else {
            this._components.set(meta.name, component);
        }
    }
    /**
     * check if registry is valid.
     * @return boolean.
     */
    isValid() {
        return this.__valid;
    }
    /**
     * list collections in this registry
     */
    getCollectionNames() {
        let keys = [];
        this._collections.forEach((coll, name) => {
            keys.push(name);
        });
        return keys;
    }
    /**
     * get a registry for a specific collection of components.
     * @param collection: RegistryCollectionName - (optional) the name of the collection;
     * @return ComponentRegistry | this.
     */
    getRegistry(collection) {
        return collection ? this._collections.get(collection) : this;
    }
    /**
     * get component map for this registry
     */
    getComponents() {
        return this._components;
    }
    /**
     * get component from map by name
     * @param name - component name
     */
    getComponent(name) {
        return this._components.get(name);
    }
    /**
     * test existence of collection
     * @param name - collection name
     */
    isCollection(name) {
        return this._collections.has(name);
    }
    /**
     * test existence of component
     * @param name - component name
     */
    isComponent(name) {
        return this._components.has(name);
    }
    /**
     * return component metadata as json array
     * @param collection: RegistryCollectionName - (optional) the collection name
     * @return BotComponentMeta[] - array of component metadata
     */
    getMetadata(collection) {
        const registry = this.getRegistry(collection);
        let meta = [];
        if (!!registry) {
            registry.getComponents().forEach((component, name) => {
                // push a copy of the metadata
                meta.push(Object.assign({}, component.metadata()));
            });
        }
        else {
            this._logger.error(`Invalid registry requested ${collection}`);
        }
        return meta;
    }
}
ComponentRegistry.COMPONENT_DIR = constants_1.CONSTANTS.DEFAULT_COMPONENT_DIR;
exports.ComponentRegistry = ComponentRegistry;
/**
 * wrap a raw Object in a function.
 * @desc converts module.exports = {} to a prototyped object
 * @param value: any.
 */
function makeCtor(value) {
    return (value.prototype && value) || (function LegacyComponentWrapper() {
        return value;
    });
}
/**
 * test for class decorated with @BotComponent
 * @param ref class or object from exports.
 * @todo create a decorator factory to test annotations against instanceof
 */
function isBotComponent(ref) {
    return (typeof ref === 'function' && definitions_1.isType(ref.prototype.metadata) && definitions_1.isType(ref.prototype.invoke)) || // class usage
        (typeof ref === 'object' && definitions_1.isType(ref.metadata) && definitions_1.isType(ref.invoke)); // legacy
}
//# sourceMappingURL=registry.js.map