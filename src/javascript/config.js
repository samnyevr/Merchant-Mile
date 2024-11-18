State.prng.init();
Config.passages.nobr = false;


// Disable SugarCube sidebar entirely
Config.ui.stowBarInitially = true;  // Stow the sidebar on startup
UIBar.destroy(); // Permanently removes the sidebar from the game

/* twine-user-script #2: "Story JavaScript" */
Config.ui.stowBarInitially = false;