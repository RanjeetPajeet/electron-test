/****************************************************
*                                                   *
*   bt/obj.js                                       *
*                                                   *
*   ...                                             *
*                                                   *
*****************************************************/

export class BluetoothObj {

    constructor() {
        this.device = null;
        this.onDisconnected = this.onDisconnected.bind(this);
    }

    request() {
        let options = {
            "filters": [{
                "name": "BLUETOOTH OBJ"
            }],
            "optionalServices": [0xFF02]
        };
        return navigator.bluetooth.requestDevice(options)
        .then(device => {
            this.device = device;
            this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
        });
    }

    connect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.connect();
    }

    readColor() {
        return this.device.gatt.getPrimaryService(0xFF02)
        .then(service => service.getCharacteristic(0xFFFC))
        .then(characteristic => characteristic.readValue());
    }

    writeColor(data) {
        return this.device.gatt.getPrimaryService(0xFF02)
        .then(service => service.getCharacteristic(0xFFFC))
        .then(characteristic => characteristic.writeValue(data));
    }

    disconnect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        return this.device.gatt.disconnect();
    }

    onDisconnected() {
        console.log('Device is disconnected.');
    }

}










