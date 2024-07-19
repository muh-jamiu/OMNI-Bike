const bikeSchema = require("../model/bikeSchema")
// const noble = require('noble');
const noble = require('@abandonware/bluetooth-hci-socket');

let connectedPeripheral = null;

const omniLockUUID = 'YOUR_OMNI_LOCK_UUID';
const lockCharacteristicUUID = 'YOUR_LOCK_CHARACTERISTIC_UUID';

const createBike = (req, res) => {
    const {status, station,  BikeCode, bikename, type, name, description, image, pricerange, telephone, available, pricePerHour, pricePerDay, wheelsize, tires, manufactured } = req.body
    const bike = new bikeSchema({
        bikename,
        type,
        description,
        image,
        pricerange,
        telephone,
        available,
        pricePerHour,
        pricePerDay,
        wheelsize,
        tires,
        manufactured,
        BikeCode,
        status,
        station,
    })

    bike.save()
        .then(data => {
            res.status(200).json({
                message: "bike created successfully",
                data
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

const getAllBikes = (req, res) => {
    bikeSchema.find()
        .sort({ "createdAt": "desc" })
        .then(data => {
            res.status(200).json({
                message: "Bikes fetched successfully",
                Bikes: data
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const DeleteBike = (req, res) => {
    const {id} = req.body
    bikeSchema.findOneAndDelete({_id : id})
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "bike does not exist"
            })
        }
        res.status(200).json({
            message: "bike has been deleted succesfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })

   
}

const UpdateBike = (req, res) => {
    const {bikeCode, status, station, id} = req.body
    bikeSchema.findOneAndUpdate({_id : id}, {station:station, status: status, BikeCode:bikeCode})
    .then(result => {
        if(!result){
            return res.status(400).json({
                message: "Bike does not exist"
            })
        }
        res.status(200).json({
            message: "Bike has been updated succesfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })

   
}

const TextBike = (req, res) => {
    var bluetoothHciSocket = new noble();
    var filter = Buffer.alloc(14);
    bluetoothHciSocket.setFilter(filter);
    bluetoothHciSocket.bindUser(0x0A2B);
    bluetoothHciSocket.start()
    var isDevUp = bluetoothHciSocket.isDevUp()

    bluetoothHciSocket.on('error', function(error) {
      console.log("error" , error)
    });

    bluetoothHciSocket.on('data', function(data) {
       console.log(data)
    });


    return res.status(200).json({
        message: "Bikes fetched successfully",
        Bikes: filter,
        bluetoothHciSocket: bluetoothHciSocket,
        isDevUp,
    })

    noble.on('stateChange', (state) => {
        if (state === 'poweredOn') {
            noble.startScanning([omniLockUUID], false);
        } else {
            noble.stopScanning();
        }
    });

        noble.on('discover', (peripheral) => {
        console.log('Discovered:', peripheral.advertisement);

        peripheral.connect((error) => {
            if (error) {
                console.error('Connection error:', error);
                res.status(500).send('Failed to connect');
                return;
            }

            console.log('Connected to', peripheral.uuid);
            connectedPeripheral = peripheral;

            peripheral.discoverAllServicesAndCharacteristics((err, services, characteristics) => {
                if (err) {
                    console.error('Service discovery error:', err);
                    res.status(500).send('Failed to discover services');
                    return;
                }

                const lockCharacteristic = characteristics.find(char => char.uuid === lockCharacteristicUUID);

                if (lockCharacteristic) {
                    res.status(200).send('Connected successfully');
                } else {
                    res.status(404).send('Lock characteristic not found');
                }
            });
        });
    });

}




module.exports = {
    createBike,
    getAllBikes,
    TextBike,
    DeleteBike,
    UpdateBike,
}