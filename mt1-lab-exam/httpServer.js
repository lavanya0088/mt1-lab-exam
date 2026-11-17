import http from 'http';
import fs from 'fs';

// Vehicle records
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

// Create HTTP server
const server = http.createServer((req, res) => {

    // Home route
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>Welcome to Vehicle Management System</h1>');
    }

    // Get all vehicles
    else if (req.method === 'GET' && req.url === '/vehicles') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(vehicles));
    }

    // About route
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h2>Vehicle Management Application using Node.js</h2>');
    }

    // Read HTML file using FS
    else if (req.method === 'GET' && req.url === '/info') {

        fs.readFile('./public/info.html', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(data);
            }
        });
    }

    // Add vehicle
    else if (req.method === 'POST' && req.url === '/add-vehicle') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            try {
                const vehicle = JSON.parse(body);

                if (
                    !vehicle.id ||
                    !vehicle.vehicleName ||
                    !vehicle.vehicleNumber ||
                    !vehicle.type ||
                    typeof vehicle.price !== 'number' ||
                    vehicle.price <= 0
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'Invalid vehicle details'
                    }));

                    return;
                }

                vehicles.push(vehicle);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Vehicle added successfully',
                    vehicle: vehicle
                }));

            } catch (error) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404);
        res.end('404 Page Not Found');
    }

});

// Start server
server.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});