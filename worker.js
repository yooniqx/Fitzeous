/**
 * Fitzeous Fitness - Cloudflare Worker
 * Serves static files and chatbot API
 */

// Chatbot knowledge base with pattern matching
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
    responses: [
      "We're open Monday-Saturday: 6:00 AM - 10:00 PM, and Sunday: 7:00 AM - 8:00 PM. Come visit us anytime!"
    ]
  },
  
  membership: {
    patterns: ['membership', 'join', 'sign up', 'register', 'price', 'cost', 'fee', 'plan'],
    responses: [
      "We offer flexible membership plans! Monthly: $50, Quarterly: $135 (save 10%), Annual: $480 (save 20%). All plans include access to all equipment, group classes, and personal training consultations. Contact us for more details!"
    ]
  },
  
  services: {
    patterns: ['service', 'offer', 'program', 'class', 'training', 'workout'],
    responses: [
      "We offer: 💪 Personal Training, 🧘 Yoga & Meditation, 🏃 Cardio Programs, 🏋️ Strength Training, 🥗 Nutrition Planning, and 🎯 Weight Loss Programs. Which interests you?"
    ]
  },
  
  nutrition: {
    patterns: ['nutrition', 'diet', 'meal', 'food', 'eating', 'weight loss'],
    responses: [
      "Our certified nutritionists create personalized meal plans based on your goals! We focus on balanced nutrition with whole foods, proper macros, and sustainable habits. Book a consultation to get started!"
    ]
  },
  
  personal_training: {
    patterns: ['personal train', 'pt', 'coach', 'trainer', 'one on one'],
    responses: [
      "Our certified personal trainers provide customized workout plans, form correction, motivation, and progress tracking. Sessions available in 30-min or 60-min formats. First consultation is free!"
    ]
  },
  
  beginner: {
    patterns: ['beginner', 'start', 'new', 'first time', 'never'],
    responses: [
      "Perfect! We love helping beginners! 🌟 Start with our free fitness assessment, then we'll create a beginner-friendly program. Our trainers will guide you every step of the way. No experience needed!"
    ]
  },
  
  equipment: {
    patterns: ['equipment', 'machine', 'gym', 'facility', 'amenities'],
    responses: [
      "We have state-of-the-art equipment including: cardio machines (treadmills, bikes, ellipticals), free weights, resistance machines, functional training area, yoga studio, and locker rooms with showers. Everything you need!"
    ]
  },
  
  location: {
    patterns: ['location', 'address', 'where', 'find you', 'directions'],
    responses: [
      "📍 We're located at Fitzeous Fitness Club, XYZ Road, ABC City. Easy parking available! Check our website for a map and directions."
    ]
  },
  
  contact: {
    patterns: ['contact', 'phone', 'email', 'reach', 'call'],
    responses: [
      "📞 Call us at: +XX XXX XX XX XX\n✉️ Email: info@fitzeousxxxx.com\n🌐 Visit our website for more info!\nWe typically respond within 24 hours."
    ]
  },
  
  events: {
    patterns: ['event', 'competition', 'workshop', 'challenge'],
    responses: [
      "We host regular events! 🎉 Check our Events page for upcoming fitness challenges, workshops, and community activities. Great way to stay motivated and meet fellow fitness enthusiasts!"
    ]
  },
  
  thanks: {
    patterns: ['thank', 'thanks', 'appreciate'],
    responses: [
      "You're welcome! Happy to help! 😊",
      "My pleasure! Let me know if you have any other questions!",
      "Anytime! We're here to support your fitness journey! 💪"
    ]
  },
  
  goodbye: {
    patterns: ['bye', 'goodbye', 'see you', 'later'],
    responses: [
      "Goodbye! Stay fit and healthy! 💪",
      "See you soon! Remember, consistency is key! 🌟",
      "Take care! We're here whenever you need us!"
    ]
  }
};

// Default responses when no pattern matches
const DEFAULT_RESPONSES = [
  "I'm not sure about that, but I can help with: membership info, hours, services, nutrition, personal training, equipment, and more! What would you like to know?",
  "Hmm, I didn't quite understand that. Try asking about our services, membership plans, hours, or training programs!",
  "I'm here to help with fitness questions! Ask me about our gym, classes, trainers, or membership options."
];

/**
 * Find the best matching response based on user input
 */
function findResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();
  
  // Check each category for pattern matches
  for (const [category, data] of Object.entries(RESPONSES)) {
    for (const pattern of data.patterns) {
      if (message.includes(pattern)) {
        // Return random response from matching category
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  
  // No match found, return default response
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

/**
 * Handle CORS headers
 */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

/**
 * Handle chatbot API requests
 */
async function handleChatbot(request) {
  const url = new URL(request.url);
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders()
    });
  }
  
  // Health check endpoint
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', service: 'Fitzeous Chatbot' }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
  
  // Chat endpoint
  if (url.pathname === '/api/chat' && request.method === 'POST') {
    try {
      const body = await request.json();
      const userMessage = body.message || '';
      
      if (!userMessage.trim()) {
        return new Response(JSON.stringify({ 
          error: 'Message is required' 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders()
          }
        });
      }
      
      // Get bot response
      const botResponse = findResponse(userMessage);
      
      return new Response(JSON.stringify({
        message: userMessage,
        response: botResponse,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request format' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }
  }
  
  return null; // Not a chatbot endpoint
}

/**
 * Get content type from file extension
 */
function getContentType(path) {
  const ext = path.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Main worker handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Handle chatbot API requests
    if (pathname.startsWith('/api/')) {
      const chatbotResponse = await handleChatbot(request);
      if (chatbotResponse) return chatbotResponse;
    }
    
    // Serve static files
    try {
      // Default to index.html for root
      if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
      }
      
      // Remove leading slash for asset lookup
      const assetPath = pathname.substring(1);
      
      // Try to get asset from KV
      const asset = await env.__STATIC_CONTENT.get(assetPath, { type: 'arrayBuffer' });
      
      if (asset) {
        return new Response(asset, {
          headers: {
            'Content-Type': getContentType(assetPath),
            'Cache-Control': 'public, max-age=3600',
          }
        });
      }
      
      // Asset not found
      return new Response('Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
      
    } catch (e) {
      console.error('Error serving asset:', e);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

// Made with Bob
