var Entity = {
  pos_x: 0, pos_y: 0,
  size_x: 0, size_y: 0,
  extend: function (extendProto) {
    var object = Object.create(this);
    for (let property in extendProto) {
      if (this.hasOwnProperty(property) || typeof object[property] === "undefined") {
        object[property] = extendProto[property];
      }
    }
    return object;
  },
};
var Player = Entity.extend({
  lifetime: 100,
  move_x: 0, move_y: 0,
  speed: 1,
  //////////
  draw: function (ctx) {
    spriteManager.drawSprite(ctx, "player", this.pos_x, this.pos_y //Check name
      ////////////
    );
  },
  update: function () {
    //////////////
  },
  onTouchEntity: function (obj) {
    ///////////////
  },
  kill: function () {
    gameManager.laterKill.push(this);
  },
  fire: function () {
    //////////
    var r = Object.create(Rocket);
    r.name = "rocket" + (++gameManager.fireNum);
    r.size_x = 32; //Size of tour pic
    r.size_y = 32; //Size of tour pic
    r.move_x = this.move_x;
    r.move_y = this.move_y;
    ///////////
    switch (this.move_x + 2 * this.move_y) {
      case -1: {
        r.pos_x = this.pos_x - r.size_x;
        r.pos_y = this.pos_y;
        break;
      }
      case 1: {
        r.pos_x = this.pos_x + this.size_x;
        r.pos_y = this.pos_y;
        break;
      }
      case -2: {
        r.pos_x = this.pos_x;
        r.pos_y = this.pos_y - r.size_y;
        break;
      }
      case 2: {
        r.pos_x = this.pos_x;
        r.pos_y = this.pos_y + this.size_y;
        break;
      }
    }
    gameManager.entities.push(r);
    ////////
  },
  damage: function (damage) {
    ////////////////
  },
});

var Tank = Entity.extend({
  lifetime: 100,
  move_x: 0, move_y: -1,
  speed: 1,
  //////////
  draw: function (ctx) {
    spriteManager.drawSprite(ctx, "tank_left_1", this.pos_x, this.pos_y //Check name
        ////////////
    );
  },
  update: function () {
    ////////////
  },
  onTouchEntity: function (obj) {
    ///////////
  },
  onTouchMap: function () {
    ///////////////
  },
  kill: function () {
    gameManager.laterKill.push(this);
  },
  fire: function () {
    ///////////////
  },
  damage: function (damage) {
    //////////////
  },
});
var Rocket = Entity.extend({
  move_x: 0, move_y: 0,
  speed: 4,
  ///////////////
  draw: function (ctx) {
    spriteManager.drawSprite(ctx, "rocket_up", this.pos_x, this.pos_y //Check name
        ////////////
    );
  },
  update: function () {
    //////////////////
  },
  onTouchEntity: function (obj) {
    //////////////
  },
  onTouchMap: function () {
    /////////
  },
  kill: function () {
    gameManager.laterKill.push(this);
  },
});
var Bonus = Entity.extend({
  ////////////
  draw: function (ctx) {
    spriteManager.drawSprite(ctx, "star", this.pos_x, this.pos_y); //Check name
  },
  kill: function () {
    gameManager.laterKill.push(this);
  },
  update: function () {},
});
