export type BranchType = 'CSE' | 'ECE' | 'IT' | 'ME' | 'CE' | 'CH' | 'EE' | 'BT';

export interface StudentStats {
  cgpa: number;
  attendance: number; // Percentage, e.g. 80
  codingSkill: number; // 0 to 100
  energy: number; // 0 to 100
  money: number; // 0 to 2000
  happiness: number; // 0 to 100
}

export interface PlayerState {
  name: string;
  branch: BranchType;
  year: number; // 1 to 4
  day: number; // 1 to 60 (covering semesters/years)
  term: 'Autumn' | 'Spring';
  stats: StudentStats;
  historyLogs: string[];
  achievements: string[];
  clubsJoined: string[];
  currentLocationId: string;
  isDebarred: boolean;
  placedCompany: string | null;
  placedSalary: number | null; // LPA
}

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

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rewardType: 'cgpa' | 'codingSkill' | 'money' | 'happiness';
  rewardAmount: number;
}

export interface PlacementCompany {
  name: string;
  minCgpa: number;
  minCoding: number;
  package: number; // LPA
  role: string;
  rounds: {
    name: string;
    type: 'aptitude' | 'coding' | 'technical' | 'hr';
    passChance: (stats: StudentStats) => number; // returns percentage 0-100
    description: string;
  }[];
}
