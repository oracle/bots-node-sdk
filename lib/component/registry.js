'use strict';

const path = require("path");
const fs = require("fs");
const { CONSTANTS } = require("../../common/constants");
const { CommonProvider } = require("../../common/provider");
const { isType } = require("../../common/definitions");

/**
 * Class for estabilishing a collection of components to be used within middleware.
 * Automatically applied by component middleware configurations
 * @memberof module:Lib
 * @see {@link module:Middleware} for more information
 * @private
 */
class ComponentRegistry {
  /**
   * ComponentRegistry constructor.
   * @param _parent - parent registry for child collection.
   */
  constructor(_parent) {
    this._parent = _parent;
    this._collections = new Map();
    this._components = new Map();
    this._json = {};
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
  }
  /**
   * Create a registry from a list of component references. The resulting registry
   * is flat and does NOT group components into collections.
   * @param components - array of components, which can be paths, objects, or classes.
   * @param cwd - working directory
   */
  static create(components, cwd = process.cwd()) {
    return new ComponentRegistry(null)
      .__buildFromItems(components, cwd);
  }
  /**
   * Assemble a component registry from the filesystem.
   * Directories within the main component directory will be consumed as independent
   * child component collections.
   * @param parent - parent registry for nested "collections"
   * @param componentDir - relative path to component directory
   * @param cwd - working directory
   */
  static assemble(parent, componentDir = CONSTANTS.DEFAULT_COMPONENT_DIR, cwd = process.cwd()) {
    // verify absolute component dir
    componentDir = fullPath(cwd, componentDir);
    // instantiate and scan the fs
    return new ComponentRegistry(parent)
      .__buildFromFs(componentDir, !parent);
  }
  /**
   * Build a registry with high degree of flexibility in list items.
   * @param list - Array of component references; can be paths, objects, or classes.
   * @param baseDir - Base path reference for resolving string component paths.
   * @private
   */
  __buildFromItems(list, baseDir) {
    const results = [].concat(list).map(item => {
      if (isComponent(item)) {
        return [this.__componentFactory(item)];
      } else if (typeof item === 'object') {
        // resolve from object containing {[key: string]: component}
        return Object.keys(item)
          .map(k => item[k])
          .filter(isComponent)
          .map(ref => this.__componentFactory(ref));
      } else if (typeof item === 'string') {
        // resolve from path, considering each path may contain >=1 components
        return this.__digestPath(fullPath(baseDir, item), false);
      }
    }).filter(item => item && item.length); // filter empties
    // flatten and register
    [].concat(...results)
      .forEach(component => this.__register(component));
    return this;
  }
  /**
   * Scan directory for valid components
   * @param baseDir - Top level directory for this registry
   * @param withCollections - group subdirectories as collections
   * @return void
   * @private
   */
  __buildFromFs(baseDir, withCollections) {
    const dir = path.resolve(typeof baseDir === 'string' ? baseDir : '');
    if (fs.existsSync(dir)) {
      this.__scanDir(dir, withCollections)
        .forEach(component => this.__register(component));
    } else {
      this._logger.error(`Invalid component directory ${baseDir}`);
    }
    return this;
  }
  /**
   * scan a directory for valid component implementations
   * @param dir - directory to scan for components
   * @param withCollections - group subdirectories as collections
   * @private
   */
  __scanDir(dir, withCollections) {
    const results = fs.readdirSync(dir) // scan directory for components
      .filter(name => !/^\./.test(name) && ~['', '.js'].indexOf(path.extname(name))) // js and folders
      .map(name => path.join(dir, name)) // absolute path
      .sort(a => {
        return fs.statSync(a).isDirectory() ? 1 : 0;
      })
      .map(file => this.__digestPath(file, withCollections));
    // because __digest returns an array, we need to flatten the final result.
    return [].concat(...results);
  }
  /**
   * resolve (file|dir)path into component instantiations.
   * @param filePath - absolute path to a component resource or directory
   * @param withCollections - consider directories as separate registry collections.
   * @private
   */
  __digestPath(filePath, withCollections) {
    // consider case where manual registry is used and contain files references without extensions
    filePath = fs.existsSync(filePath) ? filePath : `${filePath}.js`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && withCollections) {
      // create new registry from the child directory
      this._addCollection(filePath);
    } else if (stat.isDirectory()) {
      // scan the directory and flatten
      return this.__scanDir(filePath, false);
    } else if (stat.isFile()) {
      // resolve as classes from the files
      return this.__resolveComponents(filePath)
        .map(c => this.__componentFactory(c));
    }
    return [];
  }
  /**
   * create a child collection of components from a subdirectory
   * @param subdir - component subdirectory absolute path
   * @private
   */
  _addCollection(subdir) {
    this._collections.set(path.basename(subdir), ComponentRegistry.assemble(this, subdir));
  }
  /**
   * resolve Component classes from
   * @param filePath - source file absolute path
   * @private
   */
  __resolveComponents(filePath) {
    try {
      const mod = require(filePath);
      if (isComponent(mod)) {
        // handle direct export case `export = SomeComponentClass`
        return [mod];
      } else {
        // handle case where a single file exports object(s) as keys.
        return Object.keys(mod)
          .map(key => mod[key])
          .filter(isComponent);
      }
    } catch (e) {
      this._logger.error(e);
      throw new Error(`Invalid component path: ${filePath}`);
    }
  }
  /**
   * component instantiation factory.
   * @param mod - component reference (class|object)
   * @private
   */
  __componentFactory(mod) {
    const ctor = makeCtor(mod);
    return new ctor();
  }
  /**
   * register an instantiated component in
   * @param component - instantiated bot component class
   * @private
   */
  __register(component) {
    const meta = (typeof component.metadata === 'function') ? component.metadata() : component.metadata;
    if (this.isComponent(meta.name)) {
      return this._logger.warn(`Duplicate component found: ${meta.name} while attempting to register ${component['constructor'].name}`);
    } else {
      this._components.set(meta.name, component);
      this._json[meta.name] = component;
    }
  }
  /**
   * merge components from another registry
   * @param registry - Source registry for merge operation.
   * @param recursive - Recursively merge into child collections.
   */
  merge(registry, recursive) {
    if (registry && registry instanceof ComponentRegistry && registry.isValid()) {
      registry.getComponents().forEach(component => {
        this.__register(component);
        if (recursive) {
          this._collections.forEach(collection => collection.__register(component));
        }
      });
    }
    return this;
  }
  /**
   * Legacy conversation shell compatability "components" property getter
   * @desc allows components to be resolved by `registry.components`
   */
  get components() {
    return Object.assign({}, this._json);
  }
  /**
   * test if registry is valid.
   * @return boolean.
   */
  isValid() {
    return (this._components.size || this._collections.size) > 0;
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
   * @param collection - (optional) the name of the collection;
   * @return child registry | this.
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
   * @param collection - the collection name, defaults to the parent collection (optional)
   * @return - array of component metadata
   */
  getMetadata(collection) {
    const registry = this.getRegistry(collection);
    let meta = [];
    if (registry) {
      registry.getComponents().forEach(component => {
        // push a copy of the metadata
        meta.push(Object.assign({}, (typeof component.metadata === 'function') ? component.metadata() : component.metadata));
      });
    } else {
      this._logger.error(`Invalid registry requested ${collection}`);
    }
    return meta;
  }

  /**
   * get members of a component object
   * @param component - instantiated bot component class
   */
  getComponentMethods(component) {
    const omit = ['constructor'];
    const properties = [].concat(...[component, Object.getPrototypeOf(component)]
      .filter(o => o && o !== Object.prototype) // remove properties of Object.prototype
      .map(o => Object.getOwnPropertyNames(o))); // own properties

    return properties.filter(k => isType(component[k]) && omit.indexOf(k) === -1);
  }
}

/**
 * get full path in fs.
 * @param cwd - absolute path
 * @param dirname - a directory or file string
 * @private
 */
function fullPath(cwd, dirname) {
  return ~dirname.indexOf(cwd) ? dirname : path.join(cwd, dirname);
}
/**
 * wrap a raw Object in a constructor function.
 * @desc converts module.exports = {} to a prototyped object
 * @param type - component reference object
 * @private
 */
function makeCtor(type) {
  return (isType(type) && type) || (function LegacyComponentWrapper() {
    return type;
  });
}
/**
 * test for class decorated with @Component
 * @param ref class or object from exports.
 * @todo create a decorator factory to test annotations against instanceof
 * @private
 */
function isComponent(ref) {
  return (isType(ref) && ref.prototype && (isType(ref.prototype.invoke) || isType(ref.prototype.handlers) || (typeof ref.prototype.handlers === 'object'))) ||
    (typeof ref === 'object' && (isType(ref.metadata) || typeof ref.metadata === 'object') && (isType(ref.invoke) || isType(ref.handlers) || (typeof ref.handlers === 'object')));
}

module.exports = {
  ComponentRegistry,
}