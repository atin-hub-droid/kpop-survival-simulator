// ======== Game Variables ========
let player = {};
let npcs = [];
let episode = 1;
let scenarioIndex = 0;
let timer = 10;
let timerInterval;
let scenarios = [];
const totalEpisodes = 10;
const totalScenarios = 200; // Scenario pool
const routes = ["Instant Fan Favorite","Dark Horse","Common Trainee","Fallen Idol"];

// NPC nationalities and traits
const nationalities = ["Korean","Japanese","Chinese","Thai","Filipino","American","Vietnamese"];
const npcTraits = ["friendly","rival","fan favorite","hardworking","diva"];

// ======== Scenario Pool ========
// ======== Episode 1 Scenario Pool ========
let scenarioPool = [
  {
    text: "Dynamic Dance Drill: You’re assigned a complicated footwork sequence for the upcoming stage.",
    stat: "dancing",
    options: [
      { text: "Practice repeatedly until flawless", effect: 5 },
      { text: "Ask a teammate to spot errors", effect: 3 },
      { text: "Skip difficult sections and focus on easier moves", effect: 1 },
      { text: "Record and review later", effect: 2 }
    ]
  },
  {
    text: "Emotional Vocal Exercise: Your mentor wants you to deliver the next line with raw emotion.",
    stat: "singing",
    options: [
      { text: "Pour all feeling into it", effect: 4 },
      { text: "Maintain steady pitch", effect: 3 },
      { text: "Experiment with phrasing", effect: 2 },
      { text: "Let another trainee lead this part", effect: -1 }
    ]
  },
  {
    text: "Mentor Spotlight Feedback: Mentor highlights that your expressions lack intensity.",
    stat: "visual",
    options: [
      { text: "Practice exaggerated expressions", effect: 3 },
      { text: "Politely defend your style", effect: -1 },
      { text: "Ask mentor for a live demonstration", effect: 2 },
      { text: "Ignore advice", effect: -2 }
    ]
  },
  {
    text: "Staff Assistance Task: Staff needs extra hands to set up stage props.",
    stat: "teamMorale",
    options: [
      { text: "Help enthusiastically", effect: 1 },
      { text: "Help reluctantly", effect: 1 },
      { text: "Refuse", effect: -1 },
      { text: "Assign tasks to others", effect: -1 }
    ]
  },
  {
    text: "Mid-Stage Mistake: You trip slightly during rehearsal but keep performing.",
    stat: "stagePerformance",
    options: [
      { text: "Improvise fluidly", effect: 4 },
      { text: "Restart from previous formation", effect: 2 },
      { text: "Freeze for a moment", effect: -1 },
      { text: "Signal partner to cover", effect: 3 }
    ]
  },
  {
    text: "Harmony Challenge: Your part clashes with another trainee’s line during practice.",
    stat: "teamwork",
    options: [
      { text: "Adjust pitch immediately", effect: 3 },
      { text: "Suggest a subtle rearrangement", effect: 2 },
      { text: "Let it slide", effect: -1 },
      { text: "Argue with your partner", effect: -2 }
    ]
  },
  {
    text: "On-Stage Aegyo Moment: The camera captures your solo, and fans expect a cute expression or gesture.",
    stat: "fanService",
    options: [
      { text: "Deliver full aegyo", effect: 3 },
      { text: "Subtle, sweet smile", effect: 2 },
      { text: "Add playful twist", effect: 3 },
      { text: "Skip and stay serious", effect: -2 }
    ]
  },
  {
    text: "Signature Stage Tease: Fans notice your lipbite, wink, or eye contact. You can choose how to engage.",
    stat: "fanService",
    options: [
      { text: "Go all out, deliver charm", effect: 4 },
      { text: "Maintain brief, teasing gestures", effect: 2 },
      { text: "Slightly playful but safe", effect: 3 },
      { text: "Ignore and focus on technique", effect: -2 }
    ]
  }
];

// ======== Episode 2 Scenario Pool ========
let episode2ScenarioPool = [
  {
    text: "Team Formation Drill: Your team struggles with a new, complex choreography.",
    stat: "teamwork",
    options: [
      { text: "Take the lead and guide everyone", effect: 4 },
      { text: "Focus on your section and help neighbors", effect: 2 },
      { text: "Follow quietly without input", effect: 1 },
      { text: "Skip coordination practice", effect: -2 }
    ]
  },
  {
    text: "Vocal Precision Challenge: During practice, team members sing slightly off-key.",
    stat: "singing",
    options: [
      { text: "Correct them gently", effect: 3 },
      { text: "Suggest re-recording the part", effect: 2 },
      { text: "Concentrate only on your part", effect: 1 },
      { text: "Ignore it", effect: -2 }
    ]
  },
  {
    text: "Mentor Feedback on Energy: Mentor says the team performance feels flat.",
    stat: "stagePerformance",
    options: [
      { text: "Motivate everyone enthusiastically", effect: 3 },
      { text: "Focus only on your performance", effect: 2 },
      { text: "Suggest a new formation", effect: 2 },
      { text: "Ignore feedback", effect: -2 }
    ]
  },
  {
    text: "Staff Rehearsal Request: Staff asks for rehearsal footage for producers.",
    stat: "teamwork",
    options: [
      { text: "Film your section professionally", effect: 2 },
      { text: "Help the filming team", effect: 1 },
      { text: "Politely decline", effect: -1 },
      { text: "Make a funny clip for fans", effect: 1 }
    ]
  },
  {
    text: "Live Mistake Recovery: Someone in your group forgets choreography mid-stage.",
    stat: "stagePerformance",
    options: [
      { text: "Cover smoothly and keep energy", effect: 3 },
      { text: "Signal to restart", effect: 2 },
      { text: "Continue alone, improvising", effect: 1 },
      { text: "Stop completely", effect: -2 }
    ]
  },
  {
    text: "Stage Costume/Prop Issue: A prop or costume malfunctions during rehearsal.",
    stat: "stagePerformance",
    options: [
      { text: "Fix it immediately", effect: 2 },
      { text: "Improvise with what you have", effect: 3 },
      { text: "Ignore minor issue", effect: 1 },
      { text: "Wait for staff to fix", effect: -1 }
    ]
  },
  {
    text: "On-Stage Aegyo Moment: Fans expect a cute or teasing expression during performance.",
    stat: "fanService",
    options: [
      { text: "Deliver fully", effect: 3 },
      { text: "Give a subtle smile", effect: 2 },
      { text: "Add playful variation", effect: 3 },
      { text: "Focus on technical performance only", effect: -2 }
    ]
  },
  {
    text: "Lipbite / Eye Contact Tease: Fans notice flirty gestures during stage presence.",
    stat: "fanService",
    options: [
      { text: "Fully engage with eye contact and gestures", effect: 4 },
      { text: "Keep gestures brief but noticeable", effect: 2 },
      { text: "Slightly playful, safe approach", effect: 3 },
      { text: "Ignore and stay focused on moves", effect: -2 }
    ]
  }
];

// ======== Episode 3 Scenario Pool ========
let episode3ScenarioPool = [
  {
    text: "High Note Consistency: Mentor asks you to hit a challenging high note multiple times.",
    stat: "singing",
    options: [
      { text: "Focus and nail it each time", effect: 5 },
      { text: "Try your best, occasionally miss", effect: 3 },
      { text: "Avoid the high notes", effect: 0 },
      { text: "Practice later on your own", effect: 2 }
    ]
  },
  {
    text: "Breath & Emotion Drill: Coach wants you to combine breath control with expressive singing.",
    stat: "singing",
    options: [
      { text: "Follow exercises rigorously and add emotion", effect: 4 },
      { text: "Focus partially on either", effect: 2 },
      { text: "Skip exercises", effect: -1 },
      { text: "Teach others techniques", effect: 2 }
    ]
  },
  {
    text: "Mentor One-on-One Guidance: Mentor notes your pitch or tone is inconsistent.",
    stat: "singing",
    options: [
      { text: "Correct immediately", effect: 3 },
      { text: "Make mental notes for later", effect: 1 },
      { text: "Ask a teammate for help", effect: 1 },
      { text: "Ignore advice", effect: -2 }
    ]
  },
  {
    text: "Staff Request for Extra Footage: Staff asks for additional rehearsal recordings for review.",
    stat: "teamwork",
    options: [
      { text: "Record immediately and professionally", effect: 3 },
      { text: "Record later", effect: 2 },
      { text: "Ask guidance from staff", effect: 1 },
      { text: "Refuse politely", effect: -2 }
    ]
  },
  {
    text: "Solo Stage Mistake Recovery: You forget lyrics or choreography during a solo.",
    stat: "stagePerformance",
    options: [
      { text: "Improvise smoothly", effect: 4 },
      { text: "Restart quietly", effect: 2 },
      { text: "Pause dramatically", effect: -1 },
      { text: "Signal a teammate for help", effect: 2 }
    ]
  },
  {
    text: "Stage Technical Issue: Spotlight misses or costume malfunctions during performance.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust yourself", effect: 2 },
      { text: "Signal staff", effect: 1 },
      { text: "Continue performing normally", effect: 1 },
      { text: "Pause or freeze", effect: -2 }
    ]
  },
  {
    text: "Fan Greeting / Video Appeal: Fans ask for a live or recorded personal greeting.",
    stat: "fanService",
    options: [
      { text: "Perform energetically", effect: 3 },
      { text: "Keep it sincere and sweet", effect: 4 },
      { text: "Add humor", effect: 2 },
      { text: "Skip", effect: -2 }
    ]
  },
  {
    text: "Stage Tease / Aegyo: Fans notice flirty or cute gestures during your performance.",
    stat: "fanService",
    options: [
      { text: "Fully engage with gestures and expressions", effect: 4 },
      { text: "Brief but noticeable gestures", effect: 2 },
      { text: "Slight playful movements", effect: 3 },
      { text: "Ignore and focus on performance", effect: -2 }
    ]
  }
];

// ======== Episode 2 Scenario Pool ========
let episode2ScenarioPool = [
  {
    text: "Team Formation Drill: Your team struggles with a new, complex choreography.",
    stat: "teamwork",
    options: [
      { text: "Take the lead and guide everyone", effect: 4 },
      { text: "Focus on your section and help neighbors", effect: 2 },
      { text: "Follow quietly without input", effect: 1 },
      { text: "Skip coordination practice", effect: -2 }
    ]
  },
  {
    text: "Vocal Precision Challenge: During practice, team members sing slightly off-key.",
    stat: "singing",
    options: [
      { text: "Correct them gently", effect: 3 },
      { text: "Suggest re-recording the part", effect: 2 },
      { text: "Concentrate only on your part", effect: 1 },
      { text: "Ignore it", effect: -2 }
    ]
  },
  {
    text: "Mentor Feedback on Energy: Mentor says the team performance feels flat.",
    stat: "stagePerformance",
    options: [
      { text: "Motivate everyone enthusiastically", effect: 3 },
      { text: "Focus only on your performance", effect: 2 },
      { text: "Suggest a new formation", effect: 2 },
      { text: "Ignore feedback", effect: -2 }
    ]
  },
  {
    text: "Staff Rehearsal Request: Staff asks for rehearsal footage for producers.",
    stat: "teamwork",
    options: [
      { text: "Film your section professionally", effect: 2 },
      { text: "Help the filming team", effect: 1 },
      { text: "Politely decline", effect: -1 },
      { text: "Make a funny clip for fans", effect: 1 }
    ]
  },
  {
    text: "Live Mistake Recovery: Someone in your group forgets choreography mid-stage.",
    stat: "stagePerformance",
    options: [
      { text: "Cover smoothly and keep energy", effect: 3 },
      { text: "Signal to restart", effect: 2 },
      { text: "Continue alone, improvising", effect: 1 },
      { text: "Stop completely", effect: -2 }
    ]
  },
  {
    text: "Stage Costume/Prop Issue: A prop or costume malfunctions during rehearsal.",
    stat: "stagePerformance",
    options: [
      { text: "Fix it immediately", effect: 2 },
      { text: "Improvise with what you have", effect: 3 },
      { text: "Ignore minor issue", effect: 1 },
      { text: "Wait for staff to fix", effect: -1 }
    ]
  },
  {
    text: "On-Stage Aegyo Moment: Fans expect a cute or teasing expression during performance.",
    stat: "fanService",
    options: [
      { text: "Deliver fully", effect: 3 },
      { text: "Give a subtle smile", effect: 2 },
      { text: "Add playful variation", effect: 3 },
      { text: "Focus on technical performance only", effect: -2 }
    ]
  },
  {
    text: "Lipbite / Eye Contact Tease: Fans notice flirty gestures during stage presence.",
    stat: "fanService",
    options: [
      { text: "Fully engage with eye contact and gestures", effect: 4 },
      { text: "Keep gestures brief but noticeable", effect: 2 },
      { text: "Slightly playful, safe approach", effect: 3 },
      { text: "Ignore and stay focused on moves", effect: -2 }
    ]
  }
];

// ======== Episode 3 Scenario Pool ========
let episode3ScenarioPool = [
  {
    text: "High Note Consistency: Mentor asks you to hit a challenging high note multiple times.",
    stat: "singing",
    options: [
      { text: "Focus and nail it each time", effect: 5 },
      { text: "Try your best, occasionally miss", effect: 3 },
      { text: "Avoid the high notes", effect: 0 },
      { text: "Practice later on your own", effect: 2 }
    ]
  },
  {
    text: "Breath & Emotion Drill: Coach wants you to combine breath control with expressive singing.",
    stat: "singing",
    options: [
      { text: "Follow exercises rigorously and add emotion", effect: 4 },
      { text: "Focus partially on either", effect: 2 },
      { text: "Skip exercises", effect: -1 },
      { text: "Teach others techniques", effect: 2 }
    ]
  },
  {
    text: "Mentor One-on-One Guidance: Mentor notes your pitch or tone is inconsistent.",
    stat: "singing",
    options: [
      { text: "Correct immediately", effect: 3 },
      { text: "Make mental notes for later", effect: 1 },
// ======== Episode 4 Scenario Pool ========
let episode4ScenarioPool = [
  {
    text: "Advanced Choreography Drill: Your team struggles with a tricky formation.",
    stat: "dancing",
    options: [
      { text: "Take the lead and coordinate everyone", effect: 4 },
      { text: "Focus on your own section only", effect: 2 },
      { text: "Help a struggling teammate", effect: 2 },
      { text: "Ignore the formation", effect: -2 }
    ]
  },
  {
    text: "Vocal Stamina Test: Mentor challenges you to sustain high-energy singing while dancing.",
    stat: "singing",
    options: [
      { text: "Push through fully", effect: 5 },
      { text: "Pace yourself strategically", effect: 2 },
      { text: "Support teammates while conserving energy", effect: 2 },
      { text: "Skip the drill", effect: -2 }
    ]
  },
  {
    text: "Mentor One-on-One Feedback: Mentor points out your timing or pitch inconsistencies.",
    stat: "singing",
    options: [
      { text: "Correct immediately", effect: 3 },
      { text: "Take notes to practice later", effect: 1 },
      { text: "Ask teammates for support", effect: 1 },
      { text: "Ignore advice", effect: -2 }
    ]
  },
  {
    text: "Staff Production Request: Staff asks for additional rehearsal clips for evaluation.",
    stat: "teamwork",
    options: [
      { text: "Record professionally right away", effect: 3 },
      { text: "Record later", effect: 2 },
      { text: "Ask for guidance", effect: 1 },
      { text: "Refuse politely", effect: -2 }
    ]
  },
  {
    text: "Solo Mishap Recovery: You forget lyrics or choreography during a solo segment.",
    stat: "stagePerformance",
    options: [
      { text: "Improvise smoothly", effect: 4 },
      { text: "Restart quietly", effect: 2 },
      { text: "Pause dramatically", effect: -1 },
      { text: "Signal for help", effect: 2 }
    ]
  },
  {
    text: "Stage Technical Difficulty: Spotlight misses your mark or a prop malfunctions mid-performance.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust yourself immediately", effect: 2 },
      { text: "Signal staff for help", effect: 1 },
      { text: "Continue performing normally", effect: 1 },
      { text: "Freeze or stop", effect: -2 }
    ]
  },
  {
    text: "Personalized Fan Video: Fans request a short greeting video.",
    stat: "fanService",
    options: [
      { text: "Perform energetically and sincerely", effect: 4 },
      { text: "Keep it cute and sweet", effect: 3 },
      { text: "Add humor and playful gestures", effect: 3 },
      { text: "Skip it", effect: -2 }
    ]
  },
  {
    text: "Stage Aegyo & Interaction: Fans notice flirty or playful expressions during performance.",
    stat: "fanService",
    options: [
      { text: "Engage fully with gestures", effect: 4 },
      { text: "Brief but noticeable", effect: 2 },
      { text: "Slight playful movements", effect: 3 },
      { text: "Ignore and focus on technical performance", effect: -2 }
    ]
  }
];

// ======== Episode 5 Scenario Pool ========
let episode5ScenarioPool = [
  {
    text: "Concept Dance Immersion: Mentor assigns a new dance style outside your comfort zone.",
    stat: "dancing",
    options: [
      { text: "Fully immerse and master it", effect: 4 },
      { text: "Try partially", effect: 2 },
      { text: "Stick to familiar moves", effect: 1 },
      { text: "Refuse", effect: -2 }
    ]
  },
  {
    text: "Emotional Expression Drill: Mentor asks you to integrate deep emotion into performance.",
    stat: "singing",
    options: [
      { text: "Express fully", effect: 3 },
      { text: "Apply partially", effect: 2 },
      { text: "Focus only on technique", effect: 2 },
      { text: "Ignore", effect: -2 }
    ]
  },
  {
    text: "Mentor Brainstorming: Mentor asks for your creative input to enhance concept.",
    stat: "teamwork",
    options: [
      { text: "Propose bold ideas", effect: 3 },
      { text: "Suggest minor tweaks", effect: 2 },
      { text: "Follow others’ ideas", effect: 1 },
      { text: "Stay silent", effect: -1 }
    ]
  },
  {
    text: "Staff Footage Request: Staff requests rehearsal clips for promotional use.",
    stat: "teamwork",
    options: [
      { text: "Film attentively", effect: 2 },
      { text: "Assist team filming", effect: 1 },
      { text: "Delegate", effect: -1 },
      { text: "Refuse", effect: -2 }
    ]
  },
  {
    text: "Formation & Synchronization: Team goes off-sync during stage performance.",
    stat: "teamwork",
    options: [
      { text: "Lead correction", effect: 3 },
      { text: "Signal to restart", effect: 2 },
      { text: "Focus only on self", effect: 1 },
      { text: "Ignore", effect: -1 }
    ]
  },
  {
    text: "Technical Mishap: Spotlight misses you or outfit tears mid-performance.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust quickly", effect: 3 },
      { text: "Continue as is", effect: 2 },
      { text: "Pause briefly", effect: 1 },
      { text: "Stop performance", effect: -2 }
    ]
  },
  {
    text: "Social Media Concept Clip: Fans request a behind-the-scenes or performance video.",
    stat: "fanService",
    options: [
      { text: "Perform fully and energetically", effect: 4 },
      { text: "Perform lightly", effect: 2 },
      { text: "Add humor or personality", effect: 3 },
      { text: "Skip", effect: -2 }
    ]
  },
  {
    text: "Stage Aegyo & Interaction: Fans notice playful expressions or lip-bites during concept stage.",
    stat: "fanService",
    options: [
      { text: "Engage fully", effect: 4 },
      { text: "Brief but noticeable", effect: 2 },
      { text: "Subtle gestures", effect: 3 },
      { text: "Focus strictly on performance", effect: -2 }
    ]
  }
];

// ======== Episode 6 Scenario Pool ========
let episode6ScenarioPool = [
  {
    text: "Pair Dance Challenge: Mentor pairs you for a synchronized routine with another trainee.",
    stat: "dancing",
    options: [
      { text: "Lead confidently", effect: 3 },
      { text: "Follow partner carefully", effect: 2 },
      { text: "Suggest minor changes", effect: 2 },
      { text: "Ignore partner", effect: -1 }
    ]
  },
  {
    text: "Vocal Duet Drill: You must harmonize perfectly with a partner.",
    stat: "singing",
    options: [
      { text: "Adjust immediately", effect: 3 },
      { text: "Focus only on own part", effect: 2 },
      { text: "Suggest rearrangement", effect: 2 },
      { text: "Ignore", effect: -2 }
    ]
  },
  {
    text: "Mentorship Practice: You are asked to coach a less experienced trainee.",
    stat: "teamwork",
    options: [
      { text: "Teach thoroughly", effect: 3 },
      { text: "Teach partially", effect: 2 },
      { text: "Let them figure out themselves", effect: 1 },
      { text: "Avoid mentoring", effect: -2 }
    ]
  },
  {
    text: "Senior Trainee Guidance: A senior offers tips to improve team collaboration.",
    stat: "teamwork",
    options: [
      { text: "Apply advice fully", effect: 3 },
      { text: "Apply partially", effect: 2 },
      { text: "Thank but ignore", effect: -2 },
      { text: "Try your own method", effect: 2 }
    ]
  },
  {
    text: "Duo Mistiming: Partner misses cues during stage performance.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust immediately", effect: 3 },
      { text: "Signal to restart", effect: 2 },
      { text: "Focus only on self", effect: 1 },
      { text: "Ignore", effect: -1 }
    ]
  },
  {
    text: "Stage Technical Issue: Spotlight misses duo or costumes malfunction.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust quickly", effect: 3 },
      { text: "Continue as is", effect: 2 },
      { text: "Pause briefly", effect: 1 },
      { text: "Stop performance", effect: -2 }
    ]
  },
  {
    text: "Collaborative Social Media Clip: Fans request a duo performance video.",
    stat: "fanService",
    options: [
      { text: "Perform fully", effect: 4 },
      { text: "Perform partially", effect: 2 },
      { text: "Perform humorously", effect: 3 },
      { text: "Skip", effect: -2 }
    ]
  },
  {
    text: "Stage Aegyo & Interaction: Fans notice playful gestures during duo performance.",
    stat: "fanService",
    options: [
      { text: "Engage fully", effect: 4 },
      { text: "Brief but noticeable", effect: 2 },
      { text: "Subtle gestures", effect: 3 },
      { text: "Focus strictly on performance", effect: -2 }
    ]
  }
];

// ======== Episode 7 Scenario Pool ========
let episode7ScenarioPool = [
  {
    text: "Solo Vocal Stretch: Mentor asks you to sustain a high note repeatedly.",
    stat: "singing",
    options: [
      { text: "Hit it perfectly", effect: 4 },
      { text: "Try hard but miss slightly", effect: 2 },
      { text: "Skip the stretch", effect: 0 },
      { text: "Practice later privately", effect: 2 }
    ]
  },
  {
    text: "Solo Dance Intensity: You are assigned a physically demanding solo sequence.",
    stat: "dancing",
    options: [
      { text: "Master each move", effect: 4 },
      { text: "Practice steadily", effect: 2 },
      { text: "Focus only on easy parts", effect: 1 },
      { text: "Sit out", effect: -2 }
    ]
  },
  {
    text: "Peer Coaching Drill: Mentor pairs you to coach a lower-level trainee.",
    stat: "teamwork",
    options: [
      { text: "Teach thoroughly", effect: 3 },
      { text: "Teach partially", effect: 2 },
      { text: "Let them figure it out", effect: 1 },
      { text: "Avoid mentoring", effect: -2 }
    ]
  },
  {
    text: "Senior Advice Application: A senior trainee offers tips for improving stage presence.",
    stat: "teamwork",
    options: [
      { text: "Apply advice fully", effect: 3 },
      { text: "Try partially", effect: 2 },
      { text: "Thank but ignore", effect: -2 },
      { text: "Add personal flair", effect: 2 }
    ]
  },
  {
    text: "Spotlight Coordination: Stage lights miss your solo position.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust and continue", effect: 2 },
      { text: "Signal staff", effect: 1 },
      { text: "Perform normally", effect: 1 },
      { text: "Freeze", effect: -2 }
    ]
  },
  {
    text: "Music Timing Error: Backing track is delayed during your solo.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust immediately", effect: 3 },
      { text: "Suggest restart", effect: 2 },
      { text: "Continue alone", effect: 1 },
      { text: "Stop performance", effect: -2 }
    ]
  },
  {
    text: "Mid-Stage Fan Interaction: Fans notice playful gestures (lipbite, aegyo, acting cool).",
    stat: "fanService",
    options: [
      { text: "Engage fully", effect: 4 },
      { text: "Subtle gestures", effect: 2 },
      { text: "Style-focused but notice fans", effect: 3 },
      { text: "Ignore fans", effect: -2 }
    ]
  },
  {
    text: "Social Media Solo Clip: Fans request a short behind-the-scenes video of your solo.",
    stat: "fanService",
    options: [
      { text: "Give full energy", effect: 4 },
      { text: "Moderate effort", effect: 2 },
      { text: "Add playful twist", effect: 3 },
      { text: "Skip", effect: -2 }
    ]
  }
];

// ======== Episode 8 Scenario Pool ========
let episode8ScenarioPool = [
  {
    text: "Intensive Formation Drill: Mentor rearranges the team for optimal battle performance.",
    stat: "dancing",
    options: [
      { text: "Adapt quickly", effect: 3 },
      { text: "Try partially", effect: 2 },
      { text: "Resist change", effect: -1 },
      { text: "Ignore instructions", effect: -2 }
    ]
  },
  {
    text: "Combo Move Practice: Team must sync complex choreography with vocals.",
    stat: "dancing",
    options: [
      { text: "Lead effort", effect: 3 },
      { text: "Follow carefully", effect: 2 },
      { text: "Suggest minor tweaks", effect: 2 },
      { text: "Skip rehearsal", effect: -2 }
    ]
  },
  {
    text: "Senior Strategy Advice: A senior trainee suggests tactics to survive elimination.",
    stat: "teamwork",
    options: [
      { text: "Apply advice", effect: 3 },
      { text: "Apply partially", effect: 2 },
      { text: "Ignore", effect: -2 },
      { text: "Suggest own strategy", effect: 2 }
    ]
  },
  {
    text: "Mentor Chemistry Critique: Mentor says team lacks cohesion.",
    stat: "teamwork",
    options: [
      { text: "Organize bonding and practice", effect: 3 },
      { text: "Focus on own performance", effect: 2 },
      { text: "Help partially", effect: 2 },
      { text: "Ignore", effect: -2 }
    ]
  },
  {
    text: "Stage Spotlight Misalignment: Battle stage lights miss your team.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust positions", effect: 2 },
      { text: "Signal staff", effect: 1 },
      { text: "Continue performance", effect: 1 },
      { text: "Freeze", effect: -2 }
    ]
  },
  {
    text: "Music Cue Problem: Audio miscue occurs mid-performance.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust immediately", effect: 3 },
      { text: "Suggest fix", effect: 2 },
      { text: "Continue", effect: 1 },
      { text: "Stop performance", effect: -2 }
    ]
  },
  {
    text: "Fan Engagement Mid-Battle: Fans react to playful gestures (lipbite, aegyo, acting cool).",
    stat: "fanService",
    options: [
      { text: "Engage fully", effect: 4 },
      { text: "Subtle gestures", effect: 2 },
      { text: "Style-focused performance", effect: 3 },
      { text: "Ignore fans", effect: -2 }
    ]
  },
  {
    text: "Social Media Promo Clip: Fans request a short team promo video.",
    stat: "fanService",
    options: [
      { text: "Give full energy", effect: 4 },
      { text: "Moderate effort", effect: 2 },
      { text: "Add humor", effect: 3 },
      { text: "Skip", effect: -2 }
    ]
  }
];

// ======== Episode 9 Scenario Pool ========
let episode9ScenarioPool = [
  {
    text: "Synchronization Drill: Mentor asks the debut candidates to nail a difficult team formation.",
    stat: "dancing",
    options: [
      { text: "Lead and coordinate", effect: 4 },
      { text: "Follow precisely", effect: 3 },
      { text: "Suggest minor tweaks", effect: 2 },
      { text: "Ignore group effort", effect: -2 }
    ]
  },
  {
    text: "Solo Spotlight Prep: A chance to show your strongest solo before selection.",
    stat: "singing",
    options: [
      { text: "Rehearse fully", effect: 4 },
      { text: "Moderate practice", effect: 2 },
      { text: "Focus on favorite segment", effect: 2 },
      { text: "Skip practice", effect: -2 }
    ]
  },
  {
    text: "Mentor’s Tactical Critique: Mentor points out weaknesses in your performance strategy.",
    stat: "teamwork",
    options: [
      { text: "Apply all suggestions", effect: 3 },
      { text: "Implement partially", effect: 2 },
      { text: "Stick to own style", effect: 2 },
      { text: "Ignore", effect: -2 }
    ]
  },
  {
    text: "Senior Observation: Senior trainees watch for creative potential in debut challengers.",
    stat: "teamwork",
    options: [
      { text: "Impress with creativity", effect: 3 },
      { text: "Follow directions closely", effect: 2 },
      { text: "Suggest minor adjustments", effect: 2 },
      { text: "Ignore their advice", effect: -2 }
    ]
  },
  {
    text: "Formation Chaos: Stage team misaligns during rehearsal.",
    stat: "teamwork",
    options: [
      { text: "Lead correction", effect: 3 },
      { text: "Signal restart", effect: 2 },
      { text: "Focus on self only", effect: 1 },
      { text: "Ignore", effect: -1 }
    ]
  },
  {
    text: "Audio/Lighting Issue: Spotlight and backing track are off during pre-finale stage.",
    stat: "stagePerformance",
    options: [
      { text: "Adjust and perform", effect: 3 },
      { text: "Signal staff", effect: 1 },
      { text: "Continue normally", effect: 1 },
      { text: "Freeze on stage", effect: -2 }
    ]
  },
  {
    text: "Fan Engagement in Battle: Fans react to aegyo, lipbites, or stylish poses mid-stage.",
    stat: "fanService",
    options: [
      { text: "Perform full fan service", effect: 4 },
      { text: "Subtle gestures", effect: 2 },
      { text: "Focus on skill, ignore gestures", effect: 3 },
      { text: "Skip interaction", effect: -2 }
    ]
  },
  {
    text: "Social Media Teaser Clip: Fans request a teaser of your pre-finale stage performance.",
    stat: "fanService",
    options: [
      { text: "High-energy clip", effect: 4 },
      { text: "Moderate clip", effect: 2 },
      { text: "Add playful twist", effect: 3 },
      { text: "Skip posting", effect: -2 }
    ]
  }
];

// ======== Game Initialization ========
function customForeign() {
  let nationality = prompt("Enter your nationality:");
  startGame(nationality);
}

function startGame(type) {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  // Initialize player
  player = {
    name: "You",
    nationality: type,
    age: Math.floor(Math.random()*7)+15,
    singing: Math.floor(Math.random()*10)+10,
    dancing: Math.floor(Math.random()*10)+10,
    rap: Math.floor(Math.random()*10)+10,
    visual: Math.floor(Math.random()*10)+10,
    votes: 50,
    rank: 111
  };

  initializeNPCs();
  generateScenarios();
  updateStats();
  startScenario();
}

// ======== NPC Generation ========
function initializeNPCs() {
  npcs = [];
  for (let i=1;i<=111;i++) {
    let nationality = nationalities[Math.floor(Math.random()*nationalities.length)];
    let trait = npcTraits[Math.floor(Math.random()*npcTraits.length)];
    npcs.push({
      name: "Player " + i,
      nationality: nationality,
      trait: trait,
      singing: Math.floor(Math.random()*70)+30,
      dancing: Math.floor(Math.random()*70)+30,
      rap: Math.floor(Math.random()*70)+30,
      visual: Math.floor(Math.random()*70)+30,
      votes: Math.floor(Math.random()*50),
      team: "",
      rank: 111
    });
  }
}

// ======== Scenario Management ========
function generateScenarios() {
  scenarios = [];
  let pool = [...scenarioPool];
  while(scenarios.length<20){
    let idx = Math.floor(Math.random()*pool.length);
    scenarios.push(pool[idx]);
    pool.splice(idx,1);
  }
}

function updateStats() {
  document.getElementById("playerStats").innerText = 
    `Singing: ${player.singing} | Dancing: ${player.dancing} | Rap: ${player.rap} | Visual: ${player.visual} | Votes: ${player.votes}`;
  document.getElementById("episodeInfo").innerText = `Episode ${episode} / ${totalEpisodes}`;
}

// ======== Scenario Display (Fixed for Android) ========
const optionsDiv = document.getElementById("options");

// Create buttons once
if (optionsDiv.childElementCount === 0) {
  for (let i = 0; i < 4; i++) {
    const btn = document.createElement("button");
    btn.addEventListener("click", () => selectOption(i));
    btn.addEventListener("touchend", () => selectOption(i));
    optionsDiv.appendChild(btn);
  }
}

function startScenario() {
  scenarioIndex = 0;
  showScenario();
}

function showScenario() {
  if (scenarioIndex >= scenarios.length) {
    endEpisode();
    return;
  }

  clearInterval(timerInterval); // stop previous timer

  let sc = scenarios[scenarioIndex];
  document.getElementById("scenarioText").innerText = sc.text;

  // Update button text and effect
  sc.options.forEach((opt, i) => {
    const btn = optionsDiv.children[i];
    btn.innerText = opt.text;
    btn.dataset.effect = opt.effect;
  });

  // Reset timer
  timer = 10;
  document.getElementById("timer").innerText = timer;
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = timer;
    if(timer <= 0){
      clearInterval(timerInterval);
      autoPick();
    }
  }, 1000);
}

// ======== Scenario Choices ========
function selectOption(index) {
  clearInterval(timerInterval);
  let sc = scenarios[scenarioIndex];
  let effect = sc.options[index].effect;
  applyEffect(sc.stat,effect);
  scenarioIndex++;
  showScenario();
}

function autoPick() {
  let sc = scenarios[scenarioIndex];
  let effect = sc.options[3].effect; // default regression
  applyEffect(sc.stat,effect);
  scenarioIndex++;
  showScenario();
}

function applyEffect(stat,value) {
  if(stat=="singing") player.singing += value;
  else if(stat=="dancing") player.dancing += value;
  else if(stat=="rap") player.rap += value;
  else if(stat=="visual") player.visual += value;
  else player.votes += value;

  // Boundaries
  player.singing = Math.max(0,player.singing);
  player.dancing = Math.max(0,player.dancing);
  player.rap = Math.max(0,player.rap);
  player.visual = Math.max(0,player.visual);
  player.votes = Math.max(0,player.votes);

  updateStats();
}

// ======== Episode & Elimination Logic ========
function endEpisode() {
  let eliminationThreshold = 40; // Example threshold
  if(episode === 1) eliminationThreshold = 30; // first episode mentor-only

  if(player.singing < eliminationThreshold || player.dancing < eliminationThreshold ||
     player.rap < eliminationThreshold || player.visual < eliminationThreshold){
    endGame("You were eliminated this episode!");
  } else if(episode >= totalEpisodes){
    calculateDebut();
  } else {
    episode++;
    generateScenarios();
    startScenario();
  }
}

// ======== Debut Outcome ========
function calculateDebut() {
  let positions = [];
  if(player.singing >= 86) positions.push("Main Vocalist");
  else if(player.singing >= 70) positions.push("Lead Vocalist");

  if(player.dancing >= 86) positions.push("Main Dancer");
  else if(player.dancing >= 70) positions.push("Lead Dancer");

  if(player.rap >= 86) positions.push("Main Rapper");
  else if(player.rap >= 70) positions.push("Lead Rapper");

  let role = "";
  if(player.visual >= 90) role+="Visual, ";
  if(player.rank === 1) role+="Center, ";
  if(player.age === Math.min(...npcs.map(n=>n.age))) role+="Maknae, ";
  if(player.age === Math.max(...npcs.map(n=>n.age))) role+="Eldest, ";
  role = role.slice(0,-2);

  endGame(`Congrats! You debuted as ${positions.join(", ")}${role?(", "+role):""}`);
}

// ======== End & Restart ========
function endGame(message) {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");
  document.getElementById("endMessage").innerText = message;
}

function restartGame() {
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("intro").classList.remove("hidden");
    }
