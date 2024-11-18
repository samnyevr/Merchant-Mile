/* SCAN MACROS */

Macro.add("storyletscan",{
  handler: function() {
    MQBN.storyletscan(this.args[0]);
  }
});

Macro.add("storylet",{
  handler: function() {
    // null placeholder to allow the <<storylet>> syntax
  }
});

Macro.add(["storyletsinit","initstorylets"],{
  handler: function() {
      MQBN.storyletsinit(this.args[0]);
  }
});

Macro.add(["storyletsprune","prunestorylets"],{
  handler: function() {
      MQBN.pruneStorylets(this.args[0]);
  }
});

Macro.add("storyletgoto",{
  handler: function() {
    if (this.args.length === 0) {
        return this.error(`no storylet specified`);
    }

    const args    = macroPairedArgsParser(this.args,1);
    const store   = args.store ?? 'storylets';
    const ifopen  = args.open  ?? false;
    let   storylet;

    if (typeof this.args[0] === 'object') {
      // Argument was a storylet object
      storylet = this.args[0]; 
    } else {
      // Argument was a storylet name
      const storylets = setup[store].find((s) => { return s.title == this.args[0] || s.id == this.args[0]});
      if (ifopen) {
        // we wish to use the first open one
        const filtered = storylets.toSorted(MQBN.prioritySort).filter((s) => MQBN.meetsRequirements(s));
        storylet = filtered.length ? filtered[0] : storylets[0];
      } else {
        storylet = storylets[0];
      }
    }

    if (storylet) {
      const passage = storylet.passage ?? storylet.title;
      variables()[store+'_used'].set(storylet.id ?? storylet_title);
      variables()[store+'_current'] = storylet;
      MQBN.trigger(storylet);
      Engine.play(passage);
    }
  }
});

Macro.add("storyletlink",{
  tags    : null,
  handler() {
    if (this.args.length === 0) {
      return this.error("no storylet specified");
    }

    const args    = macroPairedArgsParser(this.args,1);
    const store   = args.store ?? 'storylets';
    const style   = args.behaviour ?? 'hidden'; 
    const payload = this.payload[0].contents.trim();
    const $link   = jQuery(document.createElement('a'));
      
    let storylet;
    if (typeof this.args[0] === 'object') {
      // Argument was a storylet object
      storylet = this.args[0]; 
    }
    else {
      // Argument was a storylet name
      if (!temporary()[store+'_available']) {
          MQBN.getStorylets(0,store);
      }
      const s = temporary()[store+'_available'].find((s) => { return s.title == this.args[0] || s.id == this.args[0] });
      if (s) {
        storylet = s;
      }
    }
    
    if (storylet) {
          
      $link.append(document.createTextNode(args.text ?? (storylet.link ?? storylet.title)));
      
      let passage = storylet.passage ?? storylet.title;
      
      if (passage != null) { // lazy equality for null
        $link.attr('data-passage', passage);
        if (Story.has(passage)) {
          if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
            $link.addClass('link-visited');
          }
        }
        else {
          $link.addClass('link-broken');
        }
      }

      $link
        .addClass('macro-storylet-link')
        .addClass('link-internal')
        .ariaClick({
          namespace : '.macros',
          role      : passage != null ? 'link' : 'button', // lazy equality for null
          one       : passage != null // lazy equality for null
        }, this.createShadowWrapper(
            function() {
                variables()[store+'_used'].set(storylet.id ?? storylet.title);
                variables()[store+'_current'] = storylet;
                if (payload) {
                  Wikifier.wikifyEval(payload)
                }
              },
          passage != null // lazy equality for null
            ? () => { MQBN.trigger(storylet); Engine.play(passage); }
            : null
        ))
        .appendTo(this.output);
          
    } else if (style == "disabled" && typeof this.args[0] === "string") {
      storylet = setup[store].find((s) => s.id == this.args[0] || s.title == this.args[0]);
      if (storylet) {
        jQuery(this.output).wiki(`<span class="link-disabled">${args.disabledtext ?? (storylet.link ?? storylet.title)}</span>`);
      } else {
        return this.error(`storylet ${this.args[0]} cannot be found`);
      }
    }
  }
});

Macro.add("storyletuse",{
  handler: function() {
    if (this.args.length === 0) {
        return this.error(`no storylet specified`);
    }

    const args    = macroPairedArgsParser(this.args,1);
    const store   = args.store ?? 'storylets';
    let   storylet;

    if (typeof this.args[0] === 'object') {
      // Argument was a storylet object
      storylet = this.args[0]; 
    } else {
      // Argument was a storylet name
      const storylets = setup[store].find((s) => { return s.title == this.args[0] || s.id == this.args[0]});
    }

    if (storylet) {
      variables()[store+'_used'].set(storylet.id ?? storylet_title);
      variables()[store+'_current'] = storylet;
    }
  }
});

/* SEQUENCE MACROS */

Macro.add("sequence",{
  handler: function() {
    if (this.args.length === 0) {
      return this.error("no sequence name specified");
    }
    if (this.args[1] != "linear" && this.args[1] != "cycling") {
      return this.error(`argument 2 must be either linear or cycling, ${this.args[1]} found`);
    }
    if (this.args.length < 3) {
      return this.error("no sequence values specified");
    }
    if (Array.isArray(this.args[1]) || Util.toStringTag(this.args[1]) == "Object") {
      MQBN.createSequence(this.args[0],this.args[2],this.args[1]);
    } else {
      MQBN.createSequence(this.args[0],this.args.slice(2),this.args[1]);
    }
  }
});

Macro.add(["sequenceadvance","sequencerewind"],{
  handler: function() {
    if (this.args.length === 0) {
      return this.error("no sequence name specified");
    }
    if (!setup.MQBNsequences) {
      return this.error("you must create a sequence using <<sequence>> before ${this.name == 'sequenceadvance' ? 'advancing' : 'rewinding'} it");
    }
    if (!setup.MQBNsequences[this.args[0]]) {
      return this.error(`sequence ${this.args[0]} has not been defined`);
    }
    let   inc   = this.args[1] ?? 1;
    if (this.name == "sequencerewind") { inc = -1 * inc; }
    MQBN.sequenceChange(this.args[0],inc);
  }
});


  
// Wordwheel
Macro.add("wordwheel", {
	tags: ["fontSize", "fontsize", "circleSize", "circlesize"],
	handler: function () {
		let errorArray = [];
		if (!window.addEventListener && !window.attachEvent && !document.createElement) {errorArray.push("Unable to either add EvenListener, AttachEvent or createElement")}; 
		if(this.args.length <= 0)
			return this.error("First argument cannot be skipped, please insert a string via <<wordwheel \"Text here.\">>.");
		if(this.args[0] === "")
			return this.error("First argument cannot be an empty string.");
		if(this.args[0].length > 31)
			return this.error("Word wheel doesn't accept more than 50 characters.");
		
		setup.circle.msg = this.args[0].split("");


		for (const pay of this.payload) {
			switch (pay.name.toLowerCase()) {
			case "fontsize":
				if (pay.args[0] > 30)
					errorArray.push("Font size cannot be bigger than 30.");
				if (pay.args[0] < 4)
					errorArray.push("Font size cannot be negative nor below 4.");
			
				setup.circle.size = pay.args[0];
			break;
			case "circlesize":
				if (pay.args[0] > 70)
					errorArray.push("Circle size cannot be above 70.");
				if (pay.args[0] < 20)
					errorArray.push("Circle size cannot be below 20");

				setup.circle.diameter = pay.args[0];
			break;
			}
		}

		if (errorArray.length > 0)
			return this.error(errorArray.join("\n"));

		else if (window.addEventListener) {
			setup.circle.circleInit();
			document.addEventListener("mouseover", setup.circle.circleMouse, false);
			document.addEventListener("mousemove", setup.circle.circleMouse, false);
			if (/Apple/.test(navigator.vendor))
			window.addEventListener("scroll", setup.circle.circleAscroll, false);
		}
		else if (window.attachEvent) {
			// window.attachEvent("onload", setup.circle.circleInit);
			document.attachEvent("onmousemove", setup.circle.circleMouse);
		}
	}
});
//

// Dyslexia
Macro.add('dyslexia', {
	tags: null,
	handler  : function () {
		// Dyslexia by SjoerdHekking
		'use strict';

		let out = $(`<span class="macro-mess-up-words" />`)
        	.wiki(this.payload[0].contents)
          	.appendTo(this.output);

		// returns texts
		let getTextNodesIn = function(el) {
		    return $(el).find(":not(iframe,script)").addBack().contents().filter(function() {
		        return this.nodeType === 3;
		    });
		};

		// only allow scanning within these tags
		let textNodes = getTextNodesIn(out);

		let errorArray = [];

		let storeArg = this.args[0] || 10;
		let storeArg2 = this.args[1] || 3;
		let storeArg3 = this.args[2] || 50;

		if (storeArg) {
			storeArg = parseInt(storeArg);
			if (isNaN(storeArg) || storeArg < 0 || storeArg > 100) {
				errorArray.push("Check first argument. Invalid value.");
			}
		} 
		if (storeArg2) {
			storeArg2 = parseInt(storeArg2);
			if (isNaN(storeArg2) || storeArg2 < 2) {
				errorArray.push("Check second argument. Invalid value.");
			}
		} 
		if (storeArg3) {
			storeArg3 = parseInt(storeArg3);
			if (isNaN(storeArg3) || storeArg3 < 50) {
				errorArray.push("Check third argument. Invalid value.");
			}
		} 

		if (errorArray.length > 0) {
			let joinedArray = errorArray.join('\n')
			return this.error(joinedArray);
		}

		let wordsInTextNodes = [];
		for (let i = 0; i < textNodes.length; i++) {
			const node = textNodes[i];
			const wordsInNode = node.nodeValue.match(/\w+/g) || [];
		
			wordsInTextNodes[i] = wordsInNode.map((word, index) => ({
				length: word.length,
				position: node.nodeValue.indexOf(word, index === 0 ? 0 : wordsInNode[index - 1].length + wordsInNode[index - 1].index)
			}));
		}

		/**
		 * Messes up the words in text nodes according to the probability and word length delay set in the dyslexia macro.
		 */
		function messUpWords () {
			for (let i = 0; i < textNodes.length; i++) {
				let node = textNodes[i];

				for (let j = 0; j < wordsInTextNodes[i].length; j++) {
					
					if (Math.random() < (100 - storeArg) / 100 ) {
						continue;
					}

					let wordMeta = wordsInTextNodes[i][j];
					let word = node.nodeValue.slice(wordMeta.position, wordMeta.position + wordMeta.length);
					node.nodeValue = node.nodeValue.slice(0, wordMeta.position) + messUpWord(word) + node.nodeValue.slice(wordMeta.position + wordMeta.length);
				};
			};
		}

		/**
		 * Messes up a single word by swapping random letters in the "messy part" of the word (i.e. all letters except the first and last).
		 * @param {string} word - The word to mess up.
		 * @returns {string} The messed up word, or the original word if its length is less than the minimum word length specified in the dyslexia macro.
		 */
		function messUpWord (word) {
			if (word.length < storeArg2) return word;
			const middle = messUpMessyPart(word.slice(1, -1));
  			return `${word[0]}${middle}${word.slice(-1)}`;
		}

		/**
		 * Messes up the "messy part" of a word by swapping two random letters.
		 * @param {string} messyPart - The "messy part" of a word to mess up.
		 * @returns {string} The messed up "messy part", or the original "messy part" if its length is less than 2.
		 */
		function messUpMessyPart (messyPart) {
			if (messyPart.length < 2) return messyPart;

			let a, b;
			while (!(a < b)) {
				a = getRandomInt(0, messyPart.length - 1);
				b = getRandomInt(0, messyPart.length - 1);
			}

			function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			}

			return `${messyPart.slice(0, a)}${messyPart[b]}${messyPart.slice(a+1, b)}${messyPart[a]}${messyPart.slice(b+1)}`;
		}

		setInterval(messUpWords, storeArg3);
	}
});

// Spoiler
Macro.add("spoiler", {
	tags: null,
	handler: function () {
		// Spoiler macro by SjoerdHekking
        // with the help of Cyrus Firheir
		"use strict";

		let errorArray = [];
		const storeArg = Math.min(10, Math.max(0, parseInt(this.args[0] ?? 4)));
		const storeArg2 = Math.min(10, Math.max(0, parseInt(this.args[1] ?? 2)));
		const storeArg3 = String(this.args[2] ?? "Click to reveal completely");
		
		if (isNaN(storeArg)) {
			errorArray.push("Check first argument. The spoiler macro used the default");
		}
		
		if (isNaN(storeArg2)) {
			errorArray.push("Check second argument. The spoiler macro used the default");
		}

		if (errorArray.length > 0) {
		  let joinedArray = errorArray.join("\n")
		  return this.error(joinedArray);
		}

		let out = $(`<span class="macro-spoiler" />`)
			.wiki(this.payload[0].contents)
			.appendTo(this.output);

		spoiler(out, {
			max: storeArg,
			partial: storeArg2,
			hintText: storeArg3
		});

		function spoiler(selector, options) {
			const elements = $(selector);
		
			elements.each(function(index, el) {
				el.dataset.spoilerState = "shrouded";
				el.style.transition = "filter 250ms";
		
				function applyBlur(radius) {
					el.style.filter = `blur(${radius}px)`;
				}
		
				applyBlur(options.max);
		
				el.addEventListener("mouseover", function () {
					el.style.cursor = "pointer";
					el.title = options.hintText;
					if (el.dataset.spoilerState === "shrouded") applyBlur(options.partial);
				});
		
				el.addEventListener("mouseout", function () {
					el.title = options.hintText;
					if (el.dataset.spoilerState === "shrouded") applyBlur(options.max);
				});
		
				el.addEventListener("click", function () {
					if (el.dataset.spoilerState === "shrouded") {
						el.dataset.spoilerState = "revealed";
						el.title = "";
						el.style.cursor = "auto";
						applyBlur(0);
					} else {
						el.dataset.spoilerState = "shrouded";
						el.title = options.hintText;
						el.style.cursor = "pointer";
						applyBlur(options.max);
					}
				});
			});
		}
	}
});

///** Banking / ATM  by: AZEREP**///
//
Macro.add("bankTransaction",{handler:function(){let a=this.args[0],e=parseInt(document.getElementById("transactionAmount").value),n=this.args[1]||"Unknown Location";if(isNaN(e)||e<=0){this.output.append("<p>Please enter a valid amount.</p>");return}let t="";"deposit"===a?State.variables.funds>=e?(State.variables.funds-=e,State.variables.bankBalance+=e,State.variables.ledger.push({type:"Deposit",amount:e,passage:Story.get("passage").title,location:n}),t=`Deposited ${e} coins. New bank balance: ${State.variables.bankBalance} coins. Funds remaining: ${State.variables.funds} coins.`):t="You don’t have enough funds to deposit this amount.":"withdraw"===a?State.variables.bankBalance>=e?(State.variables.bankBalance-=e,State.variables.funds+=e,State.variables.ledger.push({type:"Withdraw",amount:e,passage:Story.get("passage").title,location:n}),t=`Withdrew ${e} coins. New funds total: ${State.variables.funds} coins. Bank balance remaining: ${State.variables.bankBalance} coins.`):t="You don’t have enough in your bank balance to withdraw this amount.":t="Invalid action specified.",$(document.getElementById("transactionResult")).wiki(`<<replace "#transactionResult">>${t}<</replace>>`)}});


Macro.add('tabs', {
  skipArgs: false,
  tags: null,
  handler : function() {
    const $wrapper  = $("<div class='tabs-tabset'>");
    const $tabs     = $("<div class='tabs-tabs'>");
    const $contents = $("<div class='tabs-contents'>");
    
    let   prefix    = '';
    let   responsive = false;
    let   responseWidth = 0;
    let   responseSide  = 'left';

    for (const arg of this.args) {
      if (["left","right","top","stacked","wrapped","responsive-left","responsive-right","responsive-stacked","responsive-wrapped"].includes(arg)) {
        if (arg.substring(0,10) == "responsive") {
          responsive = true;
          responseSide = arg.substring(11);
        } else {
          $wrapper.addClass(arg);
        }
      } else if (parseInt(arg)) {
        responseWidth = parseInt(arg);
      } else {
        prefix = this.args[0] + '-';
        $wrapper.attr("id",this.args[0]);
      }
    }
    
    this.context = {
      selected: 0,
      tabs: [],
      contents: [],
      tabCount: 0,
      wrapper: $wrapper,
      prefix: prefix
    };
    
    $contents.wiki(this.payload[0].contents);
    
    this.context.tabs[this.context.selected].addClass("selected");
    this.context.contents[this.context.selected].removeClass("hidden");
    $tabs.append(...this.context.tabs);
    $wrapper.attr("style",`--cols:${this.context.tabCount}`).append($tabs, $contents);
    $(this.output).append($wrapper);
    
    if (responsive) {
      const resizeObserver = new ResizeObserver((entries) => {
        window.requestAnimationFrame(() => {
          let entry = entries[0];
          let width = 0;
          if (entry.contentBoxSize) {
              width = entry.contentBoxSize[0].inlineSize;
          } else {
              width = entry.contentRect.width;
          }
          $("#out").html("comparing "+width+" with "+responseWidth+" to set "+responseSide);
          if (width && width <= responseWidth) {
              $wrapper.addClass(responseSide);
          } else {
              $wrapper.removeClass(responseSide);
          }
        });
      });

      resizeObserver.observe($wrapper[0]);
    }
  }
});

Macro.add('tab', {
  skipArgs: false,
  tags: null,
  handler : function() {
    const parent = this.contextSelect(ctx => ctx.name === 'tabs');
    if (!parent) {
        return this.error('must only be used in conjunction with its parent macro <<tabs>>');
    }

    let tabname = this.args[0];
    let tabid   = 'tabs-contents-' + tabname.trim().toLowerCase().replace(/[^a-z0-9]/g,'').replace(/\s+/g, '-');
    let label   = `<span>${tabname}</span>`;
    if (this.args[1] && typeof this.args[1] == "string") {
      label = `<img src="${this.args[1]}">`;
    }
    
    let $contents = $(`<div class="tabs-content hidden" id="${parent.context.prefix}${tabid}">`).wiki(this.payload[0].contents.trim());
    parent.context.contents.push($contents);
    
    let $tab = $(`<button id="${tabid}-control">${label}</button>`).ariaClick(function() {
      parent.context.tabs.forEach((tab) => tab.removeClass("selected"));
      parent.context.contents.forEach((tab) => tab.addClass("hidden"));
      $contents.removeClass("hidden");
      $(this).addClass("selected");
    });
    parent.context.tabs.push($tab);
    if (this.args.length > 1 && this.args[this.args.length -1] === true) { parent.context.selected = parent.context.tabCount; }
    parent.context.tabCount ++;
    
    $(this.output).append($contents);
  }
});

Macro.add(['id','style','class','attr'], {
    skipArgs: false,
    tags: null,
    handler : function() {
        if (this.args[0]) {
            let parsedContent = $("<div>").wiki(this.payload[0].contents.trim()).children();
            if (this.name == "class") {
                parsedContent.first().addClass(this.args[0]);
            } else if (this.name == "attr") {
                if (this.args.length % 2 == 0) {
                    for (let i = 0; i < this.args.length; i += 2) {
                        parsedContent.first().attr(this.args[i],this.args[i+1]);
                    }
                } else {
                    return this.error('You must specify pairs of attribute names and values you wish to add');
                }
            } else {
                parsedContent.first().attr(this.name,this.args[0]);
            }
            jQuery(this.output).append(parsedContent);
        } else {
            return this.error('You must specify the content for the attribute you wish to add');
        }
    }
});