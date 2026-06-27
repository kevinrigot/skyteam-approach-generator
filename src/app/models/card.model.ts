export type Difficulty = 'green' | 'yellow' | 'red' | 'black';

export type ScenarioModuleType =
  | 'capability1'
  | 'capability2'
  | 'fuel'
  | 'intern'
  | 'wind'
  | 'time'
  | 'fuel_leakage'
  | 'ice_brake'
  | 'altitude_5000'
  | 'alarms'
  | 'altitude_a'
  | 'altitude_b'
  | 'altitude_c'
  | 'altitude_d'
  | 'specific_rules'
  | 'reverse_wind';

export interface CaseData {
  planes: number;
  dices: number;
  direction: boolean[];
  alarms: number;
  fullTrust: boolean;
}

export interface CardData {
  id: string;
  name: string;
  titleAbbr: string;
  titleFull: string;
  difficulty: Difficulty;
  scenarioModules: ScenarioModuleType[];
  cases: CaseData[];
  backCard?: CardData;
}

export function defaultCase(): CaseData {
  return {
    planes: 0,
    dices: 0,
    direction: [false, false, false, false, false],
    alarms: 0,
    fullTrust: false,
  };
}

export function defaultCard(): CardData {
  return {
    id: crypto.randomUUID(),
    name: 'New Card',
    titleAbbr: 'BRU',
    titleFull: 'Brussels',
    difficulty: 'green',
    scenarioModules: [],
    cases: [defaultCase(), defaultCase(), defaultCase()],
  };
}
