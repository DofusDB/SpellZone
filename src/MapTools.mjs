import MapDirection from './MapDirection.mjs';

const MapTools = {
  MAP_GRID_WIDTH: 14,
  MAP_GRID_HEIGHT: 20,
  MIN_Y_COORD: -19,
  MAX_Y_COORD: 13,
  MIN_X_COORD: 0,
  MAX_X_COORD: 33,
  COORDINATES_DIRECTION: [{x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0 , y: -1}, { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }],
  EVERY_CELLS: [],
  mapCountCell: 0,
  isValidCellId(cellId) {
    return cellId >= 0 && cellId < MapTools.mapCountCell;
  },
  getCellCoordById(cellId) {
    if (!MapTools.isValidCellId(cellId)) {
      return null;
    }
    var _loc2_= Math.floor(cellId / MapTools.MAP_GRID_WIDTH);
    var _loc3_ = Math.floor((_loc2_ + 1) / 2);
    var _loc4_ = _loc2_ - _loc3_;
    var _loc5_ = cellId - _loc2_ * MapTools.MAP_GRID_WIDTH;
    return { x: _loc3_ + _loc5_, y: _loc5_ - _loc4_ };
  },
  getCellIdByCoord(x, y) {
    return Math.floor((x - y) * MapTools.MAP_GRID_WIDTH + y + (x - y) / 2);
  },
  isValidCoord(x, y) {
    if(y >= -x && y <= x && y <= MapTools.MAP_GRID_WIDTH + MapTools.MAX_Y_COORD - x) {
      return y >= x - (MapTools.MAP_GRID_HEIGHT - MapTools.MIN_Y_COORD);
    }
    return false;
  },
  getLookDirection4ExactByCoord(x1, y1, x2, y2) {
    if (!MapTools.isValidCoord(x1, y1) || !MapTools.isValidCoord(x2, y2)) {
      return -1;
    }
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dy === 0) {
      if (dx < 0) {
        return 5;
      }
      return 1;
    }
    if (dx === 0) {
      if (dy < 0) {
        return 3;
      }
      return 7;
    }
    return -1;
  },
  getLookDirection4DiagExactByCoord(x1, y1, x2, y2) {
    if (!MapTools.isValidCoord(x1,y1) || !MapTools.isValidCoord(x2,y2)) {
      return -1;
    }
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === -dy) {
      if (dx < 0) {
        return 6;
      }
      return 2;
    }
    if (dx === dy) {
      if (dx < 0) {
        return 4;
      }
      return 0;
    }
    return -1;
  },
  getDistance(cellId1, cellId2) {
    if (!MapTools.isValidCellId(cellId1) || !MapTools.isValidCellId(cellId2)) {
      return -1;
    }
    const coord1 = MapTools.getCellCoordById(cellId1);
    const coord2 = MapTools.getCellCoordById(cellId2);
    return Math.floor(Math.abs(coord2.x - coord1.x) + Math.abs(coord2.y - coord1.y));
  },
  getLookDirection8ExactByCoord(x1, y1, x2, y2) {
    let direction = MapTools.getLookDirection4ExactByCoord(x1, y1, x2, y2);
    if (!MapDirection.isValidDirection(direction)) {
      direction = MapTools.getLookDirection4DiagExactByCoord(x1, y1, x2, y2);
    }
    return direction;
  },
  getNextCellByDirectionAndCoord(x, y, direction) {
    if (!MapTools.isValidCoord(x, y) || !MapDirection.isValidDirection(direction)) {
      return -1;
    }
    return MapTools.getCellIdByCoord(x + MapTools.COORDINATES_DIRECTION[direction].x, y + MapTools.COORDINATES_DIRECTION[direction].y);
  },
  getNextCellByDirection(cellId, direction) {
    const coord = MapTools.getCellCoordById(cellId);
    if (!coord) {
      return -1;
    }
    return MapTools.getNextCellByDirectionAndCoord(coord.x, coord.y, direction);
  }
};

MapTools.mapCountCell = MapTools.MAP_GRID_WIDTH * MapTools.MAP_GRID_HEIGHT * 2;
for (let i = 0; i < MapTools.mapCountCell; i += 1) {
  MapTools.EVERY_CELLS.push(i);
}


export default MapTools;