const http = require('http');

const data = JSON.stringify({
  roadmap: { title: "Test Roadmap", level: "Beginner", estimated_duration: "1 week", nodes: [], edges: [] },
  goal: "Test Goal",
  name: "Test Name",
  isPublic: false
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/roadmaps',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
