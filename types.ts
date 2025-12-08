import React from 'react';

export type Role = 'student' | 'school' | 'guest' | 'user';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  positive?: boolean;
  icon: React.ReactNode;
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}