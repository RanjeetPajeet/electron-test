/****************************************************
*                                                   *
*   renderer.js                                     *
*                                                   *
*   ...                                             *
*                                                   *
****************************************************/

// import { BluetoothObj } from "./bt/obj.js";


const information = document.getElementById("info")
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const func = async () => {
    const response = await window.versions.ping()
    console.log(response)   // prints out 'pong'
}

func()



class BluetoothObj {

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



// const bluetoothObj = new BluetoothObj();
// document.querySelector('button').addEventListener('click', event => {
//     const bluetoothObj = new BluetoothObj();
//     bluetoothObj.request()
//     .then(_ => bluetoothObj.connect())
//     .then(_ => { /* Do something with bluetoothObj... */})
//     .catch(error => { console.log(error) });
// });


const asyncBluetoothObj = new AsyncBluetoothObj();
document.querySelector('button').addEventListener('click', async event => {
    try {
        await asyncBluetoothObj.request();
        await asyncBluetoothObj.connect();
        /* Do something with asyncBluetoothObj... */
        console.log("AsyncBluetoothObj requested and connected.");
    } catch(error) {
        console.log(error);
    }
});
