import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Cpu,
  Battery,
  Wallet,
  Heart,
  Award,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Sparkles,
  Smile,
  MapPin,
  ChevronRight,
  School,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Footprints,
  MessageSquare,
  Gift,
  Search,
  Maximize2
} from 'lucide-react';
import { BranchType, PlayerState, StudentStats } from './types';
import { CAMPUS_LANDMARKS, BRANCH_DETAILS, Landmark } from './constants';

// Extending types slightly for the 2D walking experience
interface GameNPC {
  id: string;
  name: string;
  title: string;
  emoji: string;
  x: number;
  y: number;
  dialogue: string[];
}

interface CampusQuest {
  id: string;
  title: string;
  description: string;
  targetLocationId: string;
  rewardText: string;
  status: 'ACTIVE' | 'COMPLETED';
}

const INITIAL_QUESTS: CampusQuest[] = [
  {
    id: 'quest_freshman',
    title: 'Attend Your First Lecture',
    description: 'Walk or navigate to the IT Block & Computer Centre to report in.',
    targetLocationId: 'it_block',
    rewardText: 'Unlocked Freshman Status, +5 CGPA focus',
    status: 'ACTIVE'
  },
  {
    id: 'quest_samosa',
    title: 'The Legendary Amul Patty',
    description: 'Head over to the Shopping Complex & Amul Shop to recharge your energy.',
    targetLocationId: 'shopping_complex',
    rewardText: 'Full Energy & Happiness rise',
    status: 'ACTIVE'
  },
  {
    id: 'quest_study',
    title: 'Prep for Mid-Sems',
    description: 'Visit the Central Library study desks to grab a study spot.',
    targetLocationId: 'library',
    rewardText: 'CGPA potential boost, +10% attendance',
    status: 'ACTIVE'
  },
  {
    id: 'quest_exit',
    title: 'The GT Road Outing',
    description: 'Walk to the Main Gate / NH-1 GT Road exit, explore off-campus flavor.',
    targetLocationId: 'gt_road',
    rewardText: 'High Punjab cultural vibes unlocked',
    status: 'ACTIVE'
  }
];

export default function App() {
  // Screen views: 'START', 'PLAY', 'GUIDE'
  const [screen, setScreen] = useState<'START' | 'PLAY'>('START');

  // Player setup
  const [playerName, setPlayerName] = useState('Karan');
  const [selectedBranch, setSelectedBranch] = useState<BranchType>('CSE');
  const [playerAvatarColor, setPlayerAvatarColor] = useState('#fbbf24'); // Default Amber
  const [gameState, setGameState] = useState<PlayerState | null>(null);

  // Time of Day system
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  
  // Game Quest tracking
  const [quests, setQuests] = useState<CampusQuest[]>(INITIAL_QUESTS);
  const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);

  // Active overlays
  const [nearLandmark, setNearLandmark] = useState<Landmark | null>(null);
  const [activeNpc, setActiveNpc] = useState<GameNPC | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showLocationSidebar, setShowLocationSidebar] = useState(true);

  // Interactive controls
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});

  // 2D Map Dimensions & Scaling
  const MAP_WIDTH = 1350;
  const MAP_HEIGHT = 1050;
  const VIEWPORT_WIDTH = 800;
  const VIEWPORT_HEIGHT = 520;

  // Player position state
  const [playerX, setPlayerX] = useState(650);
  const [playerY, setPlayerY] = useState(550);
  const [playerDirection, setPlayerDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isWalking, setIsWalking] = useState(false);

  // Click-to-move pointer
  const [clickTarget, setClickTarget] = useState<{ x: number; y: number } | null>(null);

  // References to the canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Map landmarks locations configuration with bounding circles
  const LANDMARK_COORDS: Record<string, { x: number; y: number; r: number; color: string }> = {
    mbh: { x: 220, y: 180, r: 100, color: '#f59e0b' }, // Amber
    it_block: { x: 500, y: 380, r: 100, color: '#3b82f6' }, // Blue
    library: { x: 1100, y: 360, r: 105, color: '#10b981' }, // Emerald
    shopping_complex: { x: 800, y: 550, r: 90, color: '#f43f5e' }, // Rose
    mega_mess: { x: 480, y: 160, r: 85, color: '#8b5cf6' }, // Violet
    oat: { x: 1050, y: 780, r: 110, color: '#eab308' }, // Yellow
    gt_road: { x: 250, y: 880, r: 90, color: '#475569' } // Slate
  };

  // Cute interactive human NPCs on NITJ campus
  const CAMPUS_NPCS: GameNPC[] = [
    {
      id: 'hod_sharma',
      name: 'Dr. Sharma (HOD)',
      title: 'Academic Head',
      emoji: '👨‍🏫',
      x: 520,
      y: 470,
      dialogue: [
        "Welcome student! Classes are held on time. No excuses for being late!",
        "Ensure your attendance is above 75%! I am extremely strict with my roster sheets.",
        "Your coding habits are essential, but do not ignore mathematics lectures."
      ]
    },
    {
      id: 'senior_arun',
      name: 'Arun (Placement Lead)',
      title: 'CSE Final Year Senior',
      emoji: '🎓',
      x: 230,
      y: 280,
      dialogue: [
        "Hey junior! Don't let mid-semester panic wear you down.",
        "Here's a secret: solve 2 LeetCode problems every day inside the library.",
        "Mass recruiters like TCS/Infosys will take anyone with high CGPA, but Amazon needs data structures mastery!"
      ]
    },
    {
      id: 'mess_uncle',
      name: 'Jaggu Uncle (Chef)',
      title: 'Mess In-Charge',
      emoji: '👨‍🍳',
      x: 520,
      y: 230,
      dialogue: [
        "Wednesday evening dinner is Special Paneer day kheer butter masala! Make sure to queue up early.",
        "Today's yellow dal smells like boiling water, but I got some fresh potato paranthas on the back gas if you study hard!"
      ]
    },
    {
      id: 'guard_paaji',
      name: 'Guard Sukhdev Singh',
      title: 'Gate Security Head',
      emoji: '👮',
      x: 250,
      y: 810,
      dialogue: [
        "Oye beta! Where is your outpass? Hostellers are not allowed outside Gate 1 without online permission!",
        "NH-1 GT Road road gets dark and dense with Jalandhar fog at night. Keep your student identity card with you."
      ]
    }
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        // Prevent default scrolling keys while inside simulated map block
        e.preventDefault();
      }
      setKeysPressed((prev) => ({ ...prev, [k]: true }));
      setClickTarget(null); // Cancel click pathing if keyboard is pressed
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      setKeysPressed((prev) => ({ ...prev, [k]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Set up game session on register submit
  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert("Please enter a valid student nickname!");
      return;
    }
    const startStats: StudentStats = BRANCH_DETAILS[selectedBranch].startStats;
    const initialPlayerState: PlayerState = {
      name: playerName,
      branch: selectedBranch,
      year: 1,
      day: 1,
      term: 'Autumn',
      stats: { ...startStats },
      historyLogs: [
        `🎒 Joined NIT Jalandhar's lovely campus! Selected branch: ${BRANCH_DETAILS[selectedBranch].name}.`,
        `💡 Walk with WASD or Arrow Keys, or simply CLICK anywhere on the grass field map to move!`,
        `📍 Approach any building or teacher npc to trigger interactive dialogue and fast-travel actions.`
      ],
      achievements: ['Freshman Entry'],
      clubsJoined: [],
      currentLocationId: 'mbh',
      isDebarred: false,
      placedCompany: null,
      placedSalary: null
    };

    setGameState(initialPlayerState);
    setScreen('PLAY');
    triggerToast(`Congratulations and welcome to NITJ! Complete your first quest near IT Block.`);
  };

  // Teleport/Skip movement directly to location
  const handleTeleportToLocation = (locId: string) => {
    const coord = LANDMARK_COORDS[locId];
    if (coord) {
      setPlayerX(coord.x + 10);
      setPlayerY(coord.y + 60);
      setClickTarget(null);
      triggerToast(`Flashed instantly to ${CAMPUS_LANDMARKS.find(l => l.id === locId)?.name}!`);
    }
  };

  // Action / Activity Trigger at landmarks
  const handleDoActivity = (activity: {
    name: string;
    description: string;
    energyCost: number;
    moneyCost: number;
    effects: (stats: StudentStats) => { stats: Partial<StudentStats>; log: string };
  }) => {
    if (!gameState) return;

    if (gameState.stats.energy < activity.energyCost) {
      triggerToast("❌ You are too tired! Take a quick nap inside Mega Hostel (MBH Room).");
      return;
    }
    if (gameState.stats.money < activity.moneyCost) {
      triggerToast("❌ Wallet empty! You cannot afford this meal or shopping ticket right now.");
      return;
    }

    const outcome = activity.effects(gameState.stats);
    
    // Update player parameters safely
    const originalStats = gameState.stats;
    const updatedStats = { ...originalStats };

    if (outcome.stats.cgpa !== undefined) updatedStats.cgpa = Math.min(10, Math.max(0, updatedStats.cgpa + outcome.stats.cgpa));
    if (outcome.stats.attendance !== undefined) updatedStats.attendance = Math.min(100, Math.max(0, updatedStats.attendance + outcome.stats.attendance));
    if (outcome.stats.codingSkill !== undefined) updatedStats.codingSkill = Math.min(100, Math.max(0, updatedStats.codingSkill + outcome.stats.codingSkill));
    if (outcome.stats.energy !== undefined) updatedStats.energy = Math.min(100, Math.max(0, updatedStats.energy + outcome.stats.energy));
    if (outcome.stats.money !== undefined) updatedStats.money = Math.max(0, updatedStats.money + outcome.stats.money);
    if (outcome.stats.happiness !== undefined) updatedStats.happiness = Math.min(100, Math.max(0, updatedStats.happiness + outcome.stats.happiness));

    // Deduct standard base costs
    updatedStats.energy = Math.max(0, updatedStats.energy - activity.energyCost);
    updatedStats.money = Math.max(0, updatedStats.money - activity.moneyCost);

    // Progression of day/time sequence
    let nextTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night' = 'Morning';
    let dayInc = 0;

    if (timeOfDay === 'Morning') nextTime = 'Afternoon';
    else if (timeOfDay === 'Afternoon') nextTime = 'Evening';
    else if (timeOfDay === 'Evening') nextTime = 'Night';
    else if (timeOfDay === 'Night') {
      nextTime = 'Morning';
      dayInc = 1;
    }

    const nextGameState = {
      ...gameState,
      day: gameState.day + dayInc,
      stats: updatedStats,
      historyLogs: [
        `🕒 [${timeOfDay}] - ${outcome.log}`,
        ...gameState.historyLogs
      ]
    };

    if (dayInc > 0) {
      // Daily allowance bonus every 5 days
      if (nextGameState.day % 5 === 0) {
        nextGameState.stats.money += 800;
        nextGameState.historyLogs.unshift(`💰 Pocket Money Transfer! Rupee ₹800 pocket cash allowance credited directly to your digital UPI.`);
      }
      nextGameState.stats.energy = Math.min(100, nextGameState.stats.energy + 10); // recovery overnight
    }

    setTimeOfDay(nextTime);
    setGameState(nextGameState);
    triggerToast(`Action Completed: "${activity.name}"`);
  };

  // Main game update ticks: controls velocity, collision, and click target pathing
  useEffect(() => {
    let active = true;
    const speed = 4.2;

    const gameTick = () => {
      if (!active || screen !== 'PLAY' || !gameState) return;

      let dx = 0;
      let dy = 0;
      let activeDir: 'down' | 'up' | 'left' | 'right' = playerDirection;
      let walkingState = false;

      // 1. Keyboard logic overriding
      if (keysPressed['w'] || keysPressed['arrowup']) {
        dy = -speed;
        activeDir = 'up';
        walkingState = true;
      } else if (keysPressed['s'] || keysPressed['arrowdown']) {
        dy = speed;
        activeDir = 'down';
        walkingState = true;
      }

      if (keysPressed['a'] || keysPressed['arrowleft']) {
        dx = -speed;
        activeDir = 'left';
        walkingState = true;
      } else if (keysPressed['d'] || keysPressed['arrowright']) {
        dx = speed;
        activeDir = 'right';
        walkingState = true;
      }

      // 2. Click target processing (walking toward mouse pointer tap)
      if (!walkingState && clickTarget) {
        const gapX = clickTarget.x - playerX;
        const gapY = clickTarget.y - playerY;
        const dist = Math.hypot(gapX, gapY);

        if (dist > 5) {
          dx = (gapX / dist) * speed;
          dy = (gapY / dist) * speed;
          walkingState = true;
          
          if (Math.abs(gapX) > Math.abs(gapY)) {
            activeDir = gapX > 0 ? 'right' : 'left';
          } else {
            activeDir = gapY > 0 ? 'down' : 'up';
          }
        } else {
          setClickTarget(null);
        }
      }

      // Apply positions safely within map coordinate bounds
      if (walkingState) {
        const newX = Math.min(MAP_WIDTH - 25, Math.max(25, playerX + dx));
        const newY = Math.min(MAP_HEIGHT - 25, Math.max(25, playerY + dy));
        
        // Simple bounding check for hard building structures so the user doesn't pass inside central roof brick limits
        let collides = false;
        Object.entries(LANDMARK_COORDS).forEach(([id, c]) => {
          // Allow them to walk near building doors, so don't block entirely, only keep them from passing behind the core center coordinate radius
          const dCenter = Math.hypot(newX - c.x, newY - c.y);
          if (dCenter < c.r - 28) { // buffer
            collides = true;
          }
        });

        if (!collides) {
          setPlayerX(newX);
          setPlayerY(newY);
        }
        setPlayerDirection(activeDir);
        setIsWalking(true);
      } else {
        setIsWalking(false);
      }

      // 3. Proximity Checks & Quest triggers
      // Find closest Landmark
      let closestLoc: Landmark | null = null;
      let minDistance = 120; // proximity limit 120 pixels to register

      CAMPUS_LANDMARKS.forEach((landmark) => {
        const c = LANDMARK_COORDS[landmark.id];
        if (c) {
          const distance = Math.hypot(playerX - c.x, playerY - c.y);
          if (distance < minDistance) {
            minDistance = distance;
            closestLoc = landmark;
          }
        }
      });

      if (closestLoc !== nearLandmark) {
        setNearLandmark(closestLoc);
        if (closestLoc) {
          // Check quest fulfillment!
          const activeQuest = quests[currentQuestIndex];
          if (activeQuest && activeQuest.targetLocationId === (closestLoc as Landmark).id) {
            // Unlocking next quest sequence!
            triggerQuestFulfillment((closestLoc as Landmark).id);
          }
        }
      }

      // NPC proximity checking
      let closestNpc: GameNPC | null = null;
      let minNpcDistance = 45; // pixel gap to consult NPC

      CAMPUS_NPCS.forEach((npc) => {
        const dist = Math.hypot(playerX - npc.x, playerY - npc.y);
        if (dist < minNpcDistance) {
          minNpcDistance = dist;
          closestNpc = npc;
        }
      });

      if (closestNpc !== activeNpc) {
        setActiveNpc(closestNpc);
        setDialogueIndex(0); // reset page
      }

      requestAnimationFrame(gameTick);
    };

    const handle = requestAnimationFrame(gameTick);
    return () => {
      active = false;
      cancelAnimationFrame(handle);
    };
  }, [playerX, playerY, keysPressed, clickTarget, screen, gameState, nearLandmark, activeNpc, quests, currentQuestIndex]);

  // Handle active Quest complete callback
  const triggerQuestFulfillment = (locId: string) => {
    if (!gameState) return;

    const currentQuest = quests[currentQuestIndex];
    if (!currentQuest) return;

    // Set quest index progress
    const updatedQuests = quests.map((q, idx) => {
      if (idx === currentQuestIndex) {
        return { ...q, status: 'COMPLETED' as const };
      }
      return q;
    });

    setQuests(updatedQuests);

    // Apply quest reward bonus stats
    const updatedStats = { ...gameState.stats };
    if (currentQuest.id === 'quest_freshman') {
      updatedStats.cgpa = Math.min(10, updatedStats.cgpa + 0.3);
      updatedStats.happiness = Math.min(100, updatedStats.happiness + 15);
    } else if (currentQuest.id === 'quest_samosa') {
      updatedStats.energy = 100;
      updatedStats.happiness = Math.min(100, updatedStats.happiness + 20);
      updatedStats.money = Math.max(0, updatedStats.money - 30); // small snack cost
    } else if (currentQuest.id === 'quest_study') {
      updatedStats.cgpa = Math.min(10, updatedStats.cgpa + 0.4);
      updatedStats.attendance = Math.min(100, updatedStats.attendance + 10);
    } else if (currentQuest.id === 'quest_exit') {
      updatedStats.money += 300;
      updatedStats.happiness = 100;
    }

    const nextGameState = {
      ...gameState,
      stats: updatedStats,
      historyLogs: [
        `🏆 QUEST ACHIEVED: "${currentQuest.title}" completed! Reward given: ${currentQuest.rewardText}.`,
        ...gameState.historyLogs
      ]
    };

    setGameState(nextGameState);
    triggerToast(`🎉 Completed Quest: ${currentQuest.title}!`);

    // Advance to next quest loop safely
    if (currentQuestIndex < quests.length - 1) {
      setCurrentQuestIndex(prev => prev + 1);
    }
  };

  // HTML5 Canvas draw layout loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || screen !== 'PLAY') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear buffer
    ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    // Camera follow offsets: center map on player position
    // Constrain camera scrolling boundaries
    const camX = Math.min(MAP_WIDTH - VIEWPORT_WIDTH, Math.max(0, playerX - VIEWPORT_WIDTH / 2));
    const camY = Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, Math.max(0, playerY - VIEWPORT_HEIGHT / 2));

    ctx.save();
    ctx.translate(-camX, -camY);

    // --- 1. DRAW COLLISION FIELD BACKGROUND & LAWNS ---
    ctx.fillStyle = '#1e3a1e'; // beautiful lush rich dark pine green lawns
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Draw grid checker lines for a solid tactical gaming view spacer layout
    ctx.strokeStyle = '#2d4a2d';
    ctx.lineWidth = 1;
    const spacing = 60;
    for (let x = 0; x < MAP_WIDTH; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < MAP_HEIGHT; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_WIDTH, y);
      ctx.stroke();
    }

    // --- 2. DRAW ROADS AND WALKING LANES ---
    // Primary central horizontal street (G T Crescent Rd)
    ctx.fillStyle = '#334155'; // Asphalt Slate
    ctx.fillRect(50, 500, MAP_WIDTH - 100, 70);

    // Vertical connecting avenue to Gate-1
    ctx.fillRect(200, 100, 80, 800);

    // Vertical avenue connecting IT Block to Library
    ctx.fillRect(750, 100, 80, 470);
    ctx.fillRect(750, 480, 450, 70); // Library cross-cut

    // Pedestrian walkways connecting to entrances
    ctx.fillStyle = '#64748b'; // pale grey cobblestones
    // MBH walkway
    ctx.fillRect(210, 180, 60, 60);
    // IT Block walkway
    ctx.fillRect(480, 380, 70, 150);
    // Library entry walk
    ctx.fillRect(1000, 360, 120, 180);
    // Sports Open OAT path
    ctx.fillRect(1000, 650, 80, 150);

    // Draw dashed road yellow separator lines
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([15, 12]);
    // Center lane
    ctx.beginPath();
    ctx.moveTo(60, 535);
    ctx.lineTo(MAP_WIDTH - 110, 535);
    ctx.stroke();

    // Vert lane to gate
    ctx.beginPath();
    ctx.moveTo(240, 110);
    ctx.lineTo(240, 880);
    ctx.stroke();
    ctx.setLineDash([]); // clear dash formatting

    // --- 3. DRAW SCENERY AND STREET LAMPS ---
    // Put some trees on grass
    const treeCoords = [
      { x: 380, y: 120 }, { x: 390, y: 220 }, { x: 120, y: 380 }, { x: 150, y: 440 },
      { x: 620, y: 150 }, { x: 680, y: 200 }, { x: 920, y: 140 }, { x: 1220, y: 180 },
      { x: 440, y: 640 }, { x: 500, y: 680 }, { x: 680, y: 680 }, { x: 820, y: 780 },
      { x: 740, y: 880 }, { x: 880, y: 890 }, { x: 1250, y: 620 }, { x: 1280, y: 700 }
    ];

    treeCoords.forEach((t) => {
      // Wood trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(t.x - 4, t.y + 10, 8, 16);
      
      // Leaves canopy
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.arc(t.x, t.y, 18, 0, Math.PI * 2);
      ctx.fill();
    });

    // Street Lamps glowing effect if game hour status is evening/night
    const lamps = [
      { x: 280, y: 450 }, { x: 280, y: 600 }, { x: 710, y: 450 }, { x: 850, y: 450 }
    ];

    lamps.forEach((lamp) => {
      // Warm yellow glow
      if (timeOfDay === 'Night' || timeOfDay === 'Evening') {
        const grad = ctx.createRadialGradient(lamp.x, lamp.y, 4, lamp.x, lamp.y, 55);
        grad.addColorStop(0, 'rgba(253, 224, 71, 0.5)'); // yellow pulse
        grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lamp.x, lamp.y, 55, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lamp pole
      ctx.fillStyle = '#475569';
      ctx.fillRect(lamp.x - 3, lamp.y - 12, 6, 24);
      // Small yellow lamp head bulb
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y - 12, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- 4. DRAW LANDMARK ZONE SHADOW BRICKS & BUBBLES ---
    Object.entries(LANDMARK_COORDS).forEach(([id, c]) => {
      const info = CAMPUS_LANDMARKS.find((l) => l.id === id);
      if (!info) return;

      const isCurrentNear = nearLandmark?.id === id;

      // Draw outer grass clearance ring
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing gold circle ring if user is standing directly close!
      if (isCurrentNear) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Building inner architectural block representing actual shape
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x - 55, c.y - 45, 110, 80);

      // Cute structural roof details
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(c.x - 55, c.y + 20, 110, 15); // building shadow bottom
      ctx.fillRect(c.x - 45, c.y - 35, 90, 8); // roof line

      // Entrance door symbol
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(c.x - 14, c.y + 20, 28, 15); // Door opening

      // Glowing entry threshold
      ctx.fillStyle = '#38bdf8'; // neon blue light
      ctx.fillRect(c.x - 12, c.y + 31, 24, 4);

      // Draw floating emoji in center of roof
      ctx.font = '30px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(info.emoji, c.x, c.y - 12);

      // Visual text labels overhead
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(info.alternateName || info.name, c.x, c.y + 58);

      // Display warning if the player is too close and must enter
      if (isCurrentNear) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '9px monospace';
        ctx.fillText('⭐ Stand close to explore info ⭐', c.x, c.y + 70);
      }
    });

    // --- 5. DRAW STATIONARY CAMPUS INTERACTIVE NPCs ---
    CAMPUS_NPCS.forEach((npc) => {
      const isPlayerNearThisNpc = activeNpc?.id === npc.id;

      // Draw NPC base glow circle shadow
      ctx.fillStyle = 'rgba(15,23,42,0.6)';
      ctx.beginPath();
      ctx.arc(npc.x, npc.y + 5, 14, 0, Math.PI * 2);
      ctx.fill();

      // Highlighting NPC when near
      if (isPlayerNearThisNpc) {
        ctx.strokeStyle = '#38bdf8'; // Blue neon
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(npc.x, npc.y + 5, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Draw cute dialogue bubble overhead
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.fillRect(npc.x - 60, npc.y - 48, 120, 22);
        ctx.strokeRect(npc.x - 60, npc.y - 48, 120, 22);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('Click "Consult Counselor"', npc.x, npc.y - 37);
      }

      // Draw the NPC emoji avatar icon
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(npc.emoji, npc.x, npc.y);

      // Title/Name indicator
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(npc.name, npc.x, npc.y + 20);
    });

    // --- 6. DRAW CLICK-TO-MOVE TARGET POINTER ---
    if (clickTarget) {
      ctx.strokeStyle = '#f43f5e'; // pulsing crimson rose target
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(clickTarget.x, clickTarget.y, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(clickTarget.x, clickTarget.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- 7. DRAW THE MAIN HERO PLAYER (WALKING AVATAR) ---
    // Pulse ring under player feet
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(playerX, playerY + 8, 11, 0, Math.PI * 2);
    ctx.fill();

    // Hoodie cloak base body
    ctx.fillStyle = playerAvatarColor;
    ctx.beginPath();
    ctx.arc(playerX, playerY, 11, 0, Math.PI * 2);
    ctx.fill();

    // Draw little details on player avatar character representing cute head
    ctx.fillStyle = '#ffffff'; // face/capsule color
    ctx.beginPath();
    ctx.arc(playerX, playerY - 3, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw look eyes depending on key orientation playerDirection
    ctx.fillStyle = '#0f172a';
    if (playerDirection === 'up') {
      // draw hoodie cover back of hair
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(playerX, playerY - 3, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (playerDirection === 'down') {
      ctx.fillRect(playerX - 3, playerY - 4, 2, 2);
      ctx.fillRect(playerX + 1, playerY - 4, 2, 2);
    } else if (playerDirection === 'left') {
      ctx.fillRect(playerX - 4, playerY - 4, 2, 2);
    } else if (playerDirection === 'right') {
      ctx.fillRect(playerX + 2, playerY - 4, 2, 2);
    }

    // Overhead name tags representing nickname multiplayer style
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 4;
    ctx.fillText(`${playerName} [${selectedBranch}]`, playerX, playerY - 20);
    ctx.shadowBlur = 0; // reset shadow parameter

    // Quest arrow beacon pointing toward active target!
    const activeQuest = quests[currentQuestIndex];
    if (activeQuest) {
      const qCoord = LANDMARK_COORDS[activeQuest.targetLocationId];
      if (qCoord) {
        // Calculate vector angle
        const angle = Math.atan2(qCoord.y - playerY, qCoord.x - playerX);
        const arrowDist = 32;
        const arrowX = playerX + Math.cos(angle) * arrowDist;
        const arrowY = playerY + Math.sin(angle) * arrowDist;

        ctx.fillStyle = '#f59e0b'; // glowing amber seeker arrow
        ctx.beginPath();
        ctx.arc(arrowX, arrowY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // draw small quest pointer icon floating overhead
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('Quest ⭐', playerX, playerY - 33);
      }
    }

    ctx.restore();
  }, [playerX, playerY, playerDirection, nearLandmark, activeNpc, clickTarget, screen, timeOfDay, quests, currentQuestIndex, playerAvatarColor]);

  // Handle canvas click-to-move trigger walking
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickViewportX = e.clientX - rect.left;
    const clickViewportY = e.clientY - rect.top;

    // Convert screen coordinates of canvas viewport back into map canvas offsets
    const camX = Math.min(MAP_WIDTH - VIEWPORT_WIDTH, Math.max(0, playerX - VIEWPORT_WIDTH / 2));
    const camY = Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, Math.max(0, playerY - VIEWPORT_HEIGHT / 2));

    const mapX = clickViewportX + camX;
    const mapY = clickViewportY + camY;

    // Constrain inside walkable limits
    setClickTarget({
      x: Math.min(MAP_WIDTH - 20, Math.max(20, mapX)),
      y: Math.min(MAP_HEIGHT - 20, Math.max(20, mapY))
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans" id="nitj-root">
      
      {/* Toast Notification Popovers */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-amber-300 font-bold text-sm animate-bounce max-w-sm" id="global-toast">
          <Sparkles className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0" id="main-brand-header">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xl font-mono shadow-md">
            NJ
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg tracking-tight">Dr. B R Ambedkar National Institute of Technology Jalandhar</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wide">Punjab • Top-Down 2D Campus Life Simulator</p>
          </div>
        </div>

        {/* Action Controls Instructions */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-2 px-3">
          <Footprints className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Keys: <kbd className="bg-slate-800 text-white px-1.5 py-0.5 rounded shadow">W A S D</kbd> / <kbd className="bg-slate-800 text-white px-1.5 py-0.5 rounded shadow">Arrows</kbd> or <span className="text-emerald-400 font-bold">Click ground</span> to walk!</span>
        </div>
      </header>

      {/* Screen 1: Player Register Configuration */}
      {screen === 'START' && (
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-slate-950" id="start-view bg">
          <div className="max-w-xl w-full bg-slate-900 mb-8 border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col gap-6" id="setup-form">
            
            <div className="text-center flex flex-col items-center gap-1.5">
              <span className="text-amber-500 font-bold tracking-widest text-base">NITJ SIMULATOR v2.5</span>
              <h2 className="text-2xl font-black text-white tracking-tight leading-none uppercase">Create Your Student Persona</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full mt-2" />
            </div>

            <fieldset className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Student Nickname</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 15))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold"
                  placeholder="e.g. Karan"
                />
              </div>

              {/* Character Hoodie/Avatar Colors */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Select Player Hoodie Fashion Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { hex: '#fbbf24', alias: 'Amber Gold' },
                    { hex: '#ef4444', alias: 'Ferrari Red' },
                    { hex: '#3b82f6', alias: 'Ocean Blue' },
                    { hex: '#10b981', alias: 'Forest Green' },
                    { hex: '#ec4899', alias: 'Pink Bubblegum' }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setPlayerAvatarColor(color.hex)}
                      className={`h-11 rounded-xl transition-all border flex items-center justify-center p-1 font-bold text-[10px] ${
                        playerAvatarColor === color.hex 
                          ? 'border-white scale-105 shadow-md shadow-white/10 ring-2 ring-indigo-500/30' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                      style={{ backgroundColor: color.hex, color: '#000000' }}
                    >
                      {playerAvatarColor === color.hex ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* B.Tech Branch Perks Info */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Select Academic Branch of Study</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(BRANCH_DETAILS) as BranchType[]).map((br) => (
                    <button
                      key={br}
                      onClick={() => setSelectedBranch(br)}
                      className={`p-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                        selectedBranch === br
                          ? 'border-amber-400 bg-amber-500/10 text-amber-400 font-extrabold scale-[1.05]'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-xs flex flex-col gap-1.5 leading-relaxed">
                <span className="text-amber-400 font-bold block">{BRANCH_DETAILS[selectedBranch].name} perk</span>
                <p className="text-slate-300 font-medium">{BRANCH_DETAILS[selectedBranch].description}</p>
                <div className="flex items-center gap-4 text-slate-400 mt-2 font-mono text-[10px] border-t border-slate-900 pt-2 flex-wrap">
                  <span>CGPA: {BRANCH_DETAILS[selectedBranch].startStats.cgpa}</span>
                  <span>Attendance: {BRANCH_DETAILS[selectedBranch].startStats.attendance}%</span>
                  <span>Coding Metric: {BRANCH_DETAILS[selectedBranch].startStats.codingSkill}%</span>
                  <span>Special Advantage: {BRANCH_DETAILS[selectedBranch].perks}</span>
                </div>
              </div>
            </fieldset>

            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base py-4 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              id="start-session-btn"
            >
              <School className="h-5 w-5" />
              Enter Main Campus Gates
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Interactive Walking Map Simulation Dashboard */}
      {screen === 'PLAY' && gameState && (
        <div className="flex-1 flex flex-col lg:overflow-hidden" id="play-view shadow">
          
          {/* Top Panel: Player Stats Bar Grid */}
          <section className="bg-slate-950/80 border-b border-slate-800 px-6 py-3.5 flex flex-wrap justify-between items-center gap-4 shrink-0" id="stats-dashboard">
            
            {/* Persona Details */}
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 text-xl font-bold flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700" style={{ color: playerAvatarColor }}>
                🤠
              </span>
              <div>
                <span className="block text-white font-extrabold font-sans text-sm">{gameState.name}</span>
                <span className="text-[11px] font-mono text-slate-400">Branch study of {selectedBranch} • Year {gameState.year}</span>
              </div>
            </div>

            {/* Simulated Live Numbers */}
            <div className="flex flex-wrap gap-3 items-center">
              
              {/* Day clock */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-amber-500" />
                <div className="font-mono text-xs text-slate-300">
                  <span className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide">Sem Clock</span>
                  Day {gameState.day}/60 • <span className="text-teal-400 font-bold uppercase">{timeOfDay}</span>
                </div>
              </div>

              {/* CGPA */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
                <div className="font-mono text-xs text-slate-300">
                  <span className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide">Grades CGPA</span>
                  <span className="font-bold text-indigo-300">{gameState.stats.cgpa} /10</span>
                </div>
              </div>

              {/* Attendance */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
                <CheckCircle className={`h-4.5 w-4.5 ${gameState.stats.attendance < 75 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                <div className="font-mono text-xs text-slate-300">
                  <span className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide">Attendance Tracker</span>
                  <span className={`font-bold ${gameState.stats.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>{gameState.stats.attendance}%</span>
                </div>
              </div>

              {/* Coding skill */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-teal-400" />
                <div className="font-mono text-xs text-slate-300">
                  <span className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide">Coding Score</span>
                  <span className="font-bold text-teal-300">{gameState.stats.codingSkill}%</span>
                </div>
              </div>

              {/* Energy stat */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
                <Battery className="h-4.5 w-4.5 text-amber-500" />
                <div className="font-mono text-xs text-slate-300 w-24">
                  <span className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide">Energy</span>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${gameState.stats.energy}%` }} />
                  </div>
                </div>
              </div>

              {/* Wallet stat */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
                <Wallet className="h-4.5 w-4.5 text-rose-400" />
                <div className="font-mono text-xs text-slate-300">
                  <span className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide">WalletUPI</span>
                  <span className="font-bold text-rose-300">₹{gameState.stats.money}</span>
                </div>
              </div>

            </div>
          </section>

          {/* MAIN SIMULATION SECTION */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:overflow-hidden" id="simulator-layout-splits">
            
            {/* Left Box: Playable MAP CANVAS View (7 Columns on large screens) */}
            <div className="lg:col-span-8 flex flex-col p-4 bg-slate-950 border-r border-slate-800 justify-center items-center relative" id="canvas-enclosure">
              
              {/* HUD / Quest Box overlays directly on top of the map block */}
              <div className="absolute top-6 left-6 z-10 bg-slate-950/95 border border-amber-500/50 rounded-2xl p-4 shadow-2xl max-w-sm" id="hud-quests">
                <span className="text-[10px] font-mono tracking-widest text-amber-500 font-extrabold flex items-center gap-1.5 uppercase">
                  <Award className="h-4 w-4" /> Active Quest Objectives
                </span>
                
                {currentQuestIndex < quests.length ? (
                  <div className="mt-1 flex flex-col gap-1">
                    <h3 className="font-extrabold text-sm text-white">{quests[currentQuestIndex].title}</h3>
                    <p className="text-slate-400 text-xs leading-normal">{quests[currentQuestIndex].description}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-amber-400/90 bg-amber-500/10 rounded-lg p-1.5 px-2.5">
                      <Gift className="h-3.5 w-3.5 shrink-0" />
                      <span>Reward: {quests[currentQuestIndex].rewardText}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex flex-col gap-1">
                    <h3 className="font-extrabold text-sm text-emerald-400">🎓 Graduated Campaign!</h3>
                    <p className="text-slate-400 text-xs leading-normal">You completed all college freshman checklists! Keep exploring the landmarks.</p>
                  </div>
                )}
              </div>

              {/* Mobile screen direction buttons overlay (Joystick pad) */}
              <div className="absolute bottom-6 right-6 z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 flex flex-col gap-1 md:hidden" id="virtual-joystick">
                <div className="flex justify-center">
                  <button
                    onMouseDown={() => setKeysPressed(k => ({ ...k, 'w': true }))}
                    onMouseUp={() => setKeysPressed(k => ({ ...k, 'w': false }))}
                    onTouchStart={() => setKeysPressed(k => ({ ...k, 'w': true }))}
                    onTouchEnd={() => setKeysPressed(k => ({ ...k, 'w': false }))}
                    className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-300"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-1 justify-center">
                  <button
                    onMouseDown={() => setKeysPressed(k => ({ ...k, 'a': true }))}
                    onMouseUp={() => setKeysPressed(k => ({ ...k, 'a': false }))}
                    onTouchStart={() => setKeysPressed(k => ({ ...k, 'a': true }))}
                    onTouchEnd={() => setKeysPressed(k => ({ ...k, 'a': false }))}
                    className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onMouseDown={() => setKeysPressed(k => ({ ...k, 's': true }))}
                    onMouseUp={() => setKeysPressed(k => ({ ...k, 's': false }))}
                    onTouchStart={() => setKeysPressed(k => ({ ...k, 's': true }))}
                    onTouchEnd={() => setKeysPressed(k => ({ ...k, 's': false }))}
                    className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-300"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onMouseDown={() => setKeysPressed(k => ({ ...k, 'd': true }))}
                    onMouseUp={() => setKeysPressed(k => ({ ...k, 'd': false }))}
                    onTouchStart={() => setKeysPressed(k => ({ ...k, 'd': true }))}
                    onTouchEnd={() => setKeysPressed(k => ({ ...k, 'd': false }))}
                    className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-300"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Fast Travel map shortcuts list */}
              <div className="absolute bottom-6 left-6 z-10 bg-slate-950/90 border border-slate-800 rounded-xl p-2 max-w-full overflow-x-auto flex gap-1 items-center shadow-lg" id="fast-travel-bar">
                <span className="text-[10px] uppercase font-bold text-slate-500 px-2 font-mono shrink-0">Fast Travel:</span>
                {Object.keys(LANDMARK_COORDS).map((locId) => (
                  <button
                    key={locId}
                    onClick={() => handleTeleportToLocation(locId)}
                    className="px-2 py-1 bg-slate-900 hover:bg-amber-500 hover:text-slate-900 font-extrabold text-[10px] rounded border border-slate-800 transition uppercase shrink-0"
                  >
                    📍 {locId.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* THE GAME CANVAS ELEMENT */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl" style={{ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }} id="viewport">
                <canvas
                  ref={canvasRef}
                  width={VIEWPORT_WIDTH}
                  height={VIEWPORT_HEIGHT}
                  onClick={handleCanvasClick}
                  className="block cursor-crosshair"
                />
              </div>

              {/* Direction Indicator label */}
              <p className="mt-2 text-slate-500 text-[11px] font-mono select-none">
                📍 Coordinates: ({Math.round(playerX)}, {Math.round(playerY)}) • Target coordinate: {clickTarget ? `(${Math.round(clickTarget.x)}, ${Math.round(clickTarget.y)})` : 'None (Click Map To Set Walk)'}
              </p>

            </div>

            {/* Right Box: Dynamic Action Console Sidebar (4 Columns) */}
            <aside className="lg:col-span-4 flex flex-col bg-slate-900 border-l border-slate-800/60 lg:overflow-y-auto p-4 md:p-6 gap-6" id="contextual-action-console">
              
              {/* section A: Proximity Dialogue or Landmarks details */}
              {activeNpc && (
                <div className="bg-sky-950/80 rounded-2xl border border-sky-800/80 p-5 flex flex-col gap-3 relative overflow-hidden" id="active npc overlay">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rounded-full blur-xl" />
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl bg-slate-900 p-2 rounded-xl border border-sky-800">{activeNpc.emoji}</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-sky-300">{activeNpc.name}</h4>
                      <p className="text-[10px] text-sky-400 font-mono tracking-wider uppercase">{activeNpc.title}</p>
                    </div>
                  </div>

                  <p className="text-slate-200 text-xs italic leading-relaxed border-l-2 border-sky-500 pl-3.5 my-1 font-medium bg-slate-950/30 py-2 rounded-r-lg">
                    "{activeNpc.dialogue[dialogueIndex]}"
                  </p>

                  <div className="flex items-center justify-between border-t border-sky-900/50 pt-2.5 mt-1">
                    <button
                      onClick={() => setDialogueIndex((prev) => (prev + 1) % activeNpc.dialogue.length)}
                      className="text-xs text-sky-400 font-bold hover:text-sky-300 flex items-center gap-1"
                    >
                      Next Advice ⮕
                    </button>
                    <span className="text-[10px] font-mono text-sky-500">Page {dialogueIndex + 1}/{activeNpc.dialogue.length}</span>
                  </div>
                </div>
              )}

              {/* Landmark proximity interaction hub */}
              {nearLandmark ? (
                <div className="bg-slate-955 rounded-2xl border border-amber-500/30 p-5 flex flex-col gap-4 relative" id="active-landmark-hub">
                  
                  {/* Glowing header badge */}
                  <div className="flex items-start gap-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800">{nearLandmark.emoji}</span>
                    <div className="flex-1">
                      <span className="inline-block bg-amber-500/10 text-amber-400 text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded border border-amber-500/25 mb-1 animate-pulse">
                        📍 Standing Inside Zone
                      </span>
                      <h3 className="font-black text-white text-base leading-none">{nearLandmark.name}</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed mt-1">{nearLandmark.shortDescription}</p>
                    </div>
                  </div>

                  {/* Fact Sheets information for learning about college */}
                  <div className="bg-slate-950/75 p-3.5 rounded-xl border border-slate-800 text-xs flex flex-col gap-2">
                    <h4 className="font-extrabold text-[11px] text-amber-500/90 uppercase tracking-widest font-mono">📋 Location Dossier</h4>
                    <p className="text-slate-300 leading-relaxed font-sans">{nearLandmark.longDescription}</p>
                  </div>

                  {/* Available interactive activities actions buttons */}
                  <div className="flex flex-col gap-2.5 mt-2">
                    <label className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500 font-mono">
                      Execute College Activity Here:
                    </label>

                    {nearLandmark.activities.map((activity, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDoActivity(activity)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-3 text-left flex items-start justify-between gap-4 transition group active:scale-[0.98]"
                      >
                        <div className="flex-1">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-amber-400 block">{activity.name}</span>
                          <span className="text-[10px] text-slate-400 block leading-normal mt-0.5">{activity.description}</span>
                        </div>
                        
                        <div className="text-right shrink-0 flex flex-col gap-0.5 text-[9px] font-mono leading-none">
                          <span className={activity.energyCost > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                            {activity.energyCost > 0 ? `⚡ -${activity.energyCost}` : `⚡ +${Math.abs(activity.energyCost)}`}
                          </span>
                          {activity.moneyCost > 0 && <span className="text-rose-400">₹ -{activity.moneyCost}</span>}
                          <span className="inline-block bg-slate-900 border border-slate-800 text-slate-400 p-1 rounded font-sans font-bold text-[8px] tracking-wide uppercase mt-1">
                            Commit
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center gap-3 py-10" id="idle-landmark-hub">
                  <div className="h-12 w-12 rounded-full bg-slate-900 text-lg flex items-center justify-center border border-slate-800 animate-pulse text-slate-500">
                    🌍
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wide">Explore NIT Jalandhar</h3>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-sm mt-1">
                      Your avatar is roaming the beautiful college lawns. Walk close to any building (e.g. IT Block, Library, Hostels, Amul Shop, GT Road bypass) to load activities or click on fast travel.
                    </p>
                  </div>
                </div>
              )}

              {/* Section B: Campus Chronicles / Logs history */}
              <div className="flex flex-col gap-3" id="log-box-section">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" /> NITJ College Chronicles
                </span>

                <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-4 font-mono text-[11px] overflow-y-auto max-h-[180px] flex flex-col gap-2.5" id="log-wrapper">
                  {gameState.historyLogs.map((logStr, idx) => (
                    <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-0" id={`history-row-${idx}`}>
                      <p className="text-slate-300 leading-normal">{logStr}</p>
                    </div>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </div>
      )}

    </div>
  );
}
