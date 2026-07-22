import React from 'react';
import { BookOpen, Users, Compass, ClipboardList, ArrowRight } from 'lucide-react';

const MODULES = [
  { icon: BookOpen, label: 'Sunday School' },
  { icon: Users, label: 'Members & Committee' },
  { icon: Compass, label: 'Trips & Outings' },
  { icon: ClipboardList, label: 'Volunteers & Duty Roster' },
];

const KnowMyChurchPromo = () => {
  return (
    <div className="bg-white border border-[#DCE2EF] rounded-xl p-6 sm:p-8">
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <h2
          className="font-serif text-2xl sm:text-3xl font-bold text-[#141F38] mb-3"
          style={{ fontOpticalSizing: 'none', fontVariationSettings: '"opsz" 9' }}
        >
          Your Whole Church, Not Just Sunday School
        </h2>
        <p className="text-sm sm:text-base text-[#33477A]">
          Sunday School classes and attendance, a members & committee directory, trip planning,
          and a volunteer duty roster — all under one church code.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {MODULES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="bg-white border border-[#DCE2EF] rounded-xl p-4 text-center hover:border-[#DFBC79] hover:shadow-md transition-all"
          >
            <Icon className="w-6 h-6 mx-auto mb-2 text-[#33477A]" />
            <div className="text-xs sm:text-sm font-semibold text-[#1B2A4A]">{label}</div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs sm:text-sm text-[#33477A] mb-4 max-w-md mx-auto">
        Attendance, this week's memory verse, and any homework — one link, shared in the class
        WhatsApp group. No app to download, no account to create.
      </p>

      <div className="flex flex-col items-center gap-2">
        <a
          href="https://knowurchurch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#C9A15A] text-[#141F38] px-8 py-3 rounded-lg hover:bg-[#D4AC66] transition-colors font-semibold text-sm shadow-sm"
        >
          Start free trial
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>
        <p className="text-xs text-[#5A6FA3]">No credit card required &bull; Cancel anytime</p>
      </div>
    </div>
  );
};

export default KnowMyChurchPromo;
