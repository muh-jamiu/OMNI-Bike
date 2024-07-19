const bikeSchema = require("../model/bikeSchema")
const noble = require('noble');
// const noble = require('@abandonware/bluetooth-hci-socket');

let connectedPeripheral = null;

const omniLockUUID = '1697681544';
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
    const {key} = req.body
    if(key != omniLockUUID){
        return  res.status(400).json({
            message: "Invalid lock code connection was establish"
        })
    }

    noble.on('stateChange', (state) => {
        console.log(state)
        if (state === 'poweredOn') {
            noble.startScanning([], false);
            console.log("start scanning")
        } else {
            noble.stopScanning();
            console.log("stop scanning")
        }
    });

    noble.on('scanStart', (state) => {
        console.log("scan start: ", state)
    });

    noble.on('scanStop', (state) => {
        console.log("scan stop: ", state)
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