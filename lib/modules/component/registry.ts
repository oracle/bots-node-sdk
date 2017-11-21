import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as log4js from 'log4js';

import { CONSTANTS } from '../../common/constants';
import { Type, isType } from '../../common/definitions';
import { BotComponent, BotComponentMetaName, BotComponentMeta } from './decorator';
import { ComponentInterface } from './abstract';

export type CollectionName = string;

export class ComponentRegistry {
  public static readonly COMPONENT_DIR = CONSTANTS.DEFAULT_COMPONENT_DIR;
  protected _logger: log4js.Logger;
  protected _collectionName: CollectionName;
  protected _collections = new Map<CollectionName, ComponentRegistry>();
  protected _components = new Map<BotComponentMetaName, ComponentInterface>();
  private __valid: boolean;

  public static assemble(
    parent: ComponentRegistry,
    componentDir = this.COMPONENT_DIR,
    cwd: string = process.cwd()): ComponentRegistry {
    if (!~componentDir.indexOf(cwd)) {
      componentDir = path.join(cwd, componentDir);
    }
    return new this(parent, componentDir);
  }

  constructor(protected _parent: ComponentRegistry, protected _baseDir: string) {
    // setup additional iVars.
    this._logger = log4js.getLogger(this.constructor.name);
    this.__collect(_baseDir);
  }

  /**
   * Conversation shell compatability.
   * @desc allows components to be resolved by registry.components
   */
  public get components() {
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
  private __collect(baseDir: string): void {
    const dir = path.resolve(baseDir);
    if (fs.existsSync(dir)) {
      this.__valid = true;
      fs.readdirSync(dir)
        .filter(name => ~['', '.js'].indexOf(path.extname(name))) // js and folders
        .map(name => path.join(dir, name)) // absolute path
        .forEach(file => {
          const stat = fs.statSync(file);
          if (stat.isDirectory() && !this._parent) { // single level recursion
            // create new registry from the child directory
            this._addCollection(file);
          } else if (stat.isFile()) {
            // resolve classes from the files
            this._resolveComponents(file)
              .map(c => this.__componentFactory(c))
              .forEach(instance => this.__register(instance));
          }
        });
    } else {
      this._logger.error(`Invalid component registry ${baseDir}`);
      this.__valid = false;
    }
  }

  /**
   * create a collection of components from a subdirectory
   * @param subdir: string - component subdirectory (absolute).
   */
  protected _addCollection(subdir: string): void {
    this._collections.set(path.basename(subdir), ComponentRegistry.assemble(this, subdir, this._baseDir));
    // this._logger.info(`Registered component collection: '${path.basename(subdir)}'`);
  }

  /**
   * resolve BotComponent classes from
   * @param file: string - source file (absolute)
   */
  protected _resolveComponents(file: string): any[] {
    try {
      const mod = require(file);
      if (isBotComponent(mod)) {
        // handle direct export case `export = SomeComponentClass`
        return [mod];
      } else {
        // handle case where a single file exports decorated class(es).
        return Object.keys(mod)
            .map(key => mod[key])
            .filter(obj => isBotComponent(obj));
      }
    } catch (e) {
      this._logger.error(e);
      return [];
    }
  }

  /**
   * component instantiation factory.
   * @param ctor: ComponentInterface.prototype.constructor - component constructor
   * @todo handle dependency injections
   */
  private __componentFactory(mod: Type<ComponentInterface>): ComponentInterface {
    const ctor = makeCtor(mod);
    return new ctor();
  }

  /**
   * register an instantiated component in
   * @param component: ComponentInterface - instantiated bot component class
   */
  private __register(component: ComponentInterface): void {
    const meta = component.metadata();
    if (this.isComponent(meta.name)) {
      return this._logger.warn(`Duplicate component found: ${meta.name} while attempting to register ${component['constructor'].name}`);
    } else {
      this._components.set(meta.name, component);
    }
  }

  /**
   * check if registry is valid.
   * @return boolean.
   */
  public isValid(): boolean {
    return this.__valid;
  }

  /**
   * list collections in this registry
   */
  public getCollectionNames(): CollectionName[] {
    let keys = []
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
  public getRegistry(collection?: CollectionName): ComponentRegistry | this {
    return collection ? this._collections.get(collection) : this;
  }

  /**
   * get component map for this registry
   */
  public getComponents(): Map<BotComponentMetaName, ComponentInterface> {
    return this._components;
  }

  /**
   * get component from map by name
   * @param name - component name
   */
  public getComponent(name: BotComponentMetaName): ComponentInterface {
    return this._components.get(name);
  }

  /**
   * test existence of collection
   * @param name - collection name
   */
  public isCollection(name: CollectionName): boolean {
    return this._collections.has(name);
  }

  /**
   * test existence of component
   * @param name - component name
   */
  public isComponent(name: BotComponentMetaName): boolean {
    return this._components.has(name);
  }

  /**
   * return component metadata as json array
   * @param collection: RegistryCollectionName - (optional) the collection name
   * @return BotComponentMeta[] - array of component metadata
   */
  public getMetadata(collection?: CollectionName): BotComponentMeta[] {
    const registry = this.getRegistry(collection);
    let meta = [];
    if (!!registry) {
      registry.getComponents().forEach((component, name) => {
        // push a copy of the metadata
        meta.push({...component.metadata()});
      });
    } else {
      this._logger.error(`Invalid registry requested ${collection}`);
    }
    return meta;
  }

}

/**
 * wrap a raw Object in a function.
 * @desc converts module.exports = {} to a prototyped object
 * @param value: any.
 */
function makeCtor(value: any) {
  return (value.prototype && value) || (function LegacyComponentWrapper() {
    return value;
  });
}

/**
 * test for class decorated with @BotComponent
 * @param ref class or object from exports.
 * @todo create a decorator factory to test annotations against instanceof
 */
function isBotComponent(ref: any): ref is BotComponent {
  return (typeof ref === 'function' && isType(ref.prototype.metadata) && isType(ref.prototype.invoke)) || // class usage
    (typeof ref === 'object' && isType(ref.metadata) && isType(ref.invoke)); // legacy
}
