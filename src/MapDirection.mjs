export default {
  INVALID_DIRECTION: -1,
  DEFAULT_DIRECTION: 1,
  MAP_ORTHOGONAL_DIRECTIONS_COUNT: 4,
  MAP_CARDINAL_DIRECTIONS_COUNT: 4,
  MAP_INTER_CARDINAL_DIRECTIONS_COUNT: 8,
  MAP_INTER_CARDINAL_DIRECTIONS_HALF_COUNT: 4,
  EAST: 0,
  SOUTH_EAST: 1,
  SOUTH: 2,
  SOUTH_WEST: 3,
  WEST: 4,
  NORTH_WEST: 5,
  NORTH: 6,
  NORTH_EAST: 7,
  MAP_CARDINAL_DIRECTIONS: [0,2,4,6],
  MAP_ORTHOGONAL_DIRECTIONS: [1,3,5,7],
  MAP_DIRECTIONS: [0,1,2,3,4,5,6,7],
  isValidDirection(direction) {
    return direction >= 0 && direction <= 7;
  },
};