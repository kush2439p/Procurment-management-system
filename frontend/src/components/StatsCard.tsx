import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  color: 'primary' | 'success' | 'warning' | 'destructive';
}

const colorMap = {
  primary: 'from-primary/20 to-primary/5 border-primary/30 text-primary',
  success: 'from-success/20 to-success/5 border-success/30 text-success',
  warning: 'from-warning/20 to-warning/5 border-warning/30 text-warning',
  destructive: 'from-destructive/20 to-destructive/5 border-destructive/30 text-destructive',
};

const iconBg = {
  primary: 'bg-primary/15',
  success: 'bg-success/15',
  warning: 'bg-warning/15',
  destructive: 'bg-destructive/15',
};

export const StatsCard = ({ title, value, icon: Icon, trend, color }: StatsCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`glass-card bg-gradient-to-br ${colorMap[color]} p-5 cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{count.toLocaleString()}</p>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBg[color]}`}>
          <Icon className={`w-5 h-5 ${colorMap[color].split(' ').pop()}`} />
        </div>
      </div>
    </motion.div>
  );
};
