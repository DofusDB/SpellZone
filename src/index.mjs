import MapDirection from './MapDirection.mjs';
import MapTools from './MapTools.mjs';

export default class SpellZone {
  static DEFAULT_RADIUS = 1;
  static DEFAULT_MIN_RADIUS = 0;
  static DEFAULT_DEGRESSION = 10;
  static DEFAULT_MAX_REGRESSION_TICKS = 4;
  static GLOBAL_RADIUS = 63;
  static MAX_RADIUS_DEGRESSION = 50;

  constructor() {
    this.shape = 'P';
    this.radius = SpellZone.DEFAULT_RADIUS;
    this.maxDegressionTicks = SpellZone.DEFAULT_MAX_REGRESSION_TICKS;
    this.degression = SpellZone.DEFAULT_DEGRESSION;
    this.minRadius = SpellZone.DEFAULT_MIN_RADIUS;
  }

  static fromRawZone(param1) {
    if (!param1) {
      param1 = "P";
    }
    const zone = new SpellZone();
    zone.shape = param1.charAt(0);
    const params = param1.substr(1).split(",").filter((s) => s.length);

    let _loc4_ = false;
    if (zone.shape === ';') {
      const cells = [];
      params.forEach((e) => {
        if (e.length) {
          cells.push(parseInt(e));
        }
      });
      zone.getCells = () => cells;
      return zone;
    }

    if (zone.shape === 'l') {
      const tmp = params[0]; // swap args
      params[0] = params[1];
      params[1] = tmp;
    }

    if (params.length) {
      zone.radius = parseInt(params[0]);
    }
    if (SpellZone.hasMinSize(zone.shape)) {
      if (params.length > 1) {
        zone.minRadius = parseInt(params[1]);
      }
      if (params.length > 2) {
        zone.degression = parseInt(params[2]);
      }
    } else {
      if (params.length > 1) {
        zone.degression = parseInt(params[1]);
      }
      if (params.length > 2) {
        zone.maxDegressionTicks = parseInt(params[2]);
      }
    }
    if (params.length > 3) {
      zone.maxDegressionTicks = parseInt(params[3]);
    }
    if (params.length > 4) {
      _loc4_ = parseInt(params[4]);
    }

    if (zone.shape === ' ') {
      zone.getCells = () => [];
    } else if (zone.shape === '#') {
      zone.getCells = (p1, p2) => SpellZone.fillCrossCells(zone, MapDirection.MAP_CARDINAL_DIRECTIONS, true, p1, p2);
    } else if (zone.shape === '*') {
      zone.getCells = (p1, p2) => SpellZone.fillCrossCells(zone, MapDirection.MAP_DIRECTIONS, false, p1, p2);
    } else if (zone.shape === '+') {
      zone.getCells = (p1, p2) => SpellZone.fillCrossCells(zone, MapDirection.MAP_CARDINAL_DIRECTIONS, false, p1, p2);
    } else if (zone.shape === '-') {
      zone.getCells = (p1, p2) => SpellZone.fillPerpLineCells(zone, p1, p2);
    } else if (zone.shape === '/') {
      zone.getCells = (p1, p2) => SpellZone.fillLineCells(zone, _loc4_, false, p1, p2);
    } else if (zone.shape === 'B') {
      zone.getCells = (p1, p2) => SpellZone.fillBoomerang(zone, p1, p2);
    } else if (zone.shape === 'C') {
      zone.getCells = (p1, p2) => SpellZone.fillCircleCells(zone, p1, p2);
    } else if (zone.shape === 'D') {
      zone.getCells = (p1, p2) => SpellZone.fillCheckerboard(zone, p1, p2);
    } else if (zone.shape === 'F') {
      zone.getCells = (p1, p2) => SpellZone.fillForkCells(zone, p1, p2);
    } else if (zone.shape === 'G') {
      zone.getCells = (p1, p2) => SpellZone.fillSquareCells(zone, false, p1, p2);
    } else if (zone.shape === 'I') {
      zone.minRadius = zone.radius;
      zone.radius = SpellZone.GLOBAL_RADIUS;
      zone.getCells = (p1, p2) => SpellZone.fillCircleCells(zone, p1, p2);
    } else if (zone.shape === 'L') {
      zone.getCells = (p1, p2) => SpellZone.fillLineCells(zone, _loc4_, false, p1, p2);
    } else if (zone.shape === 'O') {
      zone.minRadius = zone.radius;
      zone.getCells = (p1, p2) => SpellZone.fillCircleCells(zone, p1, p2);
    } else if (zone.shape === 'Q') {
      zone.getCells = (p1, p2) => SpellZone.fillCrossCells(zone, MapDirection.MAP_ORTHOGONAL_DIRECTIONS, true, p1, p2);
    } else if (zone.shape === 'R') {
      zone.getCells = (p1, p2) => SpellZone.fillRectangleCells(zone, p1, p2);
    } else if (zone.shape === 'T') {
      zone.getCells = (p1, p2) => SpellZone.fillPerpLineCells(zone, p1, p2);
    } else if (zone.shape === 'U') {
      zone.getCells = (p1, p2) => SpellZone.fillHalfCircle(zone, p1, p2);
    } else if (zone.shape === 'V') {
      zone.getCells = (p1, p2) => SpellZone.fillConeCells(zone, p1, p2);
    } else if (zone.shape === 'W') {
      zone.getCells = (p1, p2) => SpellZone.fillSquareCells(zone, true, p1, p2);
    } else if (zone.shape === 'X') {
      zone.getCells = (p1, p2) => SpellZone.fillCrossCells(zone, MapDirection.MAP_ORTHOGONAL_DIRECTIONS, false, p1, p2);
    } else if (zone.shape === 'Z') {
      zone.getCells = (p1, p2) => SpellZone.fillReversedTrueCircleCells(zone, p1, p2);
    } else if (zone.shape === 'l') {
      zone.getCells = (p1, p2) => SpellZone.fillLineCells(zone, _loc4_, true, p1, p2);
    } else if (zone.shape === 'a' || zone.shape === 'A') {
      zone.getCells = () => MapTools.EVERY_CELLS;
    } else { // P is default
      zone.shape = 'P';
      zone.radius = 0;
      zone.getCells = (p1) => [p1];
    }
    return zone;
  }

  static hasMinSize(shape) {
    return ['#+CQRXl'].includes(shape);
  }

  static fillCircleCells(zone, cell) {
    const coord = MapTools.getCellCoordById(cell);
    const cells = [];

    let i = -zone.radius;
    while (i < zone.radius + 1) {
      let j = -zone.radius;
      while (j < zone.radius + 1) {
        if (MapTools.isValidCoord(coord.x + i, coord.y + j)
            && Math.abs(i) + Math.abs(j) <= zone.radius
            && Math.abs(i) + Math.abs(j) >= zone.minRadius) {
          cells.push(MapTools.getCellIdByCoord(coord.x + i, coord.y + j));
        }
        j += 1;
      }
      i += 1;
    }
    return cells;
  }

  static fillCheckerboard(zone, cell) {
    const coord = MapTools.getCellCoordById(cell);
    const cells = [];
    const isPair = zone.radius % 2 === 0;

    let i = -zone.radius;
    while (i < zone.radius + 1) {
      let j = -zone.radius;
      while (j < zone.radius + 1) {
        if (MapTools.isValidCoord(coord.x + i, coord.y + j)
          && Math.abs(i) + Math.abs(j) <= zone.radius
          && Math.abs(i) + Math.abs(j) >= zone.minRadius
            && ((isPair && (i + (j % 2)) % 2 === 0) || (!isPair && (i + 1 + (j % 2)) % 2 === 0))
        ) {
          cells.push(MapTools.getCellIdByCoord(coord.x + i, coord.y + j));
        }
        j += 1;
      }
      i += 1;
    }
    return cells;
  }

  static fillLineCells(zone, stopAtTarget, fromCaster, cell, playerCell) {
    const cells = [];
    let cellToTest = fromCaster ? playerCell : cell;
    let maxRadius = fromCaster ? zone.radius + zone.minRadius - 1 : zone.radius;
    const coordP5 = MapTools.getCellCoordById(playerCell)
    const coordCell = MapTools.getCellCoordById(cell)
    const direction = MapTools.getLookDirection8ExactByCoord(coordP5.x, coordP5.y,coordCell.x,coordCell.y);

    if (fromCaster && stopAtTarget) {
      const distance = MapTools.getDistance(playerCell,cell);
      if (distance < maxRadius) {
        maxRadius = distance;
      }
    }
    for (let i = 0; i < zone.minRadius; i += 1) {
      cellToTest = MapTools.getNextCellByDirection(cellToTest, direction);
    }
    for (let i = zone.minRadius; i < maxRadius + 1; i += 1) {
      if (MapTools.isValidCellId(cellToTest)) {
        cells.push(cellToTest);
      }
      cellToTest = MapTools.getNextCellByDirection(cellToTest, direction);
    }
    return cells;
  }

  static fillCrossCells(zone, directions, noCenter, cell) {
    const cells = [];
    let minRadius = zone.minRadius;

    if (zone.minRadius === 0) {
      minRadius = 1;
      if (!noCenter) {
        cells.push(cell);
      }
    }

    const lastCellsByDirections = [];
    for (let i = 0; i < directions.length; i += 1) {
      lastCellsByDirections.push(cell);
    }
    for (let i = 1; i < zone.radius + 1; i += 1) {
      for (let j = 0; j < directions.length; j += 1) {
        lastCellsByDirections[j] = MapTools.getNextCellByDirection(lastCellsByDirections[j], directions[j]);
        if (i >= minRadius && MapTools.isValidCellId(lastCellsByDirections[j])) {
          cells.push(lastCellsByDirections[j]);
        }
      }
    }
    return cells;
  }

  static fillPerpLineCells(zone, cell, playerCell) {
    const cells = [];
    const playerCoord = MapTools.getCellCoordById(playerCell);
    const cellCoord = MapTools.getCellCoordById(cell);
    const playerDirection = MapTools.getLookDirection8ExactByCoord(playerCoord.x,playerCoord.y,cellCoord.x, cellCoord.y);
    const perpLineDirection1 = (playerDirection + 2) % 8;
    const perpLineDirection2 = (playerDirection - 2 + 8) % 8;

    let minRadius = zone.minRadius;
    if (zone.minRadius === 0) {
      minRadius = 1;
      if (MapTools.isValidCellId(cell)) {
        cells.push(cell);
      }
    }
    let perpLineCell1 = cell;
    let perpLineCell2 = cell;
    for (let i = minRadius; i < zone.radius + 1; i += 1) {
      perpLineCell1 = MapTools.getNextCellByDirection(perpLineCell1, perpLineDirection1);
      perpLineCell2 = MapTools.getNextCellByDirection(perpLineCell2, perpLineDirection2);
      if (MapTools.isValidCellId(perpLineCell1)) {
        cells.push(perpLineCell1);
      }
      if (MapTools.isValidCellId(perpLineCell2)) {
        cells.push(perpLineCell2);
      }
    }
    return cells;
  }

  static fillBoomerang(zone, cell, playerCell) {
    const cells = [];
    const playerCoord = MapTools.getCellCoordById(playerCell);
    const cellCoord = MapTools.getCellCoordById(cell);
    const playerDirection = MapTools.getLookDirection8ExactByCoord(playerCoord.x,playerCoord.y,cellCoord.x, cellCoord.y);
    const directionPerp1 = (playerDirection + 2) % 8;
    const directionEnd1 = (playerDirection + 3) % 8;
    const directionPerp2 = (playerDirection - 2 + 8) % 8;
    const directionEnd2 = (playerDirection - 3 + 8) % 8;

    let  minRadius = zone.minRadius;
    if (zone.minRadius === 0) {
      minRadius = 1;
      cells.push(cell);
    }

    let temporaryCell1 = cell;
    let temporaryCell2 = cell;
    for (let i = minRadius; i < zone.radius; i += 1) {
      temporaryCell1 = MapTools.getNextCellByDirection(temporaryCell1, directionPerp1);
      temporaryCell2 = MapTools.getNextCellByDirection(temporaryCell2, directionPerp2);
      if(MapTools.isValidCellId(temporaryCell1)) {
        cells.push(temporaryCell1);
      }
      if(MapTools.isValidCellId(temporaryCell2)) {
        cells.push(temporaryCell2);
      }
    }
    if(zone.radius !== 0) {
      temporaryCell1 = MapTools.getNextCellByDirection(temporaryCell1, directionEnd1);
      temporaryCell2 = MapTools.getNextCellByDirection(temporaryCell2, directionEnd2);
      if(MapTools.isValidCellId(temporaryCell1)) {
        cells.push(temporaryCell1);
      }
      if(MapTools.isValidCellId(temporaryCell2)) {
        cells.push(temporaryCell2);
      }
    }
    return cells;
  }

  static fillForkCells(zone, cell, playerCell) {
    const cells = [];
    const playerCoord = MapTools.getCellCoordById(playerCell);
    const cellCoord = MapTools.getCellCoordById(cell);
    const playerDirection = MapTools.getLookDirection8ExactByCoord(playerCoord.x, playerCoord.y, cellCoord.x, cellCoord.y);
    const _loc21_ = playerDirection === 5 || playerDirection === 3 ? -1 : 1;
    const _loc22_ = playerDirection === 5 || playerDirection === 1;

    if (MapTools.isValidCoord(cellCoord.x, cellCoord.y)) {
      cells.push(MapTools.getCellIdByCoord(cellCoord.x, cellCoord.y));
    }
    for (let i = 1; i < zone.radius + 1; i += 1) {
      let x = 0;
      let y = 0;

      if (_loc22_) {
        x = cellCoord.x + i * _loc21_;
        y = cellCoord.y + -1 * i;
      } else {
        x = cellCoord.x + -1 * i;
        y = cellCoord.y + i * _loc21_;
      }
      if (MapTools.isValidCoord(x, y)) {
        cells.push(MapTools.getCellIdByCoord(x, y));
      }

      if (_loc22_) {
        x = cellCoord.x + i * _loc21_;
        y = cellCoord.y;
      } else {
        x = cellCoord.x;
        y = cellCoord.y + i * _loc21_;
      }
      if (MapTools.isValidCoord(x, y)) {
        cells.push(MapTools.getCellIdByCoord(x, y));
      }

      if (_loc22_) {
        x = cellCoord.x + i * _loc21_;
        y = cellCoord.y + i;
      } else {
        x = cellCoord.x + i;
        y = cellCoord.y + i * _loc21_;
      }
      if (MapTools.isValidCoord(x, y)) {
        cells.push(MapTools.getCellIdByCoord(x, y));
      }
    }
    return cells;
  }

  static fillSquareCells(zone, removeDiagonals, cell) {
    const cells = [];
    const coord = MapTools.getCellCoordById(cell);

    for (let i = -zone.radius; i < zone.radius + 1; i += 1) {
      for (let j = -zone.radius; j < zone.radius + 1; j += 1) {
        if (MapTools.isValidCoord(coord.x + i,coord.y + j)
          && (!removeDiagonals || Math.abs(i) !== Math.abs(j))) {
          cells.push(MapTools.getCellIdByCoord(coord.x + i,coord.y + j));
        }
      }
    }
    return cells;
  }

  static fillRectangleCells(zone, cell, playerCell) {
    if (zone.radius < 1) {
      zone.radius = 1;
    }
    if (zone.minRadius < 1) {
      zone.minRadius = 1;
    }
    const cells = [];
    const playerCoord = MapTools.getCellCoordById(playerCell);
    const cellCoord = MapTools.getCellCoordById(cell);
    const playerDirection = MapTools.getLookDirection8ExactByCoord(playerCoord.x, playerCoord.y,cellCoord.x, cellCoord.y);
    const _loc21_ = playerDirection === 5 || playerDirection === 3 ? -1 : 1;
    const _loc22_ = playerDirection === 7 || playerDirection === 3;

    const _loc23_ = 1 + zone.radius * 2;
    for (let i = 0; i < zone.minRadius + 1; i += 1) {
      for (let j = 0; j < _loc23_; j += 1) {
        let x = 0;
        let y = 0;

        if (_loc22_) {
          x = cellCoord.x + j - Math.floor(_loc23_ / 2);
          y = cellCoord.y + i * _loc21_;
        } else {
          x = cellCoord.x + i * _loc21_;
          y = cellCoord.y + j - Math.floor(_loc23_ / 2);
        }

        if (MapTools.isValidCoord(x, y)) {
          cells.push(MapTools.getCellIdByCoord(x, y));
        }
      }
    }
    return cells;
  }

  static fillHalfCircle(zone, cell, playerCell) {
    const cells = [];
    const playerCoord = MapTools.getCellCoordById(playerCell);
    const cellCoord = MapTools.getCellCoordById(cell);
    const playerDirection = MapTools.getLookDirection8ExactByCoord(playerCoord.x, playerCoord.y,cellCoord.x, cellCoord.y);
    const direction1 = (playerDirection + 3) % 8;
    const direction2 = (playerDirection - 3 + 8) % 8;
    let minRadius = zone.minRadius;

    if (zone.minRadius === 0) {
      minRadius = 1;
      cells.push(cell);
    }

    let nextCellDirection1 = cell;
    let nextCellDirection2 = cell;
    for (let i = minRadius; i < zone.radius + 1; i += 1) {
      nextCellDirection1 = MapTools.getNextCellByDirection(nextCellDirection1, direction1);
      nextCellDirection2 = MapTools.getNextCellByDirection(nextCellDirection2, direction2);
      if (MapTools.isValidCellId(nextCellDirection1)) {
        cells.push(nextCellDirection1);
      }
      if (MapTools.isValidCellId(nextCellDirection2)) {
        cells.push(nextCellDirection2);
      }
    }
    return cells;
  }

  static fillConeCells(zone, cell, playerCell) {
    const cells = [];
    const playerCoord = MapTools.getCellCoordById(playerCell);
    const cellCoord = MapTools.getCellCoordById(cell);
    const playerDirection = MapTools.getLookDirection8ExactByCoord(playerCoord.x, playerCoord.y,cellCoord.x, cellCoord.y);
    const direction1 = (playerDirection + 2) % 8;
    const direction2 = (playerDirection - 2 + 8) % 8;

    let nextCellInPlayerDirection = cell;
    for (let i = 0; i < zone.radius + 1; i += 1) {
      cells.push(nextCellInPlayerDirection);
      let nextCellInDirection1 = nextCellInPlayerDirection;
      let nextCellInDirection2 = nextCellInPlayerDirection;

      for (let j = 0; j < i; j += 1) {
        nextCellInDirection1 = MapTools.getNextCellByDirection(nextCellInDirection1, direction1);
        if (MapTools.isValidCellId(nextCellInDirection1)) {
          cells.push(nextCellInDirection1);
        }
        nextCellInDirection2 = MapTools.getNextCellByDirection(nextCellInDirection2, direction2);
        if (MapTools.isValidCellId(nextCellInDirection2)) {
          cells.push(nextCellInDirection2);
        }
      }
      nextCellInPlayerDirection = MapTools.getNextCellByDirection(nextCellInPlayerDirection, playerDirection);
    }
    return cells;
  }

  static fillReversedTrueCircleCells(zone, cell) {
    const cells = [];
    const cellCoord = MapTools.getCellCoordById(cell);

    for (let i = 0; i < MapTools.mapCountCell; i += 1) {
      const newCellCoord = MapTools.getCellCoordById(i);
      const distances = { x: newCellCoord.x - cellCoord.x, y: newCellCoord.y - cellCoord.y };
      if (Math.sqrt(distances.x * distances.x + distances.y * distances.y) >= zone.radius) {
        cells.push(i);
      }
    }
    return cells;
  }
}
