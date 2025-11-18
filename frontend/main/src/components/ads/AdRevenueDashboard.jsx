import React  ,{useState, useEffect} from 'react'
import {  motion } from 'framer-motion'
import { DollarSign, Eye ,MousePointer, TrendingUp, Calendar, } from 'lucide-react'
import Terminal from '../Ui/Terminal'

const AdRevenueDashboard = () => {
  const [earnings, setEarnings] = useState(null);
  const [timeFrame, setTimeFrame] = useState('week');

  const stats = [
    {
      label: 'Total Earnings',
      value: `$${earnings?.total_earnings.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-hacker-green'
    },
    {
      label: 'Impressions',
      value: `${earnings?.total_impressions.toFixed(2) || '0.00'}%`,
      icon: Eye,
      color: 'text-hacker-blue'
    },
    {
      label: 'Clicks',
      value: earnings?.total_clicks.toLocaleString() || '0',
      icon: MousePointer,
      color: 'text-hacker-red',
    },
    {
      label: 'CTR',
      value: `${earnings?.ctr.toFixed(2) || '0.00'}%`,
      icon: TrendingUp,
      color: 'text-hacker-green'
    }
  ];

  return (
    <Terminal title="Ad Revenue Analytics" icon={DollarSign}>
      <div className="space-y-6">
        {/* Timeframe */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className='text-hacker-green'></Calendar>
            <span className="font-mono text-sm text-gray-400">Timeframe</span>
          </div>
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  timeFrame === period
                    ? 'bg-hacker-green text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0}}
                transition={{ delay: index * 0.1}}
                className='glass-effect'
              >
                <div className="flex items-center justify-between mb-2 px-4 py-2">
                  <Icon size={20} className={stat.color}></Icon>
                  <div className="text-xs text-gray-400 font-mono">{stat.label}</div>
                </div>
                <div className={`text-xl text-center font-bold font-mono ${stat.color}`}>
                  {stat.value}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Revenue chart Placeholder */}
        <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-sm text-hacker-green">Popular Revenue Trend</span>
            <span className="font-mono text-xs text-gray-400"> Last 7 days </span>
          </div>
          <div className="h-32 flex items-end justify-between space-x-1">
            {[20, 35, 45, 30, 55, 40, 60].map((height, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ height: 0}}
                  animate={{ height: height /* `${height}` */}}
                  transition={{delay: index * 0.1 + 0.5}}
                  className='w-full bg-gradient-to-t from-hacker-green to-hacker-blue rounded-t transition-all duration-500 hover:opacity-80'
                  style={{ height: `${height}%`}}
                ></motion.div>
                <span className="text-xs text-gray-400 font-mono mt-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Otimization Tips */}
        <div className="bg-hacker-blue/20 border border-hacker-blue/40 rounded-lg p-4">
            <div className="font-bold text-hacker-blue font-mono text-sm mb-2">
              Optimization Tips
            </div>
            <div className="text-xs text-gray-300 font-mono space-y-1">
              <div> Place ads in high-visibility areas</div>
              <div> Use rewarded ads for better user engagement</div>
              <div> Test different ad formats and placements</div>
              <div> Maintain balance between ads and user exerience</div>
            </div>
        </div>
      </div>
    </Terminal>
  )
}

export default AdRevenueDashboard