const bluetooth = function () {
    this.init();
    this.deviceId = "2522503F-442C-CDA6-4469-09D391E93C40";
    this.services = [];
    this.characteristics = [];
}
bluetooth.prototype = {
    init () {
        this.openBluetoothAdapter()
    },
    openBluetoothAdapter () {//初始化蓝牙模块
        let that = this
        wx.openBluetoothAdapter({
            success (res) {//成功回调
                that.startBluetoothDevicesDiscovery()
            },
            fail () {
                wx.showModal({
                    title: '提示',
                    content: '请检查手机蓝牙是否打开'
                })
            }
        })
    },
    startBluetoothDevicesDiscovery () {//开始搜索设备
        let that = this
        wx.startBluetoothDevicesDiscovery({
            // services: ['FEE7'],
            success (res) {
                that.getBluetoothDevices()
            }
        })
    },
    getBluetoothDevices () {// 获取搜索到的设备
        let that = this;
        wx.getBluetoothDevices({
            success: function (res) {
                for (var i =0;i<res.devices.length;i++){
                    if(res.devices[i].localName === 'Feasycom'){
                        console.log(res.devices[i])
                        that.deviceId = res.devices[i].deviceId
                        that.services = res.devices[i].advertisServiceUUIDs[0]
                    }
                }
                that.createBLEConnection()
            }
        })
    },
    createBLEConnection () { // 链接一个蓝牙
        let that = this
        wx.createBLEConnection({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId:that.deviceId,
            success (res) {
                console.log(res)
                that.getBLEDeviceServices()
            }
        })
    },
    getBLEDeviceServices () {
        let that = this
        wx.getBLEDeviceServices({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId:that.deviceId,
            success (res) {
                console.log(res.services)
                that.services = res.services
                that.getBLEDeviceCharacteristics()
            }
        })
    },
    getBLEDeviceCharacteristics () {
        let that =this
        wx.getBLEDeviceCharacteristics({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId:that.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId:that.services[0].uuid,
            success (res) {
                console.log(res.characteristics)
                that.characteristics = res.characteristics;
                that.notifyBLECharacteristicValueChange();
                that.writeBLECharacteristicValue()
            }
        })
    },

    notifyBLECharacteristicValueChange () {
        let that = this;
        wx.notifyBLECharacteristicValueChange({
            state: true, // 启用 notify 功能
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId:that.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId:that.services[0].uuid,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId:that.characteristics[0].uuid,
            success (res) {
                console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                wx.onBLECharacteristicValueChange(function(res) {
                    console.log('characteristic value comed:', res)
                    console.log(that.ab2hex(res.value))
                })
            },
            complete (res) {
                // console.log(res)
            }
        })
    },
    writeBLECharacteristicValue () {
        let that = this;
        let buffer = new ArrayBuffer(1)
        let dataView = new DataView(buffer)
        dataView.setUint8(0, 0)

        wx.writeBLECharacteristicValue({
            // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId:that.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId:that.services[0].uuid,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId:that.characteristics[1].uuid,
            // 这里的value是ArrayBuffer类型
            value: buffer,
            success (res) {
                console.log('writeBLECharacteristicValue success', res.errMsg)
            }
        })
    },
    readBLECharacteristicValue () {
        let that = this
        wx.readBLECharacteristicValue({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId:that.deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId:that.services[0].uuid,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId:that.characteristics[0].uuid,
            success (res) {
                console.log('readBLECharacteristicValue:', res.errCode)
                that.notifyBLECharacteristicValueChange(function(){
                    wx.onBLECharacteristicValueChange(function(characteristic) {
                        console.log('characteristic value comed:', characteristic)
                        console.log(that.ab2hex(characteristic.value))
                    })
                })

            },
            complete (res) {
                console.log(res)
            }
        })
    },
    // ArrayBuffer转16进度字符串示例
    ab2hex (buffer) {
        var hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function(bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
        return hexArr.join('');
    }
}
export default bluetooth
