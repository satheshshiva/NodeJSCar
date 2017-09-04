var gpio = require('rpi-gpio');

var PIN_FR_POSITIVE = 16;
var PIN_FR_NEGATIVE = 18;
var PIN_FR_ENABLE   = 22;
gpio.setup(PIN_FR_POSITIVE, gpio.DIR_OUT);
gpio.setup(PIN_FR_NEGATIVE, gpio.DIR_OUT);
gpio.setup(PIN_FR_ENABLE, gpio.DIR_OUT);

function write() {
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}

function GpioWheelAdapter() {

    this.front      =   function() {
        gpio.write(PIN_FR_POSITIVE, false);
        gpio.write(PIN_FR_NEGATIVE, true);
    }
    this.back      =   function() {
        gpio.write(PIN_FR_POSITIVE, true);
        gpio.write(PIN_FR_NEGATIVE, false);
    }

    this.stop      =   function() {
        gpio.write(PIN_FR_POSITIVE, false);
        gpio.write(PIN_FR_NEGATIVE, false);
    }

    this.closePins  =   function() {
        gpio.destroy(function () {
            console.log('All pins unexported');
        });
    }
}

module.exports = new GpioWheelAdapter();