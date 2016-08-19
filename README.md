# angular-trie
A simple Trie data structure module for angular. It can be used to populate a dictionary and do a quick lookup/suggestions in a type ahead auto complete for example.

##Installation
Use bower install as follows

```javascript
bower install angular-trie
```
##Usage

Add dependency to your project -

```javascript
angular.module('myModule', ['angular.trie']);
```
After this, Trie service can be injected where you need it and a new instance of Trie can be created:

```javascript
angular.module('myModule').controller('MainCtrl', ['$scope, Trie', function($scope, Trie){
	var trie = new Trie;
}]);
```

