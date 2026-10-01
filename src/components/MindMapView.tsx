import React, { useState } from 'react';
import {
  Network,
  Info,
  Maximize2,
  Minimize2,
  ChevronRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { MindMapNode, LectureData } from '../types/lecture';

interface MindMapViewProps {
  nodes: MindMapNode[];
  lecture: LectureData;
}

export const MindMapView: React.FC<MindMapViewProps> = ({ nodes, lecture }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    nodes.length > 0 ? nodes[0].id : null
  );

  // Group nodes by parentId
  const rootNodes = nodes.filter((n) => !n.parentId || n.parentId === '');
  const childMap = new Map<string, MindMapNode[]>();

  nodes.forEach((n) => {
    if (n.parentId) {
      const list = childMap.get(n.parentId) || [];
      list.push(n);
      childMap.set(n.parentId, list);
    }
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const getColorStyles = (color?: string, isSelected?: boolean) => {
    switch (color) {
      case 'rose':
        return isSelected
          ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/25 ring-2 ring-rose-400'
          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800 hover:border-rose-400';
      case 'emerald':
        return isSelected
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400'
          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400';
      case 'amber':
        return isSelected
          ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/25 ring-2 ring-amber-400'
          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800 hover:border-amber-400';
      case 'purple':
        return isSelected
          ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/25 ring-2 ring-purple-400'
          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 hover:border-purple-400';
      case 'cyan':
        return isSelected
          ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/25 ring-2 ring-cyan-400'
          : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800 hover:border-cyan-400';
      default: // indigo / slate
        return isSelected
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-400'
          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mindmap Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Concept Hierarchy & Mental Map
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive structural map showing how the lecture concepts connect.
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Click any node to inspect context
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mind Map Visual Tree (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto min-h-[450px]">
          <div className="space-y-6 min-w-[500px]">
            {/* Root Nodes */}
            {rootNodes.map((root) => {
              const rootChildren = childMap.get(root.id) || [];
              const isSelected = selectedNodeId === root.id;

              return (
                <div key={root.id} className="space-y-4">
                  {/* Root Node Capsule */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setSelectedNodeId(root.id)}
                      className={`px-5 py-3 rounded-2xl border font-bold text-sm sm:text-base transition-all text-center max-w-md ${getColorStyles(
                        root.color,
                        isSelected
                      )}`}
                    >
                      {root.label}
                    </button>
                  </div>

                  {/* Branches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {rootChildren.map((branch) => {
                      const branchChildren = childMap.get(branch.id) || [];
                      const isBranchSelected = selectedNodeId === branch.id;

                      return (
                        <div
                          key={branch.id}
                          className="flex flex-col items-center space-y-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
                        >
                          {/* Branch Node */}
                          <button
                            onClick={() => setSelectedNodeId(branch.id)}
                            className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${getColorStyles(
                              branch.color,
                              isBranchSelected
                            )}`}
                          >
                            {branch.label}
                          </button>

                          {/* Leaf Nodes */}
                          {branchChildren.length > 0 && (
                            <div className="w-full space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                              {branchChildren.map((leaf) => {
                                const isLeafSelected = selectedNodeId === leaf.id;
                                return (
                                  <button
                                    key={leaf.id}
                                    onClick={() => setSelectedNodeId(leaf.id)}
                                    className={`w-full text-left p-2 rounded-lg border text-[11px] font-medium transition-all truncate block ${getColorStyles(
                                      leaf.color,
                                      isLeafSelected
                                    )}`}
                                  >
                                    • {leaf.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Detail Inspector Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <Info className="h-4 w-4" />
              <span>Inspecting Concept Node</span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedNode.label}
                </h4>

                {selectedNode.description && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedNode.description}
                  </div>
                )}

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span>Node Type:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {!selectedNode.parentId ? 'Lecture Root' : 'Sub-Concept / Mechanism'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Belongs to Lecture:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                      {lecture.title}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click a node on the left to see details.</p>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Quick Tip:
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Use this hierarchical breakdown to sketch your essay outlines or build mental memory palaces before exam day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
