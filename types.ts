import React from 'react';

export interface AwarenessTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface PhishingEmail {
  id: number;
  sender: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  indicators: string[]; // List of reasons why it's phishing (if applicable)
}

export interface QuizResult {
  id: string;
  topic: string;
  score: number;
  total: number;
  date: string;
}

export enum DemoType {
  PHISHING = 'phishing',
  PASSWORD = 'password',
  ENCRYPTION = 'encryption',
  MALWARE = 'malware'
}