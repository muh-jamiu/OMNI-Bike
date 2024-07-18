const bikeSchema = require("../model/bikeSchema")
// const noble = require('noble');
// const noble = require('@abandonware/noble');

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

// const TextBike = (req, res) => {
//     noble.on('stateChange', (state) => {
//         if (state === 'poweredOn') {
//             noble.startScanning([omniLockUUID], false);
//         } else {
//             noble.stopScanning();
//         }
//     });

//         noble.on('discover', (peripheral) => {
//         console.log('Discovered:', peripheral.advertisement);

//         peripheral.connect((error) => {
//             if (error) {
//                 console.error('Connection error:', error);
//                 res.status(500).send('Failed to connect');
//                 return;
//             }

//             console.log('Connected to', peripheral.uuid);
//             connectedPeripheral = peripheral;

//             peripheral.discoverAllServicesAndCharacteristics((err, services, characteristics) => {
//                 if (err) {
//                     console.error('Service discovery error:', err);
//                     res.status(500).send('Failed to discover services');
//                     return;
//                 }

//                 const lockCharacteristic = characteristics.find(char => char.uuid === lockCharacteristicUUID);

//                 if (lockCharacteristic) {
//                     res.status(200).send('Connected successfully');
//                 } else {
//                     res.status(404).send('Lock characteristic not found');
//                 }
//             });
//         });
//     });

// }




module.exports = {
    createBike,
    getAllBikes,
    // TextBike,
}