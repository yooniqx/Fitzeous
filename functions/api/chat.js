// Cloudflare Pages Function - Chatbot API
// This file handles /api/chat requests

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

export async function onRequest(context) {
  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // Handle POST request
  if (context.request.method === 'POST') {
    try {
      const body = await context.request.json();
      const userMessage = body.message || '';

      if (!userMessage.trim()) {
        return Response.json(
          { error: 'Message is required' },
          {
            status: 400,
            headers: { 'Access-Control-Allow-Origin': '*' }
          }
        );
      }

      const botResponse = findResponse(userMessage);

      return Response.json(
        {
          message: userMessage,
          response: botResponse,
          timestamp: new Date().toISOString()
        },
        {
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    } catch (error) {
      return Response.json(
        { error: 'Invalid request format' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }
  }

  return Response.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  );
}

// Made with Bob
