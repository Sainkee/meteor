const getAslStore = () => (Meteor.isServer && global?.asyncLocalStorage?.getStore()) || {};
const getValueFromAslStore = key => getAslStore()[key];
const updateAslStore = (key, value) => getAslStore()[key] = value;

Meteor._isFibersEnabled = !process.env.DISABLE_FIBERS && Meteor.isServer;
Meteor._getAslStore = getAslStore;
Meteor._getValueFromAslStore = getValueFromAslStore;
Meteor._updateAslStore = updateAslStore;
if (Meteor.isServer && !global.asyncLocalStorage) {
    const { AsyncLocalStorage } = Npm.require('async_hooks');
    global.asyncLocalStorage = new AsyncLocalStorage();
}

Meteor._runAsync = (fn, ctx, store = {}) => {
    return global.asyncLocalStorage.run(
      store || Meteor._getAslStore(),
      () => {
        return fn.call(ctx);
      }
    );
};

Meteor._isPromise = (r) => {
    return r && typeof r.then === 'function';
};
