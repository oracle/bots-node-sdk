import {
  Lib,
  Component,
} from '../../main';

describe('@Component Decorator', () => {

  it('should utilize decorator reverse abstraction', () => {
    const c = new TestComponent();
    expect(c['metadata']).toEqual(jasmine.any(Function));
    expect(c['metadata'].bind(c)).not.toThrow();
    expect(c.invoke).not.toThrow();
  });

  it('should use class name as basis for missing meta name', () => {
    const c = new TestComponent();
    expect(c.annotations.name).toEqual('test.component');
  });

  it('should use explicitly provided name', () => {
    const c = new TestComponentWithError();
    expect(c.annotations.name).toEqual('test.error');
  });

  it('should catch errors gracefully', done => {
    const c = new TestComponentWithError();
    expect(c.invoke).toThrow(); // invocation without Callback will throw
    c.invoke(null, (err) => {
      expect(err).toBeDefined();
      done();
    });
  });

  /**
   * even though TestInvalidComponent doesn't define an invoke method,
   * the decorator creates one allowing calls to the method.
   */
  it('should callback with error on improper implementation', done => {
    const c = <Component>new TestInvalidComponent();
    c.invoke(null, (err) => {
      expect(err).toBeDefined();
      done();
    });
  });

  it('should give explicit class.prototype.metadata() priority', () => {
    const c = new TestDecoratedComponentWithMetaFoo();
    expect(c.metadata()).toEqual('foo');
  });

});

// test a valid component
@Lib.Component({
  supportedActions: [],
  properties: {
    firstname: { type: 'string', required: true }
  },
})
class TestComponent extends Lib.ComponentAbstract {
  invoke() { }
}

// test a valid component with explicit name
@Lib.Component({
  name: 'test.error',
  supportedActions: [],
  properties: {
    firstname: { type: 'string', required: true }
  },
})
class TestComponentWithError extends Lib.ComponentAbstract {
  invoke(...args: any[]) {
    throw new Error('Bad things happen');
  }
}

// test invalid component
@Lib.Component({
  supportedActions: [],
  properties: {},
})
class TestInvalidComponent {
  /* intentionally missing invoke method to throw error */
}

// test use of decorator and metadata implementation
@Lib.Component()
class TestDecoratedComponentWithMetaFoo {
  metadata() {
    return 'foo'
  }
}
