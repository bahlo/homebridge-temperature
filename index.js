var fs = require('fs');
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-temperature-file", "TemperatureFile", TemperatureFileAccessory);
}

function TemperatureFileAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.filePath = config["file_path"];

  this.service = new Service.TemperatureSensor(this.name);

	var c = this.service.getCharacteristic(Characteristic.CurrentTemperature);
	c.on('get', this.getState.bind(this));
	c.setProps({ minValue: -100 });
	c.setProps({ maxValue: 100 });
	c.setProps({format: Characteristic.Formats.FLOAT });
	c.setProps({minStep: 0.01 });
}

TemperatureFileAccessory.prototype.getState = function(callback) {
  fs.readFile(this.filePath, 'utf8', function(err, data) {
    if (err) {
      callback(err);
      return
    }

    callback(null, parseFloat(data))
  })
}

TemperatureFileAccessory.prototype.getServices = function() {
  return [this.service];
}
