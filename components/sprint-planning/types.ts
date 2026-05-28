export type Column = 'backlog' | 'sprint' | 'high-risk' | 'blocked';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type BusinessImpact = 'Critical' | 'High' | 'Medium' | 'Low';
export type Complexity = 'High' | 'Medium' | 'Low';
export type Category = 'Backend' | 'Frontend' | 'Design' | 'QA';

export interface BacklogItem {
  id: string;
  title: string;
  points: number;
  businessImpact: BusinessImpact;
  complexity: Complexity;
  priority: Priority;
  dependencies: string[];
  category: Category;
  column: Column;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  available: boolean;
  capacity: number;
}

export interface ChaosEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  capacityImpact: number;
  riskImpact: number;
  active: boolean;
}
