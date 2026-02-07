import { NextResponse } from 'next/server';

const TAVUS_API_KEY = 'fdcc5e2bfe2b4d82b9f63b19b739339c';
const TAVUS_API_BASE = 'https://tavusapi.com';

export async function POST(request) {
    // Tavus API implementation commented out as requested
    /*
    try {
        const { action, userInfo, personaConfig } = await request.json();

        if (action === 'initialize') {
            console.log('Initializing Tavus conversation...');
            console.log('API Key present:', !!TAVUS_API_KEY);

            // Create a Tavus conversation - using correct API structure
            const requestBody = {
                replica_id: personaConfig?.replicaId || "r92debe21318",
                persona_id: personaConfig?.personaId || "p66ca14bd844",
                properties: {
                    "language": "multilingual"
                },
                conversational_context: `You are an energetic and enthusiastic AI Career Counselor! Your role is to guide students through career exploration with passion and positivity.

PERSONALITY:
- Speak in an energetic, uplifting, and motivational tone
- Use exclamation marks and enthusiastic language
- Be conversational and friendly
- Show genuine interest in the student's goals and dreams
- Provide actionable advice and insights

CONVERSATION STYLE:
- Ask thoughtful follow-up questions
- Celebrate their interests and achievements
- Provide real-world insights about career paths
- Suggest actionable next steps
- Encourage them to explore and take action

USER INFO:
- Name: ${userInfo.name || 'Student'}
- Career Interests: ${userInfo.careerGoals || 'Exploring options'}
- Experience Level: ${userInfo.experienceLevel || 'Student'}

START WITH: A warm, energetic greeting and ask about their current interests or what inspired them to explore careers today!`,
                properties: {
                    participant_left_timeout: 0,
                    language: "english"
                }
            };

            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(`${TAVUS_API_BASE}/v2/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': TAVUS_API_KEY
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Tavus API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Tavus API error:', response.status, JSON.stringify(errorData, null, 2));

                // Return fallback local session
                return NextResponse.json({
                    success: true,
                    conversationId: `local-${Date.now()}`,
                    conversationUrl: null,
                    message: 'Connected to local counselor (Tavus unavailable)'
                });
            }

            const data = await response.json();
            console.log('Tavus conversation created successfully!', JSON.stringify(data, null, 2));

            return NextResponse.json({
                success: true,
                conversationId: data.conversation_id,
                conversationUrl: data.conversation_url,
                message: `Welcome ${userInfo.name}! Let's explore your career path!`
            });
        }

        if (action === 'get-response') {
            const { userMessage } = userInfo;

            // Generate intelligent response based on user message
            const response = generateCareerResponse(userMessage);

            return NextResponse.json({
                success: true,
                response: response
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Career Counselor API error:', error);

        // Return fallback local session
        return NextResponse.json({
            success: true,
            conversationId: `local-${Date.now()}`,
            conversationUrl: null,
            message: 'Connected to local counselor'
        });
    }
    */
    return NextResponse.json({ message: "Tavus API is currently disabled." });
}

function generateCareerResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // Career exploration responses
    if (msg.includes('technology') || msg.includes('tech') || msg.includes('computer') || msg.includes('software') || msg.includes('coding')) {
        return "WOW! Technology is such an exciting field right now! 🚀 The tech industry is BOOMING with opportunities! Whether you're interested in software development, cybersecurity, data science, or AI - there's something for everyone!\n\nLet me ask you this: What aspect of technology excites you the most? Is it building apps, solving complex problems, working with data, or creating something that impacts millions of people? Understanding what drives your passion will help us find the PERFECT path for you!";
    }

    if (msg.includes('business') || msg.includes('entrepreneur') || msg.includes('startup') || msg.includes('marketing')) {
        return "Fantastic! Business and entrepreneurship - now THAT'S where innovation meets opportunity! 💼✨\n\nThe business world is all about creativity, strategy, and making things happen! Whether you want to launch your own startup, work in marketing, finance, or management consulting - these skills will take you far!\n\nHere's what I'm curious about: Are you more drawn to the creative side (marketing, product development) or the analytical side (finance, operations)? Or maybe you're the visionary type who wants to start something from scratch? Tell me more!";
    }

    if (msg.includes('medicine') || msg.includes('doctor') || msg.includes('healthcare') || msg.includes('nurse') || msg.includes('medical')) {
        return "Amazing! Healthcare and medicine - what a noble and impactful career choice! 🏥💙\n\nThe healthcare field is incredibly rewarding because you're literally changing lives every single day! From becoming a doctor or nurse to working in medical research, public health, or healthcare technology - there are SO many ways to make a difference!\n\nLet's explore this together: What draws you to healthcare? Is it the patient interaction, the science behind medicine, helping communities, or perhaps the cutting-edge research? Your 'why' will help guide us to the perfect specialty!";
    }

    if (msg.includes('art') || msg.includes('design') || msg.includes('creative') || msg.includes('graphic') || msg.includes('music')) {
        return "Oh YES! Creative fields - this is where passion meets expression! 🎨🎭✨\n\nThe creative industry is thriving, and there's never been a better time to turn your artistic talents into an amazing career! Whether it's graphic design, UX/UI design, animation, music production, or digital art - creativity is valued everywhere!\n\nI'm excited to know: What medium speaks to you most? Do you love visual arts, performing arts, or maybe blending creativity with technology (like game design or digital media)? Let's find where your artistic vision can shine brightest!";
    }

    if (msg.includes('teach') || msg.includes('education') || msg.includes('professor') || msg.includes('school')) {
        return "That's WONDERFUL! Education and teaching - you want to shape future generations! 📚👏\n\nTeachers and educators are literal superheroes! You have the power to inspire, guide, and unlock potential in others. Whether it's elementary education, high school teaching, college professors, or educational technology - you're investing in people's futures!\n\nTell me more: What age group or subject area interests you most? And what inspired you to consider education? Understanding your motivation will help us find the perfect teaching path for you!";
    }

    if (msg.includes('engineer') || msg.includes('engineering') || msg.includes('mechanical') || msg.includes('electrical')) {
        return "EXCELLENT choice! Engineering - the problem-solvers of the world! ⚙️🔧\n\nEngineers literally build the future! From mechanical and electrical engineering to civil, chemical, and aerospace - engineers turn ideas into reality! The world needs innovative thinkers who can design solutions to complex challenges!\n\nLet's narrow this down: What type of engineering excites you? Are you drawn to building things (mechanical/civil), working with electronics and power (electrical), designing systems (software), or maybe exploring new frontiers (aerospace)? Each path is amazing in its own way!";
    }

    if (msg.includes('law') || msg.includes('lawyer') || msg.includes('attorney') || msg.includes('legal')) {
        return "Powerful choice! Law and legal careers - justice, advocacy, and making a real impact! ⚖️💪\n\nLawyers and legal professionals shape society, fight for justice, and protect rights! Whether you're interested in criminal law, corporate law, environmental law, or human rights - this field offers incredible opportunities to make your mark!\n\nI'm curious: What aspect of law appeals to you? Are you passionate about defending people, negotiating deals, changing policies, or maybe advocating for causes you believe in? Your interests will help us find your legal calling!";
    }

    if (msg.includes('science') || msg.includes('research') || msg.includes('scientist') || msg.includes('biology') || msg.includes('chemistry')) {
        return "BRILLIANT! Science and research - uncovering the mysteries of our world! 🔬🧪\n\nScientists are modern-day explorers! Whether you're interested in biology, chemistry, physics, environmental science, or research - you'll be at the forefront of discovery and innovation! Every breakthrough starts with curious minds like yours!\n\nLet's explore: What scientific questions fascinate you? Are you drawn to life sciences (biology, medicine), physical sciences (chemistry, physics), or maybe earth/environmental sciences? What problems do you want to help solve?";
    }

    // Skills and education questions
    if (msg.includes('skill') || msg.includes('learn') || msg.includes('study') || msg.includes('major')) {
        return "Great question about skills! Let me give you the roadmap to success! 🗺️💡\n\nHere's the truth: SUCCESS comes from combining technical skills with soft skills!\n\n**Technical Skills**: Whatever field you choose, master the core competencies - coding for tech, accounting for business, anatomy for medicine, etc.\n\n**Soft Skills**: Communication, leadership, problem-solving, and adaptability are CRUCIAL in every career!\n\n**Action Steps**:\n1️⃣ Take online courses (Coursera, Udemy, Khan Academy)\n2️⃣ Get hands-on experience (internships, projects)\n3️⃣ Build a portfolio showcasing your work\n4️⃣ Network with professionals in your field\n\nWhat specific area do you want to start developing first? Let's create a personalized learning plan!";
    }

    // Getting started questions
    if (msg.includes('start') || msg.includes('begin') || msg.includes('first step') || msg.includes('how do i')) {
        return "Love your initiative! Let's get you STARTED on the right track! 🚀🎯\n\nHere's your ACTION PLAN:\n\n**Step 1: EXPLORE** 🔍\n- Research different careers that interest you\n- Watch day-in-the-life videos\n- Talk to people in those fields\n\n**Step 2: EXPERIENCE** 💼\n- Shadow professionals\n- Do internships or volunteer work\n- Take relevant courses\n\n**Step 3: EXCEL** 📈\n- Build your skills consistently\n- Create projects or portfolio\n- Network and build connections\n\nThe BEST time to start is NOW! Pick one area that excites you and take one small action today. What will that first action be?";
    }

    // Uncertainty/confusion
    if (msg.includes('unsure') || msg.includes('confused') || msg.includes('don\'t know') || msg.includes('not sure')) {
        return "Hey, it's TOTALLY okay to feel unsure - that's actually the first step to discovery! 🌟\n\nHere's what we'll do: Let's break this down together!\n\n**Quick Exercise**: Think about these questions:\n- What activities make you lose track of time?\n- What problems in the world do you want to solve?\n- What do people come to you for help with?\n- When do you feel most energized and alive?\n\nYour answers to these questions are GOLD! They reveal your natural strengths and interests. Share your thoughts with me, and let's connect the dots to find careers that align with who you are! Remember: Your perfect career is at the intersection of what you love, what you're good at, and what the world needs!";
    }

    // Salary/money questions
    if (msg.includes('salary') || msg.includes('money') || msg.includes('pay') || msg.includes('income') || msg.includes('earn')) {
        return "Smart thinking - financial stability matters! 💰✨\n\nHere's the real talk: YES, some careers pay more than others, BUT here's what's MORE important:\n\n**The Sweet Spot Formula**:\n💙 Passion + 💪 Skills + 💵 Market Demand = Success & Satisfaction\n\nMany high-paying careers exist across fields:\n- Tech: $70k-$200k+\n- Healthcare: $60k-$300k+\n- Business/Finance: $60k-$150k+\n- Engineering: $70k-$150k+\n\nBUT remember: The happiest people aren't always the highest earners! They're people who found work they love AND get paid well for it!\n\nWhat matters more to you: Maximum earning potential, work-life balance, or making an impact? Let's find a career that checks all YOUR boxes!";
    }

    // General encouragement and default responses
    const encouragingResponses = [
        "That's such an interesting perspective! Tell me more about what sparked this thought! 💭✨",
        "I LOVE your curiosity! Let's dive deeper into this together! What specific aspect interests you most? 🚀",
        "Great question! Here's what I want you to know: Every successful person started exactly where you are - full of questions and ready to learn! What's the one thing you want to understand better? 🌟",
        "Fantastic! You're asking the RIGHT questions! Success is all about being curious and taking action. What would you like to explore first? 💪",
        "This is exciting! Whatever path you choose, remember: Your career is a journey, not a destination. What step do you want to take next? 🎯"
    ];

    return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
}
