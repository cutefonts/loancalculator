import React, { useState } from 'react';
import { Settings, Calculator, TrendingUp, PieChart, BarChart3, Download, Share2, Bookmark } from 'lucide-react';

interface LoanCalculatorSettingsProps {
  onExportPDF: () => void;
  onShareLink: () => void;
  onSaveTemplate: () => void;
}

const LoanCalculatorSettings: React.FC<LoanCalculatorSettingsProps> = ({
  onExportPDF,
  onShareLink,
  onSaveTemplate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calculationMode, setCalculationMode] = useState<'standard' | 'advanced' | 'professional'>('standard');
  const [displayMode, setDisplayMode] = useState<'detailed' | 'summary' | 'minimal'>('detailed');

  const calculationModes = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Basic loan calculations',
      icon: Calculator
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Include taxes, insurance, PMI',
      icon: TrendingUp
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Full financial analysis',
      icon: PieChart
    }
  ];

  const displayModes = [
    {
      id: 'detailed',
      name: 'Detailed View',
      description: 'Show all charts and tables',
      icon: BarChart3
    },
    {
      id: 'summary',
      name: 'Summary View',
      description: 'Key metrics only',
      icon: PieChart
    },
    {
      id: 'minimal',
      name: 'Minimal View',
      description: 'Essential information',
      icon: Calculator
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 border border-white/20"
      >
        <Settings className="h-4 w-4" />
        <span className="text-sm">Settings</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-[9999]">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Calculator Settings</h3>

            {/* Calculation Mode */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-blue-200 mb-3">Calculation Mode</h4>
              <div className="space-y-2">
                {calculationModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setCalculationMode(mode.id as any)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                        calculationMode === mode.id
                          ? 'bg-blue-600/30 border border-blue-500/50'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${calculationMode === mode.id ? 'text-blue-400' : 'text-blue-300'}`} />
                      <div className="text-left">
                        <div className={`font-medium ${calculationMode === mode.id ? 'text-blue-300' : 'text-white'}`}>
                          {mode.name}
                        </div>
                        <div className="text-xs text-blue-200">{mode.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Mode */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-blue-200 mb-3">Display Mode</h4>
              <div className="space-y-2">
                {displayModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setDisplayMode(mode.id as any)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                        displayMode === mode.id
                          ? 'bg-emerald-600/30 border border-emerald-500/50'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${displayMode === mode.id ? 'text-emerald-400' : 'text-blue-300'}`} />
                      <div className="text-left">
                        <div className={`font-medium ${displayMode === mode.id ? 'text-emerald-300' : 'text-white'}`}>
                          {mode.name}
                        </div>
                        <div className="text-xs text-blue-200">{mode.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-medium text-blue-200 mb-3">Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onExportPDF();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <Download className="h-5 w-5 text-blue-300" />
                  <div className="text-left">
                    <div className="font-medium text-white">Export PDF Report</div>
                    <div className="text-xs text-blue-200">Download detailed analysis</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onShareLink();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <Share2 className="h-5 w-5 text-blue-300" />
                  <div className="text-left">
                    <div className="font-medium text-white">Share Calculation</div>
                    <div className="text-xs text-blue-200">Generate shareable link</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSaveTemplate();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <Bookmark className="h-5 w-5 text-blue-300" />
                  <div className="text-left">
                    <div className="font-medium text-white">Save as Template</div>
                    <div className="text-xs text-blue-200">Reuse these settings</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LoanCalculatorSettings;