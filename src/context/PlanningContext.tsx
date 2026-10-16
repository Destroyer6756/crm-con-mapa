import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ProjectPhase, SecurityControl, SecurityScore, PlanningProgress, PhaseStatus } from '../types/cloud';
import { PROJECT_PHASES, SECURITY_CONTROLS, calculateSecurityScore } from '../data/planningPhases';

// ============================================================
// PlanningContext — connects Planning module with
// Gestión y Control panel in Administration
// % Security is calculated from FASE 8 tasks completion
// ============================================================

interface PlanningContextType {
  phases: ProjectPhase[];
  securityControls: SecurityControl[];
  securityScore: SecurityScore;
  planningProgress: PlanningProgress;
  updatePhaseStatus: (phaseId: string, status: PhaseStatus, progress: number) => void;
  updateTaskStatus: (phaseId: string, taskId: string, status: PhaseStatus) => void;
  toggleSecurityControl: (controlId: string, implemented: boolean) => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

function computePlanningProgress(phases: ProjectPhase[]): PlanningProgress {
  const completed = phases.filter((p) => p.status === 'completada').length;
  const inProgress = phases.filter((p) => p.status === 'en_progreso').length;
  const pending = phases.filter((p) => p.status === 'pendiente').length;
  return {
    totalPhases: phases.length,
    completedPhases: completed,
    inProgressPhases: inProgress,
    pendingPhases: pending,
    percentage: Math.round((completed / phases.length) * 100),
    phases,
  };
}

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phases, setPhases] = useState<ProjectPhase[]>(PROJECT_PHASES);
  const [securityControls, setSecurityControls] = useState<SecurityControl[]>(SECURITY_CONTROLS);

  const securityScore = calculateSecurityScore(securityControls);
  const planningProgress = computePlanningProgress(phases);

  const updatePhaseStatus = useCallback((phaseId: string, status: PhaseStatus, progress: number) => {
    setPhases((prev) =>
      prev.map((p) => p.id === phaseId ? { ...p, status, progress } : p)
    );
  }, []);

  const updateTaskStatus = useCallback((phaseId: string, taskId: string, status: PhaseStatus) => {
    setPhases((prev) =>
      prev.map((p) => {
        if (p.id !== phaseId) return p;
        const updatedTasks = p.tasks.map((t) =>
          t.id === taskId ? { ...t, status, completedAt: status === 'completada' ? new Date().toISOString() : undefined } : t
        );
        const completedCount = updatedTasks.filter((t) => t.status === 'completada').length;
        const newProgress = Math.round((completedCount / updatedTasks.length) * 100);
        const newStatus: PhaseStatus =
          newProgress === 100 ? 'completada' : newProgress > 0 ? 'en_progreso' : 'pendiente';
        return { ...p, tasks: updatedTasks, progress: newProgress, status: newStatus };
      })
    );
  }, []);

  const toggleSecurityControl = useCallback((controlId: string, implemented: boolean) => {
    setSecurityControls((prev) =>
      prev.map((c) =>
        c.id === controlId
          ? { ...c, implemented, verificationDate: implemented ? new Date().toISOString().split('T')[0] : undefined }
          : c
      )
    );
  }, []);

  return (
    <PlanningContext.Provider
      value={{
        phases,
        securityControls,
        securityScore,
        planningProgress,
        updatePhaseStatus,
        updateTaskStatus,
        toggleSecurityControl,
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const ctx = useContext(PlanningContext);
  if (!ctx) throw new Error('usePlanning must be used inside PlanningProvider');
  return ctx;
};
