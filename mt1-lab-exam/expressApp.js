import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Vehicle array
let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Honda City",
        vehicleNumber: "DL8CAB1234",
        type: "Sedan",
        price: 1200000
    },
    {
        id: 3,
        vehicleName: "Maruti Swift",
        vehicleNumber: "UP16AB1234",
        type: "Hatchback",
        price: 750000
    }
];

// GET all vehicles
app.get('/vehicles', (req, res) => {
    res.status(200).json(vehicles);
});

// GET vehicle by ID
app.get('/vehicles/:id', (req, res) => {

    const vehicle = vehicles.find(
        v => v.id === Number(req.params.id)
    );

    if (!vehicle) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    res.json(vehicle);
});

// POST - Add vehicle
app.post('/vehicles', (req, res) => {

    const vehicle = req.body;

    if (
        !vehicle ||
        !Number.isInteger(vehicle.id) ||
        !vehicle.vehicleName ||
        !vehicle.vehicleNumber ||
        !vehicle.type ||
        typeof vehicle.price !== 'number' ||
        vehicle.price <= 0
    ) {
        return res.status(400).json({
            message: 'Invalid vehicle details'
        });
    }

    const exists = vehicles.some(
        v => v.id === vehicle.id
    );

    if (exists) {
        return res.status(400).json({
            message: 'Vehicle ID already exists'
        });
    }

    vehicles.push(vehicle);

    res.status(201).json({
        message: 'Vehicle added successfully',
        vehicle
    });
});

// PUT - Update vehicle
app.put('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(
        v => v.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const updatedVehicle = {
        ...vehicles[index],
        ...req.body,
        id: id
    };

    if (
        !updatedVehicle.vehicleName ||
        !updatedVehicle.vehicleNumber ||
        !updatedVehicle.type ||
        typeof updatedVehicle.price !== 'number' ||
        updatedVehicle.price <= 0
    ) {
        return res.status(400).json({
            message: 'Invalid vehicle details'
        });
    }

    vehicles[index] = updatedVehicle;

    res.json({
        message: 'Vehicle updated successfully',
        vehicle: updatedVehicle
    });
});

// DELETE - Remove vehicle
app.delete('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(
        v => v.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const deleted = vehicles.splice(index, 1);

    res.json({
        message: 'Vehicle deleted successfully',
        vehicle: deleted[0]
    });
});

// Invalid route
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Start Express server
app.listen(4000, () => {
    console.log('Express server running on port 4000');
});