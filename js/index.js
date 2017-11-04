'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
   _inherits(App, _React$Component);

   function App(props) {
      _classCallCheck(this, App);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.state = { table: {},
         size: null,
         intervalId: null,
         speed: 500,
         generation: 0,
         tableWidth: null,
         cellWidth: null
      };
      _this.changeColor = _this.changeColor.bind(_this);
      _this.deadOrAlive = _this.deadOrAlive.bind(_this);
      _this.getDirections = _this.getDirections.bind(_this);
      _this.makeTable = _this.makeTable.bind(_this);
      _this.setInitPattern = _this.setInitPattern.bind(_this);
      _this.runGame = _this.runGame.bind(_this);
      _this.stopGame = _this.stopGame.bind(_this);
      _this.changeSpeed = _this.changeSpeed.bind(_this);
      _this.resumeGame = _this.resumeGame.bind(_this);
      _this.clear = _this.clear.bind(_this);
      _this.changeSize = _this.changeSize.bind(_this);
      return _this;
   }

   App.prototype.makeTable = function makeTable(size, clear) {
      var filter = 0.5;
      if (arguments[1] == 'clear') filter = 0;
      if (!Number.isInteger(size)) throw new Error('Table size must be an integer');
      var state = _extends({}, this.state);
      for (var i = 0; i < Math.pow(size, 2); i++) {
         state.table[i] = Math.random() < filter ? true : false;
      }
      this.setState({ state: state });
   };

   App.prototype.getDirections = function getDirections(cell) {
      var state = _extends({}, this.state);
      var size = this.state.size;
      var isLeftEdgeCell = cell % size == 0;
      var isRightEdgeCell = (cell + 1) % size == 0;
      return {
         nw: isLeftEdgeCell ? -1 : cell - size - 1,
         n: cell - size,
         ne: isRightEdgeCell ? -1 : cell - size + 1,
         w: isLeftEdgeCell ? -1 : cell - 1,
         e: isRightEdgeCell ? -1 : cell + 1,
         sw: isLeftEdgeCell ? -1 : cell + size - 1,
         s: cell + size,
         se: isRightEdgeCell ? -1 : cell + size + 1
      };
   };

   App.prototype.deadOrAlive = function deadOrAlive() {
      var _this2 = this;

      this.setState({ generation: this.state.generation + 1 });
      var state = _extends({}, this.state);
      var tableKeys = Object.keys(state.table);
      tableKeys = tableKeys.map(function (c, i) {
         var dir = _this2.getDirections(i);
         var numOfNeighbors = 0;
         if (state.table[dir.nw]) numOfNeighbors++;
         if (state.table[dir.n]) numOfNeighbors++;
         if (state.table[dir.ne]) numOfNeighbors++;
         if (state.table[dir.w]) numOfNeighbors++;
         if (state.table[dir.e]) numOfNeighbors++;
         if (state.table[dir.sw]) numOfNeighbors++;
         if (state.table[dir.s]) numOfNeighbors++;
         if (state.table[dir.se]) numOfNeighbors++;
         return numOfNeighbors;
      });
      tableKeys.forEach(function (key, i) {
         if (key > 3) state.table[i] = false;else if (key === 3) state.table[i] = true;else if (key === 2) state.table[i] = state.table[i] ? true : false;else if (key < 2) state.table[i] = false;
      });
      this.setState({ state: state });
   };

   App.prototype.runGame = function runGame(milSec) {
      var game = setInterval(this.deadOrAlive, milSec);
      this.setState({ intervalId: game });
   };

   App.prototype.resumeGame = function resumeGame() {
      this.runGame(this.state.speed);
   };

   App.prototype.stopGame = function stopGame() {
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: null });
   };

   App.prototype.clear = function clear() {
      this.stopGame();
      this.makeTable(this.state.size, 'clear');
   };

   App.prototype.changeSpeed = function changeSpeed(e) {
      this.setState({ speed: e.target.value });
      this.stopGame();
      this.runGame(this.state.speed);
   };

   App.prototype.changeSize = function changeSize(e) {
      this.setState({ size: Number(e.target.value) });
      this.setState({ tableWidth: this.state.cellWidth * e.target.value });
      this.stopGame();
      this.runGame(this.state.speed);
   };

   App.prototype.changeColor = function changeColor(e) {
      var table = _extends({}, this.state.table);
      var index = e.target.id;
      table[index] = table[index] ? false : true;
      this.setState({ table: table });
   };

   App.prototype.setInitPattern = function setInitPattern() {
      var _this3 = this;

      this.setState({ size: 25, cellWidth: 20 }, function () {
         _this3.makeTable(_this3.state.size);
         _this3.setState({ tableWidth: _this3.state.cellWidth * 25 });
      });
   };

   App.prototype.componentWillMount = function componentWillMount() {
      this.setInitPattern();
      this.runGame(this.state.speed);
   };

   App.prototype.render = function render() {
      return React.createElement(
         'div',
         { className: 'container' },
         React.createElement(Info, { generation: this.state.generation }),
         React.createElement(Table, { size: this.state.size, table: this.state.table, changeColor: this.changeColor, tableWidth: this.state.tableWidth }),
         React.createElement(Controls, { stopGame: this.stopGame, changeSpeed: this.changeSpeed, speed: this.state.speed, changeSize: this.changeSize, resumeGame: this.resumeGame, intervalId: this.state.intervalId, clear: this.clear, size: this.state.size })
      );
   };

   return App;
}(React.Component);

var Table = function Table(props) {
   var size = props.size;
   var table = props.table;
   function dummy(row) {
      var aspectRatio = 0;
      if (arguments[0] == 'row') aspectRatio = Math.ceil(size * (3 / 5));else aspectRatio = size;
      var dummy = new Array(aspectRatio);
      for (var i = 0; i < aspectRatio; i++) {
         dummy[i] = null;
      }return dummy;
   };
   return React.createElement(
      'div',
      { className: 'table', style: { width: props.tableWidth } },
      dummy('row').map(function (e, i) {
         var row = i;
         return React.createElement(
            'tr',
            null,
            dummy().map(function (e, i) {
               var id = row * size + i;
               return React.createElement('td', { id: id,
                  className: 'cell' + (table[id] ? ' active' : ''),
                  onClick: props.changeColor });
            })
         );
      })
   );
};

var Controls = function Controls(props) {
   return React.createElement(
      'div',
      { className: 'controls' },
      React.createElement(
         'button',
         { className: 'stop', type: 'button', onClick: props.intervalId ? props.stopGame : props.resumeGame },
         props.intervalId ? 'Stop' : 'Resume'
      ),
      ' ',
      React.createElement(
         'button',
         { className: 'clear', type: 'button', onClick: props.clear },
         'Clear'
      ),
      ' ',
      React.createElement('input', { className: 'speed', type: 'range', min: '1', max: '1000', value: props.speed, onChange: props.changeSpeed }),
      'Speed ',
      React.createElement(
         'select',
         { className: 'size', onChange: props.changeSize },
         React.createElement(
            'option',
            { value: '15' },
            'Size:15x9'
         ),
         React.createElement(
            'option',
            { value: '25', selected: true },
            'Size:25x15'
         ),
         React.createElement(
            'option',
            { value: '50' },
            'Size:50x30'
         )
      )
   );
};

var Info = function Info(props) {
   return React.createElement(
      'span',
      null,
      ' ',
      'Generation: ' + props.generation
   );
};

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));