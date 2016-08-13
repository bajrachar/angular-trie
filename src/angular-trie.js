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
		var _trie;

		function Trie(wordlist){
			_trie = {root:{}};
			for(var w in wordlist){
				var word = wordlist[w];
				addWord(word);
			}
		}

		Trie.prototype.getTrie = function(){
			return _trie;
		};

		Trie.prototype.loadTrieJson = function(json){
			_trie.root = json;
		}

		var addWord = Trie.prototype.addWord = function(word, n){
			n = n || 0;
			word = word ? word.toLowerCase() :'';	// Normalize text to lowercase before adding
			if(word.length > 0)
			{
				var cur = _trie.root;
				for(var i = 0; i < word.length; i++){
					var letter = word[i], pos = cur[word[i]];

					if(pos == null) {
						cur = cur[letter] = i === word.length - 1 ? n : {};
					} else if (!isNaN(pos)) {
						cur = cur[letter] = i < word.length - 1 ? {$:pos} : pos;
					} else {
						cur = cur[letter];

						if(i === word.length - 1){
							cur['$'] = n;
						}
							
					}
				}
			}
		};

		Trie.prototype.suggest = function(subText, ordered){
			var cur = _trie.root;
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
					var list = getAllCombinationFreq(pos, matched);
					suggestions = list.sort(function(a,b){
						return -1 * (a.f - b.f);  // sort using frequency - highest first
					}).map(function(obj){
						return obj.key;
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
				if(!isNaN(node[c]) && c != '$')
					list.push(prefix+c);
				else{
					if(c == '$')
						list.push(prefix);
					else
						list = list.concat(getAllCombination(node[c], prefix+c));
				}
			}
			return list;
		};

		var getAllCombinationFreq = function(node, prefix){
			var list = [];
			for(var c in node)
			{
				if(!isNaN(node[c]) && c != '$')
					list.push({key: prefix+c, f: node[c]});
				else{
					if(c == '$')
						list.push({key: prefix, f: node[c]});
					else
						list = list.concat(getAllCombinationFreq(node[c], prefix+c));
				}
			}

			return list;
		};

		return Trie;
	})();

	return Trie;
});