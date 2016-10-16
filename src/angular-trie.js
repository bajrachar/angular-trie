/*
 * angular-trie
 * https://github.com/bajrachar/angular-trie

 * Version: 1.0.0 - 2016-08-09
 * License: MIT
 */
angular.module('angular.trie', []);

angular.module('angular.trie').factory('Trie', function(){
	var Trie;

	Trie = (function(){

		function Trie(wordlist){
			this._trie = {root:{}};
			for(var w in wordlist){
				var word = wordlist[w];
				this.addWord(word);
			}
		}

		Trie.prototype.getTrie = function(){
			return this._trie;
		};

		Trie.prototype.loadTrieJson = function(json){
			this._trie.root = json;
		}

		/*
		* addWord - adds a new word to the Trie
		* @param {word} - word to add to the tree
		* @param {n} - frequency if applicable
		* @param {val} - Any value the trie should map to for this word as key.
		*/
		var addWord = Trie.prototype.addWord = function(word, n, val){
			n = n || 0;
			word = word ? word.toLowerCase() :'';	// Normalize text to lowercase before adding
			if(word.length > 0)
			{
				var cur = this._trie.root;
				for(var i = 0; i < word.length; i++){
					var letter = word[i], pos = cur[word[i]];

					if(pos == null) {
						cur = cur[letter] = i === word.length - 1 ? (val ? [n, val]:[n]) : {};
					} else if (is_array(pos)) {
						cur = cur[letter] = i < word.length - 1 ? {$:pos} : pos;
					} else {
						cur = cur[letter];

						if(i === word.length - 1){
							cur['$'] = val ? [n, val] : [n];
						}
							
					}
				}
			}
		};

		/*
		* Matches the given text in the Trie key and returns associated value
		* @param {subText} - text to match
		*/
		Trie.prototype.match = function(subText){
			var cur = this._trie.root;
			var pos, value, found = false;
			var words = subText.toLowerCase();
			for(var c in words)
			{
				pos = cur[words[c]];

				if(pos == null){
					pos = cur;
					found = false;
					break;
				} else if (is_array(pos) && c == words.length - 1){
					value = pos[1];
					found = true;
				} else if (pos['$'] && c == words.length - 1){
					value = pos['$'][1];
					found = true;
				}

				cur = pos;
			}

			return value;
		};

		Trie.prototype.suggest = function(subText, ordered){
			var cur = this._trie.root;
			var matched = '';
			var pos;
			var suggestions = [];
			var words = subText.toLowerCase();
			for(var c in words)
			{
				pos = cur[words[c]];
				
				if(pos == null){
					pos = cur;
					break;
				}
				
				matched += words[c];
				cur = pos;
			}

			//Return all combinations of letters as suggestions
			if(matched !== ''){
				if(ordered){
					var list = getAllCombination(pos, matched);
					suggestions = list.sort(function(a,b){
						return -1 * (a.f - b.f);  // sort using frequency - highest first
					});
				}
				else
					suggestions = getAllCombination(pos, matched);
			} 
				
			return suggestions;
		};

		var getAllCombination = function(node, prefix){
			var list = [];
			for(var c in node)
			{
				if(is_array(node[c]) && c != '$')
					list.push({key: prefix+c, f: node[c][0], value: node[c][1]});
				else{
					if(c == '$')
						list.push({key: prefix, f: node[c][0], value: node[c][1]});
					else
						list = list.concat(getAllCombination(node[c], prefix+c));
				}
			}
			return list;
		};

		/*
		* Check if object is array.
		* Taken from Douglas Crockford - Javascript the good parts.
		*/
		var is_array = function(value){
			return value &&
				typeof value === 'object' &&
				value.constructor === Array;
		};

		return Trie;
	})();

	return {
		create: function(wordList){
			var trie = new Trie(wordList);
			return trie;
		}
	};
});