import type { CostItem, MonthlyCostData } from '../types/cloud';

export const defaultCostItems: CostItem[] = [
  {
    id: 'cost-ec2',
    service: 'EC2',
    category: 'Compute',
    quantity: 4,
    hours: 720,
    unitPrice: 0.0464,
    monthlyCost: 133.63,
    annualCost: 1603.58,
    color: '#2563EB',
  },
  {
    id: 'cost-s3',
    service: 'S3',
    category: 'Storage',
    quantity: 2,
    hours: 720,
    unitPrice: 0.023,
    monthlyCost: 33.12,
    annualCost: 397.44,
    color: '#16A34A',
  },
  {
    id: 'cost-rds',
    service: 'RDS',
    category: 'Database',
    quantity: 2,
    hours: 720,
    unitPrice: 0.115,
    monthlyCost: 165.6,
    annualCost: 1987.2,
    color: '#F59E0B',
  },
  {
    id: 'cost-cloudfront',
    service: 'CloudFront',
    category: 'CDN',
    quantity: 1,
    hours: 720,
    unitPrice: 0.085,
    monthlyCost: 61.2,
    annualCost: 734.4,
    color: '#8B5CF6',
  },
  {
    id: 'cost-route53',
    service: 'Route 53',
    category: 'Networking',
    quantity: 3,
    hours: 720,
    unitPrice: 0.004,
    monthlyCost: 8.64,
    annualCost: 103.68,
    color: '#EC4899',
  },
  {
    id: 'cost-lambda',
    service: 'Lambda',
    category: 'Serverless',
    quantity: 1,
    hours: 720,
    unitPrice: 0.0000002,
    monthlyCost: 0.14,
    annualCost: 1.73,
    color: '#14B8A6',
  },
  {
    id: 'cost-vpc',
    service: 'VPC',
    category: 'Networking',
    quantity: 1,
    hours: 720,
    unitPrice: 0.045,
    monthlyCost: 32.4,
    annualCost: 388.8,
    color: '#F97316',
  },
];

export const monthlyEvolution: MonthlyCostData[] = [
  { month: 'Ene', total: 980, EC2: 350, S3: 80, RDS: 320, CloudFront: 180, Route53: 50 },
  { month: 'Feb', total: 1020, EC2: 370, S3: 90, RDS: 330, CloudFront: 175, Route53: 55 },
  { month: 'Mar', total: 1085, EC2: 395, S3: 100, RDS: 340, CloudFront: 190, Route53: 60 },
  { month: 'Abr', total: 1120, EC2: 410, S3: 110, RDS: 345, CloudFront: 195, Route53: 60 },
  { month: 'May', total: 1180, EC2: 430, S3: 118, RDS: 355, CloudFront: 210, Route53: 67 },
  { month: 'Jun', total: 1145, EC2: 415, S3: 112, RDS: 348, CloudFront: 205, Route53: 65 },
  { month: 'Jul', total: 1210, EC2: 445, S3: 125, RDS: 360, CloudFront: 215, Route53: 65 },
  { month: 'Ago', total: 1190, EC2: 438, S3: 122, RDS: 355, CloudFront: 210, Route53: 65 },
  { month: 'Sep', total: 1245, EC2: 455, S3: 130, RDS: 368, CloudFront: 222, Route53: 70 },
  { month: 'Oct', total: 1249, EC2: 460, S3: 133, RDS: 372, CloudFront: 220, Route53: 64 },
];

export const calculateCosts = (item: Omit<CostItem, 'id' | 'monthlyCost' | 'annualCost' | 'color'>) => {
  const monthly = item.quantity * item.hours * item.unitPrice;
  return {
    monthlyCost: parseFloat(monthly.toFixed(2)),
    annualCost: parseFloat((monthly * 12).toFixed(2)),
  };
};

export const SERVICE_PRICES: Record<string, number> = {
  EC2: 0.0464,
  S3: 0.023,
  RDS: 0.115,
  CloudFront: 0.085,
  'Route 53': 0.004,
  Lambda: 0.0000002,
  VPC: 0.045,
  IAM: 0,
  ECS: 0.0408,
  EKS: 0.1,
};
