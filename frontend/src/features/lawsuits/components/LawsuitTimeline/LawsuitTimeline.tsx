import React from 'react';
import styles from './LawsuitTimeline.module.css';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'document';
}

interface LawsuitTimelineProps {
  events: TimelineEvent[];
}

const getIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'success': return <CheckCircle size={16} />;
    case 'warning': return <AlertTriangle size={16} />;
    case 'document': return <FileText size={16} />;
    default: return <Clock size={16} />;
  }
};

export const LawsuitTimeline: React.FC<LawsuitTimelineProps> = ({ events }) => {
  return (
    <div className={styles.timeline}>
      {events.map((event, index) => (
        <div key={event.id} className={styles.eventItem}>
          <div className={styles.lineWrapper}>
            <div className={`${styles.iconNode} ${styles[event.type]}`}>
              {getIcon(event.type)}
            </div>
            {index < events.length - 1 && <div className={styles.line} />}
          </div>
          <div className={styles.content}>
            <span className={styles.date}>{event.date}</span>
            <h4 className={styles.title}>{event.title}</h4>
            <p className={styles.description}>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
