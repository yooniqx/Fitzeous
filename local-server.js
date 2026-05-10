/**
 * Local Development Server for Fitzeous Fitness
 * Serves static files AND chatbot API for local testing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// Chatbot responses (same as worker.js)
const RESPONSES = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hello! Welcome to Fitzeous Fitness Club! 💪 How can I help you today?",
      "Hi there! I'm here to answer your fitness questions. What would you like to know?",
      "Hey! Ready to start your fitness journey? Ask me anything!"
    ]
  },
  hours: {
    patterns: ['hours', 'open', 'close', 'timing', 'schedule', 'when open'],
    responses: ["We're open Monday-Saturday: 6:00 AM - 10:00 PM, and Sunday: 7:00 AM - 8:00 PM. Come visit us anytime!"]
  },
  membership: {
    patterns: ['membership', 'join', 'sign up', 'register', 'price', 'cost', 'fee', 'plan'],
    responses: ["We offer flexible membership plans! Monthly: $50, Quarterly: $135 (save 10%), Annual: $480 (save 20%). All plans include access to all equipment, group classes, and personal training consultations. Contact us for more details!"]
  },
  services: {
    patterns: ['service', 'offer', 'program', 'class', 'training', 'workout'],
    responses: ["We offer: 💪 Personal Training, 🧘 Yoga & Meditation, 🏃 Cardio Programs, 🏋️ Strength Training, 🥗 Nutrition Planning, and 🎯 Weight Loss Programs. Which interests you?"]
  },
  nutrition: {
    patterns: ['nutrition', 'diet', 'meal', 'food', 'eating', 'weight loss'],
    responses: ["Our certified nutritionists create personalized meal plans based on your goals! We focus on balanced nutrition with whole foods, proper macros, and sustainable habits. Book a consultation to get started!"]
  },
  personal_training: {
    patterns: ['personal train', 'pt', 'coach', 'trainer', 'one on one'],
    responses: ["Our certified personal trainers provide customized workout plans, form correction, motivation, and progress tracking. Sessions available in 30-min or 60-min formats. First consultation is free!"]
  },
  beginner: {
    patterns: ['beginner', 'start', 'new', 'first time', 'never'],
    responses: ["Perfect! We love helping beginners! 🌟 Start with our free fitness assessment, then we'll create a beginner-friendly program. Our trainers will guide you every step of the way. No experience needed!"]
  },
  equipment: {
    patterns: ['equipment', 'machine', 'gym', 'facility', 'amenities'],
    responses: ["We have state-of-the-art equipment including: cardio machines (treadmills, bikes, ellipticals), free weights, resistance machines, functional training area, yoga studio, and locker rooms with showers. Everything you need!"]
  },
  location: {
    patterns: ['location', 'address', 'where', 'find you', 'directions'],
    responses: ["📍 We're located at Fitzeous Fitness Club, XYZ Road, ABC City. Easy parking available! Check our website for a map and directions."]
  },
  contact: {
    patterns: ['contact', 'phone', 'email', 'reach', 'call'],
    responses: ["📞 Call us at: +XX XXX XX XX XX\n✉️ Email: info@fitzeousxxxx.com\n🌐 Visit our website for more info!\nWe typically respond within 24 hours."]
  },
  events: {
    patterns: ['event', 'competition', 'workshop', 'challenge'],
    responses: ["We host regular events! 🎉 Check our Events page for upcoming fitness challenges, workshops, and community activities. Great way to stay motivated and meet fellow fitness enthusiasts!"]
  },
  thanks: {
    patterns: ['thank', 'thanks', 'appreciate'],
    responses: ["You're welcome! Happy to help! 😊", "My pleasure! Let me know if you have any other questions!", "Anytime! We're here to support your fitness journey! 💪"]
  },
  goodbye: {
    patterns: ['bye', 'goodbye', 'see you', 'later'],
    responses: ["Goodbye! Stay fit and healthy! 💪", "See you soon! Remember, consistency is key! 🌟", "Take care! We're here whenever you need us!"]
  }
};

const DEFAULT_RESPONSES = [
  "I'm not sure about that, but I can help with: membership info, hours, services, nutrition, personal training, equipment, and more! What would you like to know?",
  "Hmm, I didn't quite understand that. Try asking about our services, membership plans, hours, or training programs!",
  "I'm here to help with fitness questions! Ask me about our gym, classes, trainers, or membership options."
];

function findResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();
  for (const [category, data] of Object.entries(RESPONSES)) {
    for (const pattern of data.patterns) {
      if (message.includes(pattern)) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
};

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle chatbot API
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'Fitzeous Chatbot (Local)' }));
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const userMessage = data.message || '';
        
        if (!userMessage.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Message is required' }));
          return;
        }

        const botResponse = findResponse(userMessage);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: userMessage,
          response: botResponse,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request format' }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Fitzeous Fitness - Local Development Server`);
  console.log(`\n✅ Server running at: http://localhost:${PORT}`);
  console.log(`✅ Chatbot API ready at: http://localhost:${PORT}/api/chat`);
  console.log(`\n📝 Press Ctrl+C to stop\n`);
});

// Made with Bob
