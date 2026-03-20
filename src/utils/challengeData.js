// Challenge configuration
// Each challenge unlocks on a different day of the event
// dayIndex: 0 = Day 1, 1 = Day 2, etc.
// For demo purposes, all challenges can be toggled via admin

export const CHALLENGES = [
  {
    id: 'snake',
    dayIndex: 0,
    title: 'SERPENT PROTOCOL',
    subtitle: 'Neural Snake Matrix',
    description: 'Navigate the serpentine matrix. Consume data packets to grow stronger. One mistake resets the simulation.',
    icon: '🐍',
    color: 'nova',
    colorHex: '#00ff9d',
    game: 'snake',
    maxPoints: 100,
    ieeeAfterFact: {
      title: 'IEEE Opens Global Doors',
      body: 'IEEE connects you to 400,000+ engineers in 160+ countries. Your network is your net worth.',
      icon: '🌍',
    },
  },
  {
    id: 'quiz',
    dayIndex: 1,
    title: 'KNOWLEDGE NEXUS',
    subtitle: 'IEEE Intelligence Test',
    description: 'Prove your mastery of IEEE knowledge, technology, and innovation. Speed and accuracy both matter.',
    icon: '🧠',
    color: 'plasma',
    colorHex: '#7b2fff',
    game: 'quiz',
    maxPoints: 100,
    ieeeAfterFact: {
      title: 'IEEE Competitions & Scholarships',
      body: 'IEEE members win thousands of scholarships and compete in global hackathons with life-changing prizes.',
      icon: '🏆',
    },
  },
  {
    id: 'reaction',
    dayIndex: 2,
    title: 'SYNAPSE RUSH',
    subtitle: 'Reaction Time Calibration',
    description: 'Test your neural response time. The machines react in microseconds — can you keep up?',
    icon: '⚡',
    color: 'pulse',
    colorHex: '#ff2d7e',
    game: 'reaction',
    maxPoints: 100,
    ieeeAfterFact: {
      title: 'IEEE Technical Workshops',
      body: 'Active IEEE members get exclusive access to cutting-edge technical workshops, webinars, and industry seminars.',
      icon: '🔬',
    },
  },
  {
    id: 'memory',
    dayIndex: 3,
    title: 'MEMORY MATRIX',
    subtitle: 'Cognitive Pattern Lock',
    description: 'Your mind is your greatest weapon. Match the encoded patterns before the matrix collapses.',
    icon: '🔮',
    color: 'ion',
    colorHex: '#00d4ff',
    game: 'memory',
    maxPoints: 100,
    ieeeAfterFact: {
      title: 'IEEE Career Network',
      body: 'IEEE\'s career resources help members land top positions at NASA, Google, Tesla, and leading research labs worldwide.',
      icon: '🚀',
    },
  },
];

export const POINTS = {
  FIRST: 100,
  SECOND: 80,
  THIRD: 60,
  OTHER: 20,
};

export const ACHIEVEMENTS = [
  {
    id: 'first_challenge',
    title: 'FIRST CONTACT',
    description: 'Complete your first challenge',
    icon: '🎯',
    color: '#00d4ff',
  },
  {
    id: 'first_win',
    title: 'CIRCUIT BREAKER',
    description: 'Win a challenge (1st place)',
    icon: '👑',
    color: '#ffd700',
  },
  {
    id: 'top3',
    title: 'PODIUM PROTOCOL',
    description: 'Reach top 3 on any challenge',
    icon: '🥉',
    color: '#cd7f32',
  },
  {
    id: 'all_challenges',
    title: 'FULL SPECTRUM',
    description: 'Complete all 4 challenges',
    icon: '🌟',
    color: '#7b2fff',
  },
  {
    id: 'century',
    title: 'CENTURION',
    description: 'Score 100 points in a single challenge',
    icon: '💯',
    color: '#00ff9d',
  },
  {
    id: 'speed_demon',
    title: 'SPEED DAEMON',
    description: 'React in under 200ms',
    icon: '⚡',
    color: '#ff2d7e',
  },
  {
    id: 'perfect_memory',
    title: 'TOTAL RECALL',
    description: 'Complete memory game without errors',
    icon: '🔮',
    color: '#00d4ff',
  },
  {
    id: 'quiz_master',
    title: 'QUIZ OVERLORD',
    description: 'Answer 8+ quiz questions correctly',
    icon: '🧠',
    color: '#7b2fff',
  },
];

export const QUIZ_QUESTIONS = [
  {
    question: 'What does IEEE stand for?',
    options: [
      'Institute of Electrical and Electronics Engineers',
      'International Engineering and Electronics Enterprise',
      'Institute of Engineering and Electrical Experts',
      'International Electrical and Electronics Engineers',
    ],
    correct: 0,
  },
  {
    question: 'In which year was IEEE founded?',
    options: ['1963', '1972', '1945', '1954'],
    correct: 0,
  },
  {
    question: 'Which IEEE standard governs Wi-Fi networks?',
    options: ['802.11', '802.3', '802.15', '802.16'],
    correct: 0,
  },
  {
    question: 'What is the world\'s most cited technical publisher?',
    options: ['IEEE Xplore', 'ArXiv', 'Springer', 'Elsevier'],
    correct: 0,
  },
  {
    question: 'Which of these is NOT an IEEE Society?',
    options: [
      'Society of Petroleum Engineers',
      'Computer Society',
      'Signal Processing Society',
      'Robotics and Automation Society',
    ],
    correct: 0,
  },
  {
    question: 'What does CPU stand for?',
    options: [
      'Central Processing Unit',
      'Core Processing Unit',
      'Central Program Unit',
      'Computer Processing Unit',
    ],
    correct: 0,
  },
  {
    question: 'What language is used to style web pages?',
    options: ['CSS', 'HTML', 'JavaScript', 'Python'],
    correct: 0,
  },
  {
    question: 'Which protocol is used for secure data transmission over the internet?',
    options: ['HTTPS', 'HTTP', 'FTP', 'SMTP'],
    correct: 0,
  },
  {
    question: 'How many members does IEEE have globally?',
    options: ['400,000+', '100,000+', '1 million+', '250,000+'],
    correct: 0,
  },
  {
    question: 'What is the headquarters of IEEE?',
    options: [
      'Piscataway, New Jersey, USA',
      'New York City, USA',
      'London, UK',
      'Geneva, Switzerland',
    ],
    correct: 0,
  },
  {
    question: 'What does IoT stand for?',
    options: [
      'Internet of Things',
      'Integration of Technology',
      'Internet of Terminals',
      'Interface of Technology',
    ],
    correct: 0,
  },
  {
    question: 'Which layer of the OSI model handles routing?',
    options: ['Network Layer', 'Transport Layer', 'Session Layer', 'Data Link Layer'],
    correct: 0,
  },
];
