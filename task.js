/**
 * Создает экземпляр космического корабля.
 * @name Vessel
 * @param {String} name Название корабля.
 * @param {Number}[] position Местоположение корабля.
 * @param {Number} capacity Грузоподъемность корабля.
 */
function Vessel(name, position, capacity) {
	this.name = name;
	this.position = position;
	this.capacity = capacity;
	this.loading = 0;
	this.onPlanet = null;
}

/**
 * Выводит текущее состояние корабля: имя, местоположение, доступную грузоподъемность.
 * @example
 * vessel.report(); // Грузовой корабль. Местоположение: Земля. Товаров нет.
 * @example
 * vessel.report(); // Грузовой корабль. Местоположение: 50,20. Груз: 200т.
 * @name Vessel.report
 */
Vessel.prototype.report = function () {
	var state = [];
	state.push('Корабль "' + this.name + '"');
	state.push('Местоположение: ' + (this.onPlanet !== null ? 'Планета "' + this.onPlanet + '"' : this.position));
	state.push(!this.getOccupiedSpace() ? 'Товаров нет.' : 'Занято: ' + this.getOccupiedSpace() + 'т. из ' + this.capacity + 'т.');
	console.log(state.join('. '))
}

/**
 * Выводит количество свободного места на корабле.
 * @name Vessel.getFreeSpace
 */
Vessel.prototype.getFreeSpace = function () {
	return this.capacity - this.loading;
}

/**
 * Выводит количество занятого места на корабле.
 * @name Vessel.getOccupiedSpace
 */
Vessel.prototype.getOccupiedSpace = function () {
	return this.loading;
}

/**
 * Переносит корабль в указанную точку.
 * @param {Number}[]|Planet newPosition Новое местоположение корабля.
 * @example
 * vessel.flyTo([1,1]);
 * @example
 * var earth = new Planet('Земля', [1,1]);
 * vessel.flyTo(earth);
 * @name Vessel.report
 */
Vessel.prototype.flyTo = function (newPosition) {
	if(newPosition instanceof Planet) {
		this.position = newPosition.position;
		this.onPlanet = newPosition.name;
	} else {
		this.position = newPosition;
		this.onPlanet = null;
	}
}

/**
 * Создает экземпляр планеты.
 * @name Planet
 * @param {String} name Название Планеты.
 * @param {Number}[] position Местоположение планеты.
 * @param {Number} availableAmountOfCargo Доступное количество груза.
 */
function Planet(name, position, availableAmountOfCargo) {
	this.name = name;
	this.position = position;
	this.availableAmountOfCargo = availableAmountOfCargo;
}

/**
 * Выводит текущее состояние планеты: имя, местоположение, количество доступного груза.
 * @name Planet.report
 */
Planet.prototype.report = function () {
	var state = [];
	state.push('Планета "' + this.name + '"');
	state.push('Местоположение: ' + this.position);
	state.push(!this.getAvailableAmountOfCargo() ? 'Грузов нет.' : 'Доступно груза: ' + this.getAvailableAmountOfCargo() + 'т.');
	console.log(state.join('. '))
}

/**
 * Возвращает доступное количество груза планеты.
 * @name Vessel.getAvailableAmountOfCargo
 */
Planet.prototype.getAvailableAmountOfCargo = function () {
	return this.availableAmountOfCargo;
}

/**
 * Загружает на корабль заданное количество груза.
 * 
 * Перед загрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Загружаемый корабль.
 * @param {Number} cargoWeight Вес загружаемого груза.
 * @name Vessel.loadCargoTo
 */
Planet.prototype.loadCargoTo = function (vessel, cargoWeight) {
	if (vessel.position[0] !== this.position[0] && vessel.position[1] !== this.position[1]) {
		console.log('Корабль "' + vessel.name +  '" ещё не сел.');
		return;
	};

	var weight = cargoWeight,
		pAmount = this.getAvailableAmountOfCargo(),
		vFreeSpace = vessel.getFreeSpace();

	if(weight > pAmount) {
		// Нужно ли выгружать с планеты сколько сможем?
		console.log('На планете "' + this.name + '" нет ' + weight + 'т.' + (!pAmount ? '' : ' Будет выгружено: ' + pAmount + 'т.'));
		if(!pAmount) return;
		weight = pAmount;
	}

	if (weight > vFreeSpace) {
		// Нужно ли загружать на корабль сколько сможем?
		console.log('На корабле "' + vessel.name + '" нет места для ' + weight + 'т.' + (!vFreeSpace ? '' : ' Будет загружено: ' + vFreeSpace + 'т.'));
		if(!vFreeSpace) return;
		weight = vFreeSpace;
	}

	vessel.loading += weight;
	this.availableAmountOfCargo -= weight;
}

/**
 * Выгружает с корабля заданное количество груза.
 * 
 * Перед выгрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Разгружаемый корабль.
 * @param {Number} cargoWeight Вес выгружаемого груза.
 * @name Vessel.unloadCargoFrom
 */
Planet.prototype.unloadCargoFrom = function (vessel, cargoWeight) {
	var weight = cargoWeight,
		vSpace = vessel.getOccupiedSpace();

	if(weight > vSpace) {
		// Нужно ли выгружать с корабля сколько сможем?
		console.log('На корабле "' + vessel.name + '" нет ' + weight +'т.' + (!vSpace ? '' : ' Будет выгружено: ' + vSpace + 'т.'));
		if(!vSpace) return;
		weight = vSpace;
	}
	
	vessel.loading -= weight;
	this.availableAmountOfCargo += weight;
}