import React, { useState } from 'react';
import { Calendar, Sparkles, Activity, Info } from 'lucide-react';

export const ContributionHeatmap = ({ heatmap = [], monthlySummary = [], totalContributions = 0 }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return 'bg-[#BAE6FD] hover:bg-[#7dd3fc] border-[#0284c7]';
      case 2:
        return 'bg-[#60A5FA] hover:bg-[#3b82f6] border-[#2563eb]';
      case 3:
        return 'bg-[#3155FF] hover:bg-[#1d4ed8] border-[#151515]';
      case 0:
      default:
        return 'bg-[#E5E5E0] hover:bg-[#d4d4cb] border-[#151515]/20';
    }
  };

  const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="brutal-card p-4 md:p-6 bg-white space-y-4 select-none">
      
      {/* Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#151515]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#3155FF] border-2 border-[#151515] flex items-center justify-center text-white">
            <Activity className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-display uppercase tracking-wide text-[#151515]">
              GitHub Contribution Heatmap
            </h3>
            <p className="text-[10px] font-mono font-bold text-[#151515]/70">
              52-Week Activity &amp; Commit Distribution
            </p>
          </div>
        </div>

        {/* Hover date tooltip preview */}
        <div className="min-h-[26px] flex items-center">
          {hoveredDay ? (
            <div className="px-2.5 py-1 rounded-md bg-[#F5F04E] border border-[#151515] text-[11px] font-mono font-extrabold text-[#151515] shadow-[1px_1px_0px_#151515] animate-fadeIn">
              <span>{hoveredDay.count} {hoveredDay.count === 1 ? 'activity' : 'activities'} on {hoveredDay.date}</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-[#151515]/60 font-semibold">
              Hover over a square to see daily activity
            </span>
          )}
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="min-w-[700px] flex gap-1">
          {/* Day of Week Labels */}
          <div className="flex flex-col justify-between py-1 pr-2 text-[9px] font-mono font-extrabold text-[#151515]/60 shrink-0">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* 52 Weeks Grid Columns */}
          <div className="flex gap-[3px] flex-1">
            {heatmap.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.days.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-[11px] h-[11px] rounded-[2px] border ${getLevelColor(day.level)} cursor-pointer transition-all hover:scale-125 hover:z-10`}
                    title={`${day.count} activities on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Legend & Monthly Summaries */}
      <div className="pt-3 border-t-2 border-[#151515] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono font-bold">
        
        {/* Monthly Summary Chips */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase text-[#151515]/70 shrink-0">
            Recent Months:
          </span>
          {monthlySummary && monthlySummary.length > 0 ? (
            monthlySummary.map((m, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#F5F5F0] border border-[#151515] text-[10px] text-[#151515] shrink-0"
              >
                {m.month}: <span className="text-[#3155FF] font-black">{m.count}</span>
              </span>
            ))
          ) : (
            <span className="text-[10px] text-[#151515]/60">Recorded in public events stream</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-1.5 self-end sm:self-auto shrink-0">
          <span className="text-[10px] text-[#151515]/70">Less</span>
          <span className="w-3 h-3 rounded-[2px] bg-[#E5E5E0] border border-[#151515]/30" />
          <span className="w-3 h-3 rounded-[2px] bg-[#BAE6FD] border border-[#0284c7]" />
          <span className="w-3 h-3 rounded-[2px] bg-[#60A5FA] border border-[#2563eb]" />
          <span className="w-3 h-3 rounded-[2px] bg-[#3155FF] border border-[#151515]" />
          <span className="text-[10px] text-[#151515]/70">More</span>
        </div>

      </div>

    </div>
  );
};
