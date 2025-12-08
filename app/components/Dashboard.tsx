
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import {
  TrendingUp, Users, AlertTriangle, Smile, Calendar, BookOpen,
  Shield, Activity, Phone, Clock, FileText, CheckCircle, Notebook
} from 'lucide-react';
import { Role } from '@/types';
import NotesSidebar from './NotesSidebar';
// import ChatInterface from './ChatInterface';


interface DashboardProps {
  role: Role;
  userName: string;
}

const studentData = [
  { name: 'Mon', mood: 6 },
  { name: 'Tue', mood: 7 },
  { name: 'Wed', mood: 5 },
  { name: 'Thu', mood: 8 },
  { name: 'Fri', mood: 9 },
  { name: 'Sat', mood: 8 },
  { name: 'Sun', mood: 9 },
];

const schoolData = [
  { name: 'Grade 9', stress: 40, happiness: 60 },
  { name: 'Grade 10', stress: 55, happiness: 45 },
  { name: 'Grade 11', stress: 70, happiness: 30 },
  { name: 'Grade 12', stress: 65, happiness: 35 },
];

const StatCard = ({ icon: Icon, title, value, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp size={12} /> {trend}</p>}
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ role, userName }) => {
  const [showNotes, setShowNotes] = useState(false);

  if (role === 'student' || role === 'guest') {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Chat Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Hello, {userName}</h1>
                <p className="text-orange-50 opacity-90 max-w-xl">"Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'"</p>
                <div className="flex gap-3 mt-6">
                  <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
                    Daily Check-in
                  </button>
                  <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
                    <Phone size={16} /> Start Live Session
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-1">
              {/* <ChatInterface /> */}
            </div>
          </div>

          {/* Right Column: Stats & Resources */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mood Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Mood Trends</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">+15% vs last week</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                    <YAxis hide domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#F97316"
                      strokeWidth={4}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6, fill: '#F97316', strokeWidth: 3, stroke: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-amber-50 rounded-2xl border border-amber-100 hover:bg-amber-100 transition-colors text-left group">
                <BookOpen className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                <span className="block font-bold text-slate-800 text-sm">Journal</span>
                <span className="text-xs text-slate-500">Log thoughts</span>
              </button>
              <button className="p-4 bg-orange-50 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors text-left group">
                <Activity className="text-orange-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                <span className="block font-bold text-slate-800 text-sm">Breathe</span>
                <span className="text-xs text-slate-500">2 min calm</span>
              </button>
            </div>

            {/* Upcoming */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Up Next</h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                    14
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Group Counseling</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> 2:00 PM • Library</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center opacity-60">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold shrink-0">
                    15
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Mental Health Awareness</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> 10:00 AM • Auditorium</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Notes Button & Sidebar */}
        <button
          onClick={() => setShowNotes(true)}
          className="fixed  w-16 h-16 bg-orange-600 text-white rounded-full shadow-xl hover:bg-orange-700 hover:scale-110 transition-all z-40 flex items-center justify-center font-bold"
          title="Open Notes"
        >
          <Notebook size={24} />
        </button>
        <NotesSidebar show={showNotes} onClose={() => setShowNotes(false)} />
      </div>
    );
  }

  // School Admin View
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Real-time overview of student wellbeing across campus.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Calendar size={16} /> Last 30 Days
            </button>
            <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary/25">
              <FileText size={16} /> Generate Report
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Students" value="1,240" color="bg-blue-500" icon={Users} trend="+5%" />
          <StatCard title="Avg. Wellness Score" value="7.8" color="bg-emerald-500" icon={Smile} trend="+2%" />
          <StatCard title="Intervention Alerts" value="12" color="bg-rose-500" icon={AlertTriangle} />
          <StatCard title="Resources Accessed" value="3,405" color="bg-amber-500" icon={BookOpen} trend="+12%" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8">Sentiment Analysis by Grade</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schoolData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="happiness" fill="#F97316" name="Happiness Index" radius={[8, 8, 8, 8]} />
                  <Bar dataKey="stress" fill="#cbd5e1" name="Stress Levels" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield className="text-primary" size={24} /> Live Alerts
            </h3>
            <div className="space-y-6">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-emerald-600" size={18} />
                  <span className="font-bold text-emerald-800 text-sm">System Secure</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">All chats are currently anonymized. No immediate self-harm keywords detected in the last hour.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Recent Flags</h4>
                <ul className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <AlertTriangle size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-slate-700 font-medium mb-1">Keyword "Anxiety" Spike</p>
                        <p className="text-slate-500 text-xs">Detected in Grade 10 cluster. <span className="text-primary cursor-pointer hover:underline font-medium">View details.</span></p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
