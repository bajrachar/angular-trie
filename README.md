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

A new word can be added to the Trie structure by using addWord call -

```javascript
trie.addWord('rat');
```

You can also optionally associate a frequency and value with the word -

```javascript
trie.addWord('rat', 3, 'A0123');
```

You can also initialize the trie using a json string representing the trie structure -

```javascript
trie.loadTrieJson(jsonString);
```

A Trie structure can provide fast look-up for large datasets like a dictionary. You can create a json trie string from a file containing key/value pair using this command line tool - A [n-trie](https://github.com/bajrachar/n-trie).

After populating the trie data structure, you can get suggestions for words by using the suggest method -

```javascript
trie.suggest('ra');
```

Also, you can get the ordered suggestions by passing the ordered flag to suggest method call -

```javascript
trie.suggest('ra', true);
```

