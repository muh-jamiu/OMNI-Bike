const bikeSchema = require("../model/bikeSchema")
// const noble = require('noble');
// const noble = require('@abandonware/bluetooth-hci-socket');
const net = require('net');
let connectedPeripheral = null;

const omniLockUUID = '1697681544';
const lockCharacteristicUUID = 'YOUR_LOCK_CHARACTERISTIC_UUID';

const createBike = (req, res) => {
    return res.status(500).json({
        message: "error"
    })
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
            message: "Invalid lock device code connection was establish"
        })
    }

    return  res.status(400).json({
        message: "Error while connecting: Device is out of range",
    })

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

const newBike = (res , req) => {
    const deviceIp = 'www.omnibike.net'; // Replace with the actual IP of the Omni device
    const devicePort = 9686; // Replace with the actual port
    const time_ = getCurrentFormattedDateTime()

    // Create a TCP client
    const client = new net.Socket();

    client.connect(devicePort, deviceIp, () => {
        console.log('Connected to Omni device');

        // Command to send to the Omni device (e.g., unlock command)
        const command = `*CMDR,OM,${omniLockUUID},${time_},L0,0,1234,1497689816#<LF>`; // The command format depends on the Omni protocol
        client.write(command, () => {
            console.log('Command sent:', command, time_, );
        });
        
        // var a = client.address()
        // console.log( a)
    });

    client.on('data', (data) => {
        console.log('Received:', data.toString());
    
        // Close the connection after receiving a response
        client.destroy();
    });
    
    client.on('close', () => {
        console.log('Connection closed');
    });
    
    client.on('error', (err) => {
        console.error('Error:', err);
    });
}

function getCurrentFormattedDateTime() {
    const now = new Date();

    // Extract date components
    const year = now.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // Month is zero-based, so add 1 and pad with zero if necessary
    const day = ('0' + now.getDate()).slice(-2); // Get day and pad with zero if necessary

    // Extract time components
    const hours = ('0' + now.getHours()).slice(-2); // Get hours and pad with zero if necessary
    const minutes = ('0' + now.getMinutes()).slice(-2); // Get minutes and pad with zero if necessary
    const seconds = ('0' + now.getSeconds()).slice(-2); // Get seconds and pad with zero if necessary

    // Combine all components into the desired format
    const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return formattedDateTime;
}




module.exports = {
    createBike,
    getAllBikes,
    TextBike,
    DeleteBike,
    UpdateBike,
    newBike
}
