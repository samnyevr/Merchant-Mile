window.MQBN = class MQBN {

  static getStorylets(limit,store="storylets",needAvailable=true) {
    const available = [];
    let   priority  = 0;
    let   count     = 0;
    for (let s of setup[store].sort(MQBN.prioritySort)) {
      if (this.meetsRequirements(s,store)) {
        count ++;
        if ((s.priority ?? 0) >= priority) {
          available.push(s);
        }
        if (count == limit) { 
          priority = s.priority ?? 0; 
          if (!needAvailable) { break; }
        } 
      }
    };
    temporary()[store+'_available'] = available;
    return available.slice(0,limit).sort(MQBN.weightSort);
  }

  static prioritySort(a, b) {
    if (a.priority && !b.priority) {
      return -1;
    } else if (a.priority != b.priority) {
      return a.priority > b.priority ? -1 : 1;
    } else {
      return randomFloat(0,1) - 0.5;
    }
  }

  static weightSort(a, b) {
    if (a.priority && !b.priority) {
      return 1;
    } else if (a.weight != b.weight) {
      return a.weight > b.weight ? 1 : -1;
    } else {
      return 0;
    }
  }
  
  static meetsRequirements(s,store="storylets") {
    if (!s.sticky && variables()[store+"_used"].has(s.id ? s.id : s.title)) { return false; }
    if (s.all) {
      for (const r of s.all) {
        if (!this[r.type+"Requirement"](r,store)) { return false; }
      }
    }
    if (s.any) {
      for (const r of s.any) {
        if (this[r.type+"Requirement"](r,store)) { return true; }
      }
      return false;
    }
    return true;
  }
  
  static anyRequirement(r,store) { return this.meetsRequirements(r,store); }
  static allRequirement(r,store) { return this.meetsRequirements(r,store); }
  
  static visitedRequirement(r) {
    if (r.op == "not") {
      return !visited(r.passage);
    } else {
      return visited(r.passage);
    }
  }
  
  static varRequirement(r) {
    return this.operators[r.op ?? "eq"](State.getVar(r.var),r.value);
  }
  
  static sequenceRequirement(r) {
    if (r.count) {
      return this.operators[r.op ?? "eq"](State.getVar(r.seq).count,r.count);
    } else if (r.value) {
      return this.operators[r.op ?? "eq"](State.getVar(r.seq).value,r.value);
    } else {
      return this.operators[r.op == "not" ? "neq" : "eq"](State.getVar(r.seq).name,r.name);
    }
  }
  
  static playedRequirement(r,store) {
    if (r.op == "not") {
      return !variables()[store+"_used"].has(r.story);
    } else {
      return variables()[store+"_used"].has(r.story);
    }
  }

  static collectionRequirement(r) {
    const _var = State.getVar(r.var);
    let   val;
    if (_var instanceof Set || _var instanceof Map) {
      val = _var.has(r.has);
    } else if (_var instanceof Array) {
      val = _var.includes(r.has);
    } else if (Util.toStringTag(_var) == "Object") {
      val = Object.hasOwn(r.has) && _var[r.has];
    } else {
      throw(`The variable ${r.var} is not any kind of collection`);
    }
    if (r.op == "not") {
      return !val;
    } else {
      return val;
    }
  }

  static functionRequirement(r,store) {
    return r.func(r,store);
  }
  
  static randRequirement(r) {
    let x = this.getRandomInt(1,100);
    return (x <= r.chance);
  }

  static operators = {
    eq:  function(a, b) { return a == b },
    neq: function(a, b) { return a != b },
    lt:  function(a, b) { return a < b  },
    gt:  function(a, b) { return a > b  },
    lte: function(a, b) { return a <= b },
    gte: function(a, b) { return a >= b },
    includes: function(a, b) { return Array.isArray(a) && a.includes(b) },
    notincludes: function(a, b) { return Array.isArray(a) && !a.includes(b) },
    has: function(a, b) { 
      return (a instanceof Set || a instanceof Map) && a.has(b) 
    }
  }

  /* UTILITY */

  static trigger(story) {
    $(document).trigger({ type: ":storyletchosen", storylet: story});
  }

  // helper to avoid a seeded prng
  static getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
  }

  static played(story,store="storylets") {
    return this.playedRequirement({ story : story },store);
  }

  /* SCAN */
  
  static storyletscan(store = "storylets") {
    const st      = (store == "storylets") ? "" : ` ['"]{0,1}*${store}['"]{0,1}`;
    const match   = new RegExp(`<<storylet${st}>>`);
    const replace = new RegExp(`<<storylet${st}>>(.*)<<\/storylet>>`,"s");
    const ps      = Story.lookupWith((p) => p.text.match(match));
    const storylets = [];
    for (let p of ps) {
      const s = p.text.replace(replace,"$1");
      const storylet   = Scripting.evalJavaScript(`(${s.trim()})`);
      storylet.title   = storylet.title ?? p.title;
      storylet.passage = p.title;
      storylets.push(storylet);
    }
    setup[store] = setup[store].concat(storylets);
  }
  
  static storyletsinit(store = "storylets") {
    State.setVar('$'+store+'_used',new Map());
    State.setVar('$'+store+'_current',false);
  }

  static pruneStorylets(store = "storylets") {
    setup[store] = setup[store].filter((s) => !variables()[store+'_used'].has(s.id ?? s.title));
  }

  /* SEQUENCES */

  static createSequence(name, values, mode = "linear") {
    setup.MQBNsequences = setup.MQBNsequences || {};
    let initial = 0;
    if (Util.toStringTag(values) == "Object") {
      let va = [];
      let setinitial = false;
      for (let val in values) {
        if (!setinitial) { initial = val; setinitial = true; }
        va[val] = values[val];
      }
      values = va;
    }
    setup.MQBNsequences[name] = { values: values, mode: mode };
    const seq = new Sequence(name,values[initial],initial);
    State.setVar(name,seq);
  }

  static sequenceChange(name, inc) {
    const seq   = State.getVar(name);
    const idx   = seq.value;
    const len   = setup.MQBNsequences[name].values.length;
    let   newidx;

    if (setup.MQBNsequences[name].mode == "linear") {
      newidx = Math.max(Math.min(idx + inc,len -1),0);
    } else if (setup.MQBNsequences[name].mode == "cycling") {
      newidx = idx + inc;
      if (inc > 0 && newidx > len -1) {
        seq.count += Math.floor(newidx / len);
      } else if (inc < 0 && newidx < 0) {
        seq.count -= Math.abs(Math.floor(newidx / len));
      }
      newidx = Math.abs(newidx % len);
    }
    seq.name  = this.sequenceName(name,newidx);
    seq.val   = newidx;
    State.setVar(name,seq);
  }

  static sequenceName(name,value) {
    let previous = "";
    for (let val in setup.MQBNsequences[name].values) {
      if (val > value) {
        return previous;
      }
      previous = setup.MQBNsequences[name].values[val];
    }
    return previous;
  }
  
};

window.Sequence = class Sequence {
  constructor(type, name, value, count = 1) {
    this.type  = type;
    this.name  = name;
    this.val   = value;
    this.count = count;
  }

  toString() {
    return this.name;
  }

  [Symbol.toPrimitive](hint) {
    if (hint == "string") {
    	return this.name;
    } else {
    	return this.value;
    }
  }
  
  set value(newval) {
    MQBN.sequenceChange(this.type, newval - this.value);
  }
  get value() { return this.val }
  
  toJSON() { // the custom revive wrapper for SugarCube's state tracking
      // use `setup` version in case the global version is unavailable
      return JSON.reviveWrapper(String.format("new Sequence({0},{1},{2},{3})",
        JSON.stringify(this.type),
        JSON.stringify(this.name),
        JSON.stringify(this.val),
        JSON.stringify(this.count)
      ));
  }
  
  clone() { return new Sequence(this.type,this.name,this.val,this.count); }
};

window.macroPairedArgsParser = function(args,start=0) {
  const parsed = {};
  for (let i = start; i < args.length; i += 2) {
    parsed[args[i].replace(/[^a-zA-Z0-9_]/g,'')] = args[i+1];
  }
  return parsed;
}

$(document).one(':passagedisplay', function () {
    console.log("Passage fully displayed. JavaScript ready.");
    // Place all your initialization code here.
});

// Blackout Sys //
// Hijack passage transitions by intercepting all link clicks
$(document).on('click', 'a.link-internal', function (event) {
    // If focus is 0 or below, trigger blackout immediately
    if (State.variables.focus <= 0 && !State.variables.blackoutTriggered) {
        event.preventDefault();  // Stop the normal link behavior
        State.variables.blackoutTriggered = true;  // Prevent multiple triggers
        Engine.play('BlackoutPassage');  // Redirect to blackout
    }
});

window.updateFocusSidebar = async function () {
    // Check if the sidebar exists and clear it to force a refresh
    if ($('#sidebar').length) {
        $('#sidebar').empty();  // Clear the existing content

        // Optional: Add placeholder content to ensure something renders
        $('#sidebar').html(`
            <div class="sidebar-placeholder">
                <p>Sidebar refreshed!</p>
            </div>
        `);
    }

    console.log("Sidebar refreshed without tracking.");
};

// Track the number of passages and update rent logic
window.updatePassageCount = function () {
    SugarCube.State.variables.Totalpassages += 1;
    console.log(`Total passages: ${SugarCube.State.variables.Totalpassages}`);
};

// Check if rent is due and apply it to funds
window.checkRentDue = function () {
    const state = SugarCube.State.variables;
    
    if (state.Totalpassages % state.rentnxt === 0) {
        state.rentdue = state.rent;  // Calculate rent due
        if (state.funds >= state.rentdue) {
            state.funds -= state.rentdue;
            console.log(`Rent of ${state.rentdue} coins paid.`);
        } else {
            console.log("Not enough funds to pay rent!");
            // Handle scenarios like penalties or warnings here if needed
        }
    }
    console.log(`Funds remaining: ${state.funds}`);
};


// 4. Deplete focus on passage display with immunity handling
$(document).on(':passagerender', function () {
    console.log("Passage rendered. Checking focus depletion...");

    window.depleteFocus();  // Deplete focus on passage change
    window.updateFocusSidebar();  // Update sidebar with new focus values
});

window.depleteFocus = function () {
    if (State.variables.rewardActive) {
        console.log("Immunity active: Focus not depleted.");
        return;
    }

    const prestige = State.variables.prestige || 0;
    const baseDrain = 1;
    const drainAmount = Math.max(0, baseDrain - (prestige * 0.5));

    State.variables.focus = Math.max(0, State.variables.focus - drainAmount);
    console.log(`Focus drained by ${drainAmount}%. Current focus: ${State.variables.focus}%`);
};

//// Track Passage Immunity
// Track passage changes and manage immunity effect
$(document).on(':passagerender', function () {
    if (State.variables.rewardActive) {
        // Decrement the remaining passage count
        State.variables.rewardPassagesLeft -= 1;

        console.log(`Immunity active: ${State.variables.rewardPassagesLeft} passages left.`);

        // If the reward expires, disable it
        if (State.variables.rewardPassagesLeft <= 0) {
            State.variables.rewardActive = false;
            console.log("Immunity expired.");
        }
    }
});

//////////////
/// Core Menu //////////
// Function to inject the logo, slogan, location notifier, and mini-map into the sidebar
window.injectLogoAndLocation = function () {
    if (!$('#sidebar-header').length) {
        $('#ui-bar').prepend(`
            <div id="sidebar-header" style="
                text-align: center;
                               padding: 35px 10px 10px 10px;  /* Add 80px padding to the top */
                border-bottom: 1px solid #ccc;
                margin-bottom: 10px;">
                <img src="https://inklings.live/Twines/MMP/a.2.yoyo.nobeef.webp" 
                     alt="Game Logo" 
                     style="max-width: 250px; display: block; margin: 0 auto;">
                <p style="font-style: italic; margin-top: 5px;">
                    "Your journey begins here..."
                </p>
                <div id="location-notifier" style="
                    font-weight: bold;
                    margin-top: 10px;
                    font-size: 1.2em;
                ">
                    Location: <span id="current-location">Unknown</span>
                </div>
                <div id="mini-map" style="
                    margin-top: 10px;
                    width: 250px;
                    height: 150px;
                    background-size: cover;
                    background-position: center;
                    border: 1px solid #ddd;
                ">
                    <!-- Mini-map image will be displayed here -->
                </div>
            </div>
        `);

        console.log("Logo, slogan, location notifier, and mini-map injected.");
    }
};

// Function to update the location notifier and mini-map with the current passage title
// Function to update the location notifier and mini-map with the current passage title
window.updateLocationNotifier = function () {
    const currentLocation = SugarCube.State.passage || "Unknown Location";
    $('#current-location').text(currentLocation);

    // Update the mini-map with the appropriate image
    const mapImage = getMiniMapImage(currentLocation);
    $('#mini-map').css('background-image', `url(${mapImage})`);

    console.log(`Location updated to: ${currentLocation}`);
};

// Function to return the appropriate mini-map image URL based on the location name
function getMiniMapImage(location) {
    const baseUrl = "https://inklings.live/Twines/MMP/mapgui/";

    const mapImages = {
        "Bandit Dock": "BanditDock.webp",
        "Bandits": "Bandits.webp",
        "Barracks": "Barracks.webp",
        "Bazaar": "Bazaar.webp",
        "CBridgeA": "CBridgeA.webp",
        "Dock.1": "Dock.1.webp",
        "Dock.2": "Dock.2.webp",
        "DockQrts": "DockQrts.webp",
        "Homes": "Homes.webp",
        "Jewelers": "Jewlers.webp",
        "JimsTavern": "JimsTavern.webp",
        "Loc1": "Loc1.webp",
        "Loc2": "Loc2.webp",
        "LowerSlums": "LowerSlums.webp",
        "MayorOffice": "MayorOffice.webp",
        "MerchantGuild": "MerchantGuild.webp",
        "MoonBr": "MoonBr.webp",
        "MoonDock": "MoonDock.webp",
        "MoonIsle": "MoonIsle.webp",
        "North Gate": "NorthGate.webp",
        "Post": "Post.webp",
        "Slums": "Slums.webp",
        "SouthGate": "SouthGate.webp",
        "Square": "Square.webp",
        "T1": "T1.webp",
        "T2": "T2.webp",
        "T3": "T3.webp",
        "T4": "T4.webp",
        "Well": "Well.webp",
        "Witches": "Witches.webp",
      	"CityFarm": "CityFarm.webp",
      	"Lower Slums": "LowerSlums.webp"
    };

    // Return the corresponding image URL or the default image URL
    return `${baseUrl}${mapImages[location] || 'default.webp'}`;
}

// Inject the logo, location notifier, and mini-map on story load
$(document).on(':storyready', function () {
    console.log("SugarCube engine ready.");
    window.injectLogoAndLocation();  // Inject logo, slogan, location notifier, and mini-map
    window.updateLocationNotifier();  // Set the initial location and map
});

// Update the location notifier and mini-map every time a passage is rendered
$(document).on(':passagerender', function () {
    console.log("Passage rendered. Updating location...");
    window.updateLocationNotifier();  // Update the location and mini-map
});


// Inject the logo, location notifier, and mini-map on story load
$(document).on(':storyready', function () {
    console.log("SugarCube engine ready.");
    window.injectLogoAndLocation();  // Inject logo, slogan, location notifier, and mini-map
    window.updateLocationNotifier();  // Set the initial location and map
});

// Update the location notifier and mini-map every time a passage is rendered
$(document).on(':passagerender', function () {
    console.log("Passage rendered. Updating location...");
    window.updateLocationNotifier();  // Update the location and mini-map
});

/// TYPEWRITER //
window.typewriter = function (element, text, speed = 1, batchSize = 5) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.slice(i, i + batchSize);  // Add characters in batches
            i += batchSize;
            setTimeout(type, speed);
        }
    }
    type();
};


(function() {
    window.togglePanel = function(panelId) {
        const panel = document.getElementById(panelId);

        // Check if the clicked panel is already open
        const isAlreadyOpen = panel.classList.contains("show");

        // If the clicked panel is open and it's the only one open, do nothing
        const openPanels = document.querySelectorAll(".accordion-panel.show");
        if (isAlreadyOpen && openPanels.length === 1) {
            return; // Prevent collapsing the last open panel
        }

        // Close all panels
        document.querySelectorAll(".accordion-panel").forEach((p) => p.classList.remove("show"));

        // Open the clicked panel
        panel.classList.add("show");
    };
})();

// Variables to store the current zone, audio element, and volume
window.currentZone = "";
window.audioElement = new Audio();
window.audioElement.loop = true; // Loop the ambiance by default
window.audioElement.volume = 0.05; // Start volume at 5%
window.isPlaying = false; // Track playback status

// Function to inject the play/mute button and volume control on every passage
$(document).on(':passagerender', function (event) {
    // Check if the audio control already exists, if not, add it
    if (!$('#audio-control').length) {
        $('body').prepend(`
            <div id="audio-control" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
                <button id="audio-toggle" onclick="toggleAudio()">🔊</button>
                <input id="volume-slider" type="range" min="0" max="1" step="0.01" value="0.05" 
                       style="vertical-align: middle; margin-left: 10px;" 
                       onchange="adjustVolume(this.value)">
            </div>
        `);
    }
    
    // Determine the zone based on passage tags
    let tags = $(event.content).data('tags') || [];
    tags = Array.isArray(tags) ? tags : [tags]; // Ensure tags is an array

    const newZone = tags.find(tag => tag.startsWith("zone")) || null;

    // If the zone is different, update the ambiance audio
    if (newZone && newZone !== window.currentZone) {
        window.currentZone = newZone;
        debouncedSetAmbiance(newZone);
    }
});

// Debounce function to control how often ambiance audio changes
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSetAmbiance = debounce(setAmbianceForZone, 200);

// Function to load ambiance audio based on the zone
function setAmbianceForZone(zone) {
    const audioMap = {
        "zone_forest": "https://inklings.live/Twines/MMP/audiosnip/tracks/MorningFrost.ogg",
        "zone_market": "market-ambience.mp3",
        "zone_docks": "docks-ambience.mp3",
    };
    const newAudioSrc = audioMap[zone];

    if (newAudioSrc && window.audioElement.src !== newAudioSrc) {
        window.audioElement.pause(); // Pause current audio before switching sources
        window.audioElement.src = newAudioSrc;
        
        // Ensure the audio is ready before playing
        window.audioElement.oncanplaythrough = function() {
            playAudio();
        };
    }
}

// Function to play audio if not already playing
function playAudio() {
    if (!window.isPlaying) {
        window.audioElement.play().then(() => {
            window.isPlaying = true;
        }).catch(error => {
            console.warn("Playback interrupted:", error);
        });
    }
}

// Function to toggle play/mute
window.toggleAudio = function () {
    const button = document.getElementById("audio-toggle");
    if (window.audioElement.paused) {
        playAudio();
        button.textContent = "🔊"; // Unmute icon
    } else {
        window.audioElement.pause();
        window.isPlaying = false;
        button.textContent = "🔇"; // Mute icon
    }
};

// Function to adjust volume
window.adjustVolume = function (volume) {
    window.audioElement.volume = parseFloat(volume);
};