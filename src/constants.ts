import { BranchType, StudentStats, QuizQuestion, PlacementCompany } from './types';

export interface Landmark {
  id: string;
  name: string;
  alternateName?: string;
  shortDescription: string;
  longDescription: string;
  emoji: string;
  themeColor: string;
  activities: {
    name: string;
    description: string;
    energyCost: number;
    moneyCost: number;
    effects: (stats: StudentStats) => {
      stats: Partial<StudentStats>;
      log: string;
    };
  }[];
}

export const BRANCH_DETAILS: Record<BranchType, {
  name: string;
  description: string;
  startStats: StudentStats;
  perks: string;
}> = {
  CSE: {
    name: 'Computer Science & Engineering',
    description: 'The golden child of NITJ. High coding skills, but high peer pressure and extreme placement cutthroat competitions.',
    startStats: { cgpa: 7.2, attendance: 85, codingSkill: 35, energy: 100, money: 1000, happiness: 70 },
    perks: 'Bonus to coding skill gains'
  },
  ECE: {
    name: 'Electronics & Communication',
    description: 'Toughest syllabus on campus. Balancing microcontrollers and coding while trying not to get debarred by HOD.',
    startStats: { cgpa: 6.8, attendance: 78, codingSkill: 20, energy: 85, money: 1200, happiness: 55 },
    perks: 'Eligible for ECE Core + Tech Placements, starts with more pocket money'
  },
  IT: {
    name: 'Information Technology',
    description: 'Practically CSE but with a slightly more chilled vibe, and coding LAN sessions in MBH hostels.',
    startStats: { cgpa: 7.1, attendance: 82, codingSkill: 30, energy: 100, money: 1000, happiness: 80 },
    perks: 'Higher baseline happiness and less placement stress'
  },
  ME: {
    name: 'Mechanical Engineering',
    description: 'Heavy machinery, endless workshops in the burning Jalandhar heat, and a 100% male ratio in the back benches.',
    startStats: { cgpa: 7.8, attendance: 88, codingSkill: 5, energy: 100, money: 1500, happiness: 75 },
    perks: 'High energy and starting core CGPA, but coding is zero'
  },
  CE: {
    name: 'Civil Engineering',
    description: 'Endless surveying on the sports ground. Very relaxed exams, but HOD demands strict attendance.',
    startStats: { cgpa: 8.0, attendance: 90, codingSkill: 0, energy: 95, money: 1300, happiness: 85 },
    perks: 'Starts with high attendance and top-tier CGPA'
  },
  CH: {
    name: 'Chemical Engineering',
    description: 'A perfect blend of relaxed life, fluid dynamics labs, and canteens scouting.',
    startStats: { cgpa: 7.9, attendance: 85, codingSkill: 10, energy: 105, money: 1100, happiness: 80 },
    perks: 'Low energy burn rate and steady grades'
  },
  EE: {
    name: 'Electrical Engineering',
    description: 'Fascinated by high-voltage currents, but deeply depressed by electric circuit theory exams and strict lab wardens.',
    startStats: { cgpa: 7.0, attendance: 80, codingSkill: 15, energy: 90, money: 1000, happiness: 60 },
    perks: 'Can handle high-stress situations'
  },
  BT: {
    name: 'Biotechnology',
    description: 'Highest average CGPA. Lab experiments are chilled and the professors of Science Block are relative scoring friendly.',
    startStats: { cgpa: 8.4, attendance: 85, codingSkill: 5, energy: 110, money: 1200, happiness: 90 },
    perks: 'High baseline happiness and high CGPA start'
  }
};

export const CAMPUS_LANDMARKS: Landmark[] = [
  {
    id: 'mbh',
    name: 'Mega Boys Hostel (MBH-F/G) / Girls Hostel (MHB)',
    alternateName: 'Hostel Rooms',
    shortDescription: 'Your primary sanctuary. Power outages, fast LAN gaming, and 3 AM noodles.',
    longDescription: 'The nerve center of student culture. Home of night-long discussions, Valorant/CS:GO lobbies, last-minute exams cramming, and laundry stacks that defy gravity.',
    emoji: '🏢',
    themeColor: 'from-amber-500 to-orange-600',
    activities: [
      {
        name: 'Sleep and Recharge',
        description: 'Take a solid 8-hour sleep (or afternoon nap) to regain power.',
        energyCost: -45,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: 45, happiness: 5 },
          log: 'You took a deep nap. Fell asleep while thinking of Fourier transforms.'
        })
      },
      {
        name: 'Late Night High-Speed LAN Gaming',
        description: 'Play competitive shooter games with boys in MBH-F or girls in MHB.',
        energyCost: 15,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: -15, happiness: 25, codingSkill: 1 },
          log: 'Clutched a 1v4 round! The entire corridor cheered. Happiness soared, but you missed a night of sleep.'
        })
      },
      {
        name: 'Intense Self-Study',
        description: 'Read notes in the study room to keep your GPA afloat.',
        energyCost: 20,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: -20, cgpa: 0.1, happiness: -10 },
          log: 'You redid 3 past-year papers. Your brain is frying, but your CGPA looks promising.'
        })
      }
    ]
  },
  {
    id: 'it_block',
    name: 'IT Block & Computer Centre',
    alternateName: 'Main Classrooms',
    shortDescription: 'The frozen halls of lectures, labs, and attendance logs.',
    longDescription: 'Whether it is the thermal dynamics lecture or object-oriented programming labs, this building holds the keys to your degree. Beware the 75% attendance rule!',
    emoji: '🏫',
    themeColor: 'from-blue-600 to-indigo-700',
    activities: [
      {
        name: 'Attend All Lectures',
        description: 'Sit in the front row and actively take notes under strict professors.',
        energyCost: 25,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: -25, attendance: 8, cgpa: 0.15, happiness: -5 },
          log: 'Attended 4 hours of lectures. The professor noticed you as a sincere student! Attendance +8%.'
        })
      },
      {
        name: 'Sit on Back Bench & Code',
        description: 'Open LeetCode behind a friend\'s laptop screen.',
        energyCost: 15,
        moneyCost: 0,
        effects: (stats) => ({
          stats: { energy: -15, codingSkill: 6, attendance: 2 },
          log: 'Solved a binary tree Hard question! The professor was talking about microchips, but you didn\'t listen. Coding Skill +6.'
        })
      },
      {
        name: 'Bake a Fake Medical Certificate',
        description: 'Try to submit a medical slip or request attendance adjustment.',
        energyCost: 10,
        moneyCost: 150,
        effects: () => {
          const success = Math.random() > 0.4;
          return {
            stats: { 
              energy: -10, 
              money: -150,
              attendance: success ? 12 : 0, 
              happiness: success ? 15 : -20 
            },
            log: success 
              ? 'Success! The office clerk approved your medical certificate. Attendance increased by 12%.'
              : 'Failed! The Dean caught you and laughed, "This hospital is 500 km away." No attendance restored!'
          };
        }
      }
    ]
  },
  {
    id: 'library',
    name: 'Central Library',
    alternateName: 'Self Study Haven',
    shortDescription: 'AC-cooled, pin-drop silence, containing books and exam preppers.',
    longDescription: 'The central library offers state-of-the-art facilities, intense study booths, and high-speed Wi-Fi to research placement materials or sleep under high-capacity AC.',
    emoji: '📚',
    themeColor: 'from-teal-600 to-emerald-700',
    activities: [
      {
        name: 'Prepare for Mid-Sems / End-Sems',
        description: 'Study standard textbooks recommended by professors.',
        energyCost: 20,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: -20, cgpa: 0.25, happiness: -8 },
          log: 'Memorized the textbook derivations! You feel ready to battle the toughest question papers. CGPA potential increased!'
        })
      },
      {
        name: 'Do System Placement Prep',
        description: 'Study algorithm designs, DBMS, and core OS questions.',
        energyCost: 15,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: -15, codingSkill: 8, happiness: -5 },
          log: 'Learned Dijkstra, Red-Black Trees, and OS Deadlock prevention. Resume power increased.'
        })
      }
    ]
  },
  {
    id: 'shopping_complex',
    name: 'Shopping Complex & Amul Shop',
    alternateName: 'Snack Joint',
    shortDescription: 'The foodie hub of NITJ. Shakes, patties, tea, and chit-chat.',
    longDescription: 'Popular hangout spot right in the center of the campus. Order hot crispy potato patties, thick chocolate Amul shakes, and sit with classmates.',
    emoji: '🍔',
    themeColor: 'from-pink-500 to-rose-600',
    activities: [
      {
        name: 'Buy Hot Crispy Patty & Tea',
        description: 'Crunchy potato patty with rich Punjabi sweet chai.',
        energyCost: -15,
        moneyCost: 50,
        effects: () => ({
          stats: { energy: 20, money: -50, happiness: 10 },
          log: 'Had a steaming hot Amul Patty and a cup of special ginger tea. Ultimate satisfaction!'
        })
      },
      {
        name: 'Chug Amul Chocolate Shake',
        description: 'The thick, cold drink that cures all academic depression.',
        energyCost: -25,
        moneyCost: 70,
        effects: () => ({
          stats: { energy: 30, money: -70, happiness: 15 },
          log: 'Chugged down a double-chocolate shake. You got an sugar rush! Energy booster activate.'
        })
      },
      {
        name: 'Socialize & Bunk with Friends',
        description: 'Sit under the shady trees and gossip about the placement coordinators.',
        energyCost: 10,
        moneyCost: 40,
        effects: () => ({
          stats: { energy: -10, money: -40, happiness: 25, attendance: -5 },
          log: 'Hours flew by laughing at college stories. You skipped a tutorial class. Happiness +25, Attendance -5%.'
        })
      }
    ]
  },
  {
    id: 'mega_mess',
    name: 'The Mega Mess',
    alternateName: 'Dining Hall',
    shortDescription: 'Durable energy but sometimes questionable flavors.',
    longDescription: 'The food that runs the institute. Wednesday Special is Paneer dinner, Sunday brings some sweet pudding. Other days, we query what kind of dal this is.',
    emoji: '🍛',
    themeColor: 'from-violet-600 to-purple-800',
    activities: [
      {
        name: 'Eat regular Daily Food',
        description: 'Free (included in hostel card) but takes physical courage.',
        energyCost: -25,
        moneyCost: 0,
        effects: () => {
          const badMessDay = Math.random() > 0.61;
          return {
            stats: { 
              energy: 25, 
              happiness: badMessDay ? -15 : 5 
            },
            log: badMessDay 
              ? 'Today\'s yellow dal was basically spiced water. You ate, but your disappointed soul lost happiness.'
              : 'The mess food was surprisingly decent today. Tandoori roti was warm and soft.'
          };
        }
      },
      {
        name: 'Special Dinner (Wednesday/Sunday)',
        description: 'Festive feast of Paneer butter masala or special gulab jamun.',
        energyCost: -35,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: 35, happiness: 15 },
          log: 'Wednesday night! There was a massive line, but you sneaked in early and secured a massive serving of Shahi Paneer! Bliss.'
        })
      }
    ]
  },
  {
    id: 'oat',
    name: 'Open Air Theatre (OAT) & Sports Ground',
    alternateName: 'Culture & Clubs',
    shortDescription: 'The stage of cultural fests, star nights, and street plays.',
    longDescription: 'Under the beautiful skies, the grand OAT is where cultural clubs like RTIST, Music Club, Lit Club practice. Run a lap or showcase your talents here!',
    emoji: '🎭',
    themeColor: 'from-yellow-500 to-amber-600',
    activities: [
      {
        name: 'Attend Club Practice (RTIST/Spic Macay)',
        description: 'Drape banners, practice guitar chords, or work on design posters.',
        energyCost: 20,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: -20, happiness: 20 },
          log: 'Helped plan the next flash mob! Got dynamic feedback from seniors and shared a joke. Happiness +20.'
        })
      },
      {
        name: 'Jog & Play Cricket on Sports Ground',
        description: 'Get some fresh Punjabi air and keep fit.',
        energyCost: 15,
        moneyCost: 0,
        effects: () => ({
          stats: { energy: -15, happiness: 15, energyMaxModifier: 5 }, // Represented as logic
          log: 'Played a 5-over cricket game under the floodlights. Smashed a six! Energy is spent, but you feel athletic.'
        })
      }
    ]
  },
  {
    id: 'gt_road',
    name: 'Exit to GT Road (NH-1)',
    alternateName: 'Offcampus Outing',
    shortDescription: 'Escape the campus boundaries. Autos, movies, and Haveli.',
    longDescription: 'Outside Gate-1 lies the historic Grand Trunk Road bypass. Book an auto to go to Haveli, eat classic butter naans and lassi, or catch a Bollywood movie in Jalandhar City.',
    emoji: '🛣️',
    themeColor: 'from-slate-700 to-zinc-900',
    activities: [
      {
        name: 'Go to Jalandhar Haveli',
        description: 'Vibrant Punjabi theme-park restaurant with legendary food.',
        energyCost: 15,
        moneyCost: 350,
        effects: () => ({
          stats: { energy: -15, money: -350, happiness: 35 },
          log: 'Ate premium Dal Makhani, Paneer Tikka, and gulped down a huge clay glass of Sweet Patiala Lassi. Absolutely legendary!'
        })
      },
      {
        name: 'Watch Movie in Jalandhar Mall',
        description: 'Take a long 3-hour movie break with friends.',
        energyCost: 10,
        moneyCost: 250,
        effects: () => ({
          stats: { energy: -10, money: -250, happiness: 25, attendance: -8 },
          log: 'Bunked the lab class to watch a crazy blockbuster movie in town. Got movie popcorn and popped out of our shells!'
        })
      }
    ]
  }
];

export const GENERAL_RANDOM_EVENTS = [
  "Due to sudden dense fog of winter in Punjab, NITJ morning classes are delayed by 2 hours!",
  "A group of campus stray dogs chase you near the IT building block. You sprinted like Bolt and escaped! Energy -5, Fitness +1.",
  "Warden announces sudden surprise room search for electric heaters and induction plates! You hid your kettle inside a laundry bucket safely.",
  "Hostel Wi-Fi breaks down right when everyone was pushing ranks in Valorant. Massive screams echoing from the windows.",
  "A high-ranking senior reviews your resume and says: 'Good, but add dynamic projects or get debarred!'",
  "Rains in Jalandhar turn the Sports Ground into a swimming pool. Class cancelation rumors spread!",
  "You went to the main gate to collect your Amazon package but the guard didn't let you cross the threshold without gate pass. Standard debate with guard.",
  "Utkansh theme is released! The whole campus is decorated with beautiful self-made lanterns and graffiti."
];

export const ACADEMIC_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 'q1_1',
      question: 'In Engineering Mathematics, what is the value of the limit: lim (x -> 0) of (sin x) / x ?',
      options: ['0', '1', 'Infinity', 'Undefined'],
      correctIndex: 1,
      explanation: 'Using L\'Hopital\'s rule or basic Taylor series, the limit of (sin x)/x as x goes to 0 is 1.',
      rewardType: 'cgpa',
      rewardAmount: 0.2
    },
    {
      id: 'q1_2',
      question: 'Which element has the highest thermal conductivity at room temperature among metals?',
      options: ['Silver', 'Copper', 'Gold', 'Aluminium'],
      correctIndex: 0,
      explanation: 'Silver has the highest thermal conductivity (and electrical conductivity) of any metal.',
      rewardType: 'cgpa',
      rewardAmount: 0.15
    },
    {
      id: 'q1_3',
      question: 'In C programming, what is the operator value of x if: x = 5 & 3? (bitwise AND)',
      options: ['1', '8', '5', '3'],
      correctIndex: 0,
      explanation: '5 is 101 in binary, 3 is 011 in binary. Bitwise AND of 101 and 011 is 001, which is 1.',
      rewardType: 'codingSkill',
      rewardAmount: 5
    }
  ],
  2: [
    {
      id: 'q2_1',
      question: 'Which of the following sorting algorithms has worst-case time complexity of O(N log N)?',
      options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'],
      correctIndex: 2,
      explanation: 'Merge Sort guarantees O(N log N) in all cases, whereas Quick Sort can degrade to O(N^2) on fully sorted arrays.',
      rewardType: 'codingSkill',
      rewardAmount: 8
    },
    {
      id: 'q2_2',
      question: 'In digital logic gates, what is the output of an XOR gate when the inputs are 1 and 1?',
      options: ['0', '1', 'High Impedance', 'Not defined'],
      correctIndex: 0,
      explanation: 'XOR gate outputs 1 only when inputs are strictly different. For identical inputs, output is 0.',
      rewardType: 'cgpa',
      rewardAmount: 0.2
    }
  ],
  3: [
    {
      id: 'q3_1',
      question: 'Which level in the OSI network model is responsible for routing packers and logical addressing (IP addresses)?',
      options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Physical Layer'],
      correctIndex: 2,
      explanation: 'The Network Layer handles routing, path selection, and IP network addressing.',
      rewardType: 'codingSkill',
      rewardAmount: 10
    },
    {
      id: 'q3_2',
      question: 'What does ACID stand for in Database Management Systems (DBMS)?',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Accuracy, Consistency, Integration, Duplication',
        'Authority, Concurrency, Isolation, Distribution',
        'Atomicity, Concurrency, Indexing, Directness'
      ],
      correctIndex: 0,
      explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability, ensuring transaction reliability.',
      rewardType: 'cgpa',
      rewardAmount: 0.25
    }
  ],
  4: [
    {
      id: 'q4_1',
      question: 'In Object-Oriented Analysis, which solid principle stands for the "O" in SOLID?',
      options: ['Overloading Principle', 'Open-Closed Principle', 'Object-Oriented Pattern', 'Optimization Principle'],
      correctIndex: 1,
      explanation: 'The O stands for the Open-Closed Principle: software entities should be open for extension, but closed for modification.',
      rewardType: 'codingSkill',
      rewardAmount: 12
    },
    {
      id: 'q4_2',
      question: 'What is the time complexity to insert a new key in a standard balanced red-black tree with N elements?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctIndex: 1,
      explanation: 'In a balanced binary search tree like Red-Black tree, insertion, search, and deletion take O(log N) time.',
      rewardType: 'codingSkill',
      rewardAmount: 15
    }
  ]
};

export const PLACEMENT_COMPANIES: PlacementCompany[] = [
  {
    name: 'Noida Startup (Lollypop Labs)',
    role: 'Full Stack Intern + FTE',
    minCgpa: 6.0,
    minCoding: 20,
    package: 4.5,
    rounds: [
      {
        name: 'Aptitude & Basic Code',
        type: 'aptitude',
        description: 'Answer simple loops riddles and logical math puzzles.',
        passChance: (stats) => Math.min(95, stats.codingSkill * 1.5 + stats.cgpa * 5)
      },
      {
        name: 'HR & Salary Negotiation',
        type: 'hr',
        description: 'Prove why you can work 12 hours a day and drink endless instant coffee.',
        passChance: (stats) => Math.min(95, stats.happiness * 1.2)
      }
    ]
  },
  {
    name: 'Larsen & Toubro (L&T) Core',
    role: 'Graduate Engineer Trainee',
    minCgpa: 7.0,
    minCoding: 5,
    package: 6.5,
    rounds: [
      {
        name: 'Core Branch Technical Test',
        type: 'technical',
        description: 'Solve heavy questions on fluid dynamics, surveying, or circuit formulas depending on state.',
        passChance: (stats) => Math.min(95, stats.cgpa * 11)
      },
      {
        name: 'Managerial Interview',
        type: 'hr',
        description: 'Assess stability, willingness to relocate to construction sites or high voltage labs.',
        passChance: (stats) => 75
      }
    ]
  },
  {
    name: 'Capgemini / Infosys (Mass Recruiter)',
    role: 'System Analyst / Associate Engineer',
    minCgpa: 6.5,
    minCoding: 15,
    package: 4.2,
    rounds: [
      {
        name: 'Cognitive & PseudoCode Test',
        type: 'coding',
        description: 'Solve dry-run array print statements.',
        passChance: (stats) => Math.min(95, stats.codingSkill * 2 + stats.cgpa * 4)
      },
      {
        name: 'One-on-One Skype Interview',
        type: 'technical',
        description: 'State what polymorphism means in 2 lines.',
        passChance: (stats) => Math.min(95, stats.cgpa * 10)
      }
    ]
  },
  {
    name: 'Texas Instruments (TI) Core',
    role: 'Silicon Validation Engineer',
    minCgpa: 8.0,
    minCoding: 40,
    package: 18.0,
    rounds: [
      {
        name: 'Verilog & CMOS Electrical Test',
        type: 'technical',
        description: 'Extravagant logic analyzer charts, flip-flops, and setup-hold time calculations.',
        passChance: (stats) => Math.min(90, stats.cgpa * 8 + stats.codingSkill * 0.5)
      },
      {
        name: 'Intense Design Board Panel',
        type: 'technical',
        description: 'Draw standard logic pipelines on whiteboard under 4 PhD level interviewers.',
        passChance: (stats) => Math.min(90, stats.codingSkill * 0.8)
      }
    ]
  },
  {
    name: 'Amazon India',
    role: 'Software Development Engineer (SDE-1)',
    minCgpa: 7.5,
    minCoding: 60,
    package: 32.0,
    rounds: [
      {
        name: 'OA Dynamic Programming',
        type: 'coding',
        description: '2 Hard LeetCode questions involving complex DFS grid navigation or string optimization.',
        passChance: (stats) => Math.min(90, stats.codingSkill * 1.2)
      },
      {
        name: 'Data Structures and Algorithms Interview',
        type: 'technical',
        description: 'Implement LRU Cache on the spot in O(1) time complexity and handle edge cases.',
        passChance: (stats) => Math.min(85, stats.codingSkill * 1.1)
      },
      {
        name: 'System Design & Leadership Principles',
        type: 'hr',
        description: 'Demonstrate customer obsession and explain a trade-off you solved during your major project.',
        passChance: (stats) => Math.min(90, stats.happiness * 0.7 + stats.cgpa * 3)
      }
    ]
  },
  {
    name: 'Google India (Dream Off-Campus Offer)',
    role: 'Associate Software Engineer',
    minCgpa: 8.5,
    minCoding: 85,
    package: 45.0,
    rounds: [
      {
        name: 'Google Online Challenge',
        type: 'coding',
        description: 'Solve highly complex math/competitive coding problems on trees and bitmasking.',
        passChance: (stats) => Math.min(80, stats.codingSkill * 0.9)
      },
      {
        name: 'Googleyness & Leadership Interview',
        type: 'hr',
        description: 'Show how you deal with ambiguity, conflict, and represent inclusive engineering ethics.',
        passChance: (stats) => Math.min(95, stats.happiness * 1.2)
      },
      {
        name: 'Technical Screening III',
        type: 'technical',
        description: 'Advanced graph coloring, network flows, and recursive backtracking algorithm optimization.',
        passChance: (stats) => Math.min(80, stats.codingSkill * 0.85)
      }
    ]
  }
];
