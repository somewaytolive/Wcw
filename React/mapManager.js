var mapManager = {
  mapData: null,
  tLayer: null,
  xCount: 0,
  yCount: 0,
  tSize: { x: 64, y: 64 }, //Check pixels
  mapSize: { x: 64, y: 64}, //Check pixels
  tilesets: new Array(),
  imgLoadCount: 0,
  imgLoaded: false,
  jsonLoaded: false,
  view: { x: 0, y: 0, w: 400, h: 400 },
  loadMap: function (path) {
    /////////////
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        mapManager.parseMap(request.responseText);
      }
    };
    request.open("GET", path, true);
    request.send();
  },
  parseMap: function (tilesJSON) {
    this.mapData = JSON.parse(tilesJSON);
    this.xCount = this.mapData.width;
    this.yCount = this.mapData.height;
    this.tSize.x = this.mapData.tilewidth;
    this.tSize.y = this.mapData.tileheight;
    this.mapSize.x = this.xCount * this.tSize.x;
    this.mapSize.y = this.yCount * this.tSize.y;
    /////////////
    for (var i = 0; i < this.mapData.tilesets.length; i++) {
      var img = new Image();
      img.onload = function () {
        mapManager.imgLoadCount++;
        if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
          mapManager.imgLoaded = true;
        }
      };
      img.src = this.mapData.tilesets[i].image;
      var t = this.mapData.tilesets[i];
      var ts = {
        firstgid: t.firstgid,
        image: img,
        name: t.name,
        xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
        yCount: Math.floor(t.imageheight / mapManager.tSize.y),
      };
      this.tilesets.push(ts);
    }
    this.jsonLoaded = true;
  },
  draw: function (ctx) {
    if (!this.imgLoaded || !this.jsonLoaded) {
      setTimeout(function () {mapManager.draw(ctx);}, 100);
    } else {
      if (this.tLayer === null) {
        for (var id = 0; id < this.mapData.layers.length; id++) {
          var layer = this.mapData.layers[id];
          if (layer.type === "tilelayer") {
            this.tLayer = layer;
            break;
          }
        }
      }
      for (var i = 0; i < this.tLayer.data.length; i++) {
        if (this.tLayer.data[i] !== 0) {
          var tile = this.getTile(this.tLayer.data[i]);
          var pX = (i % this.xCount) * this.tSize.x;
          var pY = Math.floor(i / this.xCount) * this.tSize.y;
          //////////////////
          ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
        }
      }
    }
  },
  getTile: function (tileIndex) {
    var tile = {
      img: null,
      px: 0, py: 0,
    };
    var tileset = this.getTileset(tileIndex);
    tile.img = tileset.image;
    var id = tileIndex - tileset.firstgid;
    var x = id % tileset.xCount;
    var y = Math.floor(id / tileset.xCount);
    tile.px = x * mapManager.tSize.x;
    tile.py = y * mapManager.tSize.y;
    return tile;
  },
  getTileset(tileIndex) {
    for (var i = mapManager.tilesets.length - 1; i >= 0; i--) {
      if (mapManager.tilesets[i].firstgid <= tileIndex)
        return mapManager.tilesets[i];
    }
    return null;
  },
  isVisible: function (x, y, width, height) {
    if (x + width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h)
      return false;
    return true;
  },
  parseEntities: function () {
    if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
      setTimeout(function () {mapManager.parseEntities();}, 100);
    } else
      for (var j = 0; j < this.mapData.layers.length; j++) {
        if (this.mapData.layers[j].type === "objectgroup") {
          var entities = this.mapData.layers[j];
          for (var i = 0; i < entities.objects.length; i++) {
            var e = entities.objects[i];
            try {
              var obj = Object.create(gameManager.factory[e.type]);
              obj.name = e.name;
              obj.pos_x = e.x;
              obj.pos_y = e.y;
              obj.size_x = e.width;
              obj.size_y = e.height;
              //////////
              gameManager.entities.push(obj);
              if (obj.name === "player") //Check name
                gameManager.initPlayer(obj);
            } catch (ex) {
              console.log("Error while creating: [" + e.gid + "] " + e.type + ", " + ex);
            }
          }
        }
    }
  },

  // блок по координатам на карте
  getTilesetIdx: function (x, y) {
    let wX = x;
    let wY = y;
    let idx =
      Math.floor(wY / this.tSize.y) * this.xCount +
      Math.floor(wX / this.tSize.x);
    return this.tLayer.data[idx];
  },
  centerAt: function (x, y) {
    if (x < this.view.w / 2)
      this.view.x = 0;
    else if (x > this.mapSize.x - this.view.w / 2)
      this.view.x = this.mapSize.x - this.view.w;
    else
      this.view.x = x - this.view.w / 2;
    if (y < this.view.h / 2)
      this.view.y = 0;
    else if (y > this.mapSize.y - this.view.h / 2)
      this.view.y = this.mapSize.y - this.view.h;
    else
      this.view.y = y - this.view.h / 2;
  },
};
