import { Role, Task } from "./data/norms";

export interface Constraint {
  id: string;
  label: string;
  adjustment: number; // additive or subtractive hours
}

export interface ProjectState {
  name: string;
  client: string;
  context: {
    complexity: 'simple' | 'medium' | 'complex' | 'innovative';
    teamMaturity: 'junior' | 'mixed' | 'senior' | 'expert';
    dataQuality: 'excellent' | 'good' | 'medium' | 'poor';
    modelAvailability: 'pretrained_ready' | 'pretrained' | 'fine_tuning' | 'from_scratch';
  };
  risks: Record<string, boolean>;
  scoring: Record<string, boolean>;
  parallelStreams: number;
  selectedTasks: SelectedTask[];
  customTasks: Task[];
  searchCache: Record<string, string>; // user term -> task ID
}

export interface SelectedTask extends Task {
  instanceId: string;
  quantity: number;
  assignedRole: Role;
  appliedConstraints: string[];
  userFormulation?: string;
}
