'use strict';

describe('Trie', function(){
	var Trie;

	beforeEach(module('angular.trie'));
	
	beforeEach(inject(function(_Trie_){
		Trie = _Trie_;
	}));

	describe('create', function(){
		it('should create trie datastructure from word list', function(){
			var t = new Trie(['a','x','d']);
			expect(Object.keys(t.getTrie().root).length).toBe(3);
			expect(t.getTrie().root['a']).toBeDefined();
			expect(t.getTrie().root['x']).toBeDefined();
			expect(t.getTrie().root['d']).toBeDefined();
		});

		it('should have single branch for duplicate substring', function(){
			var t = new Trie(['wor1','wor2','wor3']);
			expect(Object.keys(t.getTrie().root).length).toBe(1);
			expect(t.getTrie().root['w']).toBeDefined();

			expect(Object.keys(t.getTrie().root['w']).length).toBe(1);
			expect(t.getTrie().root['w']['o']).toBeDefined();

			expect(Object.keys(t.getTrie().root['w']['o']).length).toBe(1);
			expect(t.getTrie().root['w']['o']['r']).toBeDefined();

			expect(Object.keys(t.getTrie().root['w']['o']['r']).length).toBe(3);
		});
	});

	describe('add word', function(){
		var trie;
		beforeEach(function(){
			trie = new Trie(['a','b','c','xyz']);
		});

		it('should add new word', function(){			
			trie.addWord('d');
			expect(trie.getTrie().root['d']).toBeDefined();
		});

		it('should normalize text to lowercase', function(){
			trie.addWord('D');
			expect(trie.getTrie().root['d']).toBeDefined();
		});

		it('should add new word with default 0 frequency', function(){
			trie.addWord('d');
			expect(trie.getTrie().root['d']).toBe(0);
		});

		it('should add new word with provided frequency', function(){
			trie.addWord('d',90);
			expect(trie.getTrie().root['d']).toBe(90);
		});

		it('should add new word with existing word as substring', function(){
			trie.addWord('ab');
			expect(trie.getTrie().root['a']['$']).toBe(0);
		});

		it('should add new word that is substring of existing word', function(){
			trie.addWord('xy');
			expect(trie.getTrie().root['x']['y']['$']).toBe(0);
		});

		it('should add new word that is substring of existing word with given frequency', function(){
			trie.addWord('xy', 40);
			expect(trie.getTrie().root['x']['y']['$']).toBe(40);
		});

		it('should not add $ marker if word is already present', function(){
			trie.addWord('xyz');
			expect(trie.getTrie().root['x']['y']['z']['$']).not.toBeDefined();
		});
	});

	describe('suggest', function(){
		var trie;

		beforeEach(function(){
			trie = new Trie(['word', 'world', 'race', 'rag', 'rage']);
		});

		it('should suggest all combinations starting with xx', function(){
			var response = trie.suggest('wo');
			expect(response.length).toBe(2);
		});

		it('should suggest all combinations with complete words that are substring', function(){
			var response = trie.suggest('ra');
			expect(response.length).toBe(3);
			expect(response.indexOf('rag') > -1).toBe(true);
			expect(response.indexOf('rage') > -1).toBe(true);
		});

		it('should rank the suggestions based on frequency', function(){
			trie = new Trie();
			trie.addWord('rat', 40);
			trie.addWord('rage', 90);
			var response = trie.suggest('ra', true);
			expect(response.length).toBe(2);
			expect(response.indexOf('rage')).toBe(0);
		});

		it('should return empty array if no match found', function(){
			var response = trie.suggest('pp');
			expect(response.length).toBe(0);
		});

		it('should not be case sensitive', function(){
			var response = trie.suggest('Wo');
			expect(response.length).toBe(2);
		});
	});
});