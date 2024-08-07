/****************************************************
*                                                   *
*   obj_async.js                                    *
*                                                   *
*   ...                                             *
*                                                   *
*****************************************************/

class AsyncBluetoothObj {

    constructor() {
        this.device = null;
        this.onDisconnected = this.onDisconnected.bind(this);
    }
    
    async request() {
        let options = {
            "filters": [{
                "name": "BLUETOOTH OBJ"
            }],
            "optionalServices": [0xFF02]
        };
        this.device = await navigator.bluetooth.requestDevice(options);
        if (!this.device) {
            throw "No device selected";
        }
        this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
    }
    
    async connect() {
        if (!this.device) {
            return Promise.reject('Device is not connected.');
        }
        await this.device.gatt.connect();
    }
    
    async readColor() {
        const service = await this.device.gatt.getPrimaryService(0xFF02);
        const characteristic = await service.getCharacteristic(0xFFFC);
        await characteristic.readValue();
    }
  
    async writeColor(data) {
        const service = await this.device.gatt.getPrimaryService(0xFF02);
        const characteristic = await service.getCharacteristic(0xFFFC);
        await characteristic.writeValue(data);
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

