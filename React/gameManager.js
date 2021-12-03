var gameManager = {
  factory: {},
  entities: [],
  fireNum: 0,
  player: null,
  laterKill: [],
  ////////
  initPlayer: function (obj) {
    this.player = obj;
  },
  kill: function (obj) {
    this.laterKill.push(obj);
  },
  update: function (ctx) {
    if (!this.player) {
      return;
    }
    this.player.move_x = 0;
    this.player.move_y = 0;
    if (eventsManager.action["up"]) this.player.move_y = -1;
    if (eventsManager.action["down"]) this.player.move_y = 1;
    if (eventsManager.action["left"]) this.player.move_x = -1;
    if (eventsManager.action["right"]) this.player.move_x = 1;
    if (eventsManager.action["fire"]) this.player.fire();
    this.entities.forEach(function (e) {
      try {
        e.update();
      } catch (ex) {}
    });
    for (var i = 0; i < this.laterKill.length; i++) {
      var idx = this.entities.indexOf(this.laterKill[i]);
      if (idx > -1) this.entities.splice(idx, 1);
      ///////////
    }
    if (this.laterKill.length > 0)
      this.laterKill.length = 0;
    //////////////
    mapManager.draw(ctx);
    mapManager.centerAt(this.player.pos_x, this.player.pos_y);
    this.draw(ctx);
    //////////
  },
  draw: function (ctx) {
    for (var e = 0; e < this.entities.length; e++)
      this.entities[e].draw(ctx);
  },
  loadAll: function (ctx, mapName) {
    ///////////
    mapManager.loadMap(mapName);
    spriteManager.loadAtlas("path.json", "path.png"); ///////
    this.factory["A"] = A; //
    this.factory["S"] = S; //
    this.factory["D"] = D; //
    this.factory["F"] = F; //
    this.factory["G"] = G; //
    this.factory["H"] = H; //
    mapManager.parseEntities();
    mapManager.draw(ctx);
    eventsManager.setup(ctx.canvas);
  },
  play: function (ctx) {
    /////
  },
  stop: function () {
    //////
  },
};

