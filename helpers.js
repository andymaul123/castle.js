const store = require('./store.js'),
      constants = require('./constants.js'),
      util = require('util');

module.exports = {

    fetchRoom: function(roomId) {
        return store.read(constants.gameFile).rooms.find(function(obj){
            return obj.id === roomId;
        })
    },
    fetchItem: function(itemName) {
        let fetchedItem = {};
        fetchedItem.item = store.read(constants.rim).items.find(function(obj){
            return obj.name.toUpperCase() === itemName.toUpperCase();
        });
        if(fetchedItem.item) {
            fetchedItem.location = constants.rim;
            fetchedItem.index = store.read(constants.rim).items.findIndex(function(obj){
                return obj.name.toUpperCase() === itemName.toUpperCase();
            });
        } else {
            fetchedItem.item = store.read(constants.inventory).items.find(function(obj){
                return obj.name.toUpperCase() === itemName.toUpperCase();
            }); 
            fetchedItem.location = constants.inventory;
            fetchedItem.index = store.read(constants.rim).items.findIndex(function(obj){
                return obj.name.toUpperCase() === itemName.toUpperCase();
            });
        }
        return fetchedItem;
    },
    fetchExits: function(direction) {
        let fetchedExit = {};
        fetchedExit.exit = store.read(constants.rim).exits.find(function(obj){
            return obj.direction.toUpperCase() === direction.toUpperCase();
        });
        fetchedExit.index = store.read(constants.rim).exits.findIndex(function(obj){
            return obj.direction.toUpperCase() === direction.toUpperCase();
        });
        return fetchedExit;
    },
    addItemToInventory: function(item) {
        store.write(constants.inventory, store.read(constants.inventory).items.concat(item), store.read(constants.inventory), ["items"]);
    },
    removeItemFromRoom: function(item) {
        store.write(constants.rim, store.read(constants.rim).items.filter(obj => obj.id != item.id), store.read(constants.rim),["items"]);
    },
    renderRoom: function(gameStart) {
        let roomDescription = "";
        if(gameStart) {
          store.write(constants.rim, module.exports.fetchRoom(1), store.read(constants.rim));
        }
        roomDescription = store.read(constants.rim).describe();
        for (var i = 0; i < store.read(constants.rim).items.length; i++) {
          roomDescription = roomDescription + " " + store.read(constants.rim).items[i].describe();
        }
        for (var i = 0; i < store.read(constants.rim).exits.length; i++) {
          roomDescription = roomDescription + " " + store.read(constants.rim).exits[i].describe();
        }
        console.log(roomDescription);
    },
    changePropertyState: function(context) {
        store.write(context.location, context.value, context.obj, context.path);
    },
    createContext: function(location, value, obj, path) {
        return {location: location, value: value, obj: obj, path: path}
    }
}