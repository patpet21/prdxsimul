import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';

interface DeployViewProps {
  onComplete: () => void;
}

const DEPLOY_STEPS = [
  { label: 'Compiling Smart Contracts', duration: 1500 },
  { label: 'Verifying Identity (KYC/AML)', duration: 1200 },
  { label: 'Deploying SPV Registry', duration: 1800 },
  { label: 'Minting Governance Tokens', duration: 1500 },
  { label: 'Finalizing Security Audit', duration: 1000 },
];

export const DeployView: React.FC<DeployViewProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const processStep = (index: number) => {
      if (index >= DEPLOY_STEPS.length) {
        setLogs(prev => [...prev, ">> Deployment Successful!"]);
        return;
      }

      const step = DEPLOY_STEPS[index];
      // Add log
      setLogs(prev => [...prev, `>> ${step.label}...`]);

      timeout = setTimeout(() => {
        setLogs(prev => [...prev, `   [OK] Completed.`]);
        setCurrentStepIndex(index + 1);
        processStep(index + 1);
      }, step.duration);
    };

    processStep(0);

    return () => clearTimeout(timeout);
  }, []);

  const isFinished = currentStepIndex >= DEPLOY_STEPS.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn p-4">
      <div className="w-full max-w-2xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        {/* Terminal Header */}
        <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-amber-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <span className="text-xs text-slate-400 font-mono ml-2">deploy_mainnet.sh</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm h-[300px] overflow-y-auto bg-slate-900 text-green-400 space-y-2 custom-scrollbar">
           {logs.map((log, i) => (
             <div key={i} className="animate-slideUp">{log}</div>
           ))}
           {isFinished && (
             <div className="mt-4 animate-pulse text-brand-400 font-bold">
               Waiting for user confirmation...
             </div>
           )}
        </div>
      </div>

      {isFinished && (
        <div className="mt-8 text-center animate-fadeIn">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Blockchain Deployment Complete</h2>
          <p className="text-slate-500 mb-6">Your asset has been successfully tokenized on the testnet.</p>
          <Button onClick={onComplete} className="px-8 py-3 text-lg shadow-lg shadow-brand-200">
            View Final Report
          </Button>
        </div>
      )}
    </div>
  );
};