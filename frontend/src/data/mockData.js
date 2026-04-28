export const mockUser = {
  id: 'u_001',
  name: 'Sarah Johnson',
  role: 'Field Coordinator',
  location: 'Mumbai Central District',
  activeSince: 'January 2026',
  skills: ['Communication', 'Teaching', 'First Aid', 'Organization', 'Physical Labor', 'Cooking'],
  impact: { tasksCompleted: 24, hours: 142, rating: 4.9, badges: 6 },
  achievements: [
    { id: 'ach_1', title: 'Rising Star', subtitle: 'Completed 5 tasks', icon: 'medal' },
    { id: 'ach_2', title: 'Impact Maker', subtitle: '50 hours volunteered', icon: 'trend' },
    { id: 'ach_3', title: 'Top Contributor', subtitle: 'Highest rating this month', icon: 'star' },
  ],
  recentMissions: [
    { id: 'm_1', title: 'Food Distribution', date: 'Apr 20, 2026', rating: 5 },
    { id: 'm_2', title: 'Teaching Session', date: 'Apr 18, 2026', rating: 5 },
    { id: 'm_3', title: 'Medical Supply Delivery', date: 'Apr 15, 2026', rating: 4 },
  ],
}

export const mockStats = {
  urgent: 6,
  active: 12,
  completed: 24,
  volunteersOnline: 38,
}

export const mockIntelligence = {
  kpis: [
    {
      id: 'k_total',
      icon: 'cube',
      label: 'Total Reports',
      value: '1,247',
      delta: '+12%',
      tone: 'indigo',
    },
    {
      id: 'k_hotspots',
      icon: 'pin',
      label: 'Active Hotspots',
      value: '8',
      delta: '+2',
      tone: 'rose',
    },
    {
      id: 'k_resolution',
      icon: 'check',
      label: 'Resolution Rate',
      value: '87%',
      delta: '+5%',
      tone: 'teal',
    },
  ],
  clusters: [
    {
      id: 'c_01',
      severity: 'critical',
      title: 'Water Shortage Crisis',
      zone: 'Zone B - Dharavi',
      reports: 5,
      aiInsight: '5 reports of water shortage detected in the last 6 hours',
      cta: 'Deploy Response Team',
    },
    {
      id: 'c_02',
      severity: 'high',
      title: 'Medical Supply Gap',
      zone: 'Zone D - Bandra',
      reports: 3,
      aiInsight: 'Cluster analysis shows urgent need for medical supplies',
      cta: 'Deploy Response Team',
    },
    {
      id: 'c_03',
      severity: 'high',
      title: 'Food Distribution Needed',
      zone: 'Zone A - Andheri',
      reports: 7,
      aiInsight: 'Multiple households reporting food insecurity',
      cta: 'Deploy Response Team',
    },
  ],
}

export const mockAnalytics = {
  kpis: [
    { id: 'a_total', icon: 'pulse', label: 'Total Reports', value: '1,247', delta: '+12%', tone: 'indigo' },
    { id: 'a_hotspots', icon: 'alert', label: 'Active Hotspots', value: '8', delta: '+2', tone: 'rose' },
    { id: 'a_resolution', icon: 'check', label: 'Resolution Rate', value: '87%', delta: '+5%', tone: 'teal' },
    { id: 'a_response', icon: 'clock', label: 'Avg Response Time', value: '2.3h', delta: '-0.8h', tone: 'amber' },
  ],
  trends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    deployments: [42, 50, 66, 72],
    volunteers: [44, 52, 68, 74],
  },
  categories: [
    { label: 'Food Relief', value: 35, color: '#dc2626' },
    { label: 'Healthcare', value: 28, color: '#10b981' },
    { label: 'Education', value: 22, color: '#f59e0b' },
    { label: 'Environment', value: 15, color: '#8b5cf6' },
  ],
  geo: {
    labels: ['Downtown', 'Riverside', 'Westside', 'Eastside', 'Suburbs'],
    values: [45, 38, 31, 28, 22],
  },
  impact: [
    { label: 'Tasks Resolved', valueText: '1,087 / 1,247', value: 1087, max: 1247, color: 'bg-teal-600' },
    { label: 'Volunteer Hours', valueText: '4,520 hours', value: 4520, max: 6000, color: 'bg-indigo-600' },
    { label: 'Families Assisted', valueText: '8,450', value: 8450, max: 10000, color: 'bg-amber-500' },
  ],
}

export const mockNotifications = [
  {
    id: 'n_001',
    title: 'Critical Water Crisis',
    body: '5 new reports of water shortage detected in Dharavi Zone B',
    type: 'critical',
    time: '5 minutes ago',
    unread: true,
    actionText: 'View Details →',
    actionTone: 'critical',
  },
  {
    id: 'n_002',
    title: 'AI Cluster Detected',
    body: 'Pattern analysis shows emerging food insecurity trend in Andheri',
    type: 'ai',
    time: '15 minutes ago',
    unread: true,
    actionText: 'View Details →',
    actionTone: 'ai',
  },
  {
    id: 'n_003',
    title: 'Mission Completed',
    body: 'Medical supply distribution task successfully resolved',
    type: 'success',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'n_004',
    title: 'High Priority Match',
    body: '3 volunteers with 95%+ match available for your posted task',
    type: 'priority',
    time: '5 hours ago',
    unread: false,
    actionText: 'View Details →',
    actionTone: 'priority',
  },
  {
    id: 'n_005',
    title: 'Impact Milestone',
    body: 'Your organization reached 1000+ completed interventions!',
    type: 'milestone',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'n_006',
    title: 'Scheduled Deployment',
    body: 'Community health check starts in 1 hour',
    type: 'schedule',
    time: 'Yesterday',
    unread: false,
    actionText: 'View Details →',
    actionTone: 'schedule',
  },
]

export const mockTasks = [
  {
    id: 't_1001',
    title: 'Water distribution support',
    description:
      'Help distribute water cans at the community center. Coordinate queue + record counts.',
    urgency: 'urgent',
    status: 'open',
    category: 'Relief',
    location: 'Ward 3 Community Center',
    geo: { lat: 18.5208, lng: 73.8567 },
    distanceKm: 2.1,
    timeWindow: 'Today, 4:00–6:00 PM',
    ngo: 'HopeHands NGO',
  },
  {
    id: 't_1002',
    title: 'Food kit packing',
    description:
      'Pack dry ration kits (rice, dal, oil). Label + count. Moderate physical work.',
    urgency: 'normal',
    status: 'open',
    category: 'Food',
    location: 'Central Warehouse',
    geo: { lat: 18.5125, lng: 73.8476 },
    distanceKm: 5.8,
    timeWindow: 'Tomorrow, 10:00 AM–1:00 PM',
    ngo: 'ServeTogether',
  },
  {
    id: 't_1003',
    title: 'Medical camp registration desk',
    description:
      'Manage patient registration queue + assist senior citizens. Requires calm communication.',
    urgency: 'urgent',
    status: 'open',
    category: 'Health',
    location: 'Clinic Zone A',
    geo: { lat: 18.5312, lng: 73.844 },
    distanceKm: 1.4,
    timeWindow: 'Sat, 9:00 AM–12:00 PM',
    ngo: 'HealthBridge',
  },
  {
    id: 't_1004',
    title: 'Field survey follow-up',
    description:
      'Visit 10 households to validate survey entries and capture missing details.',
    urgency: 'normal',
    status: 'completed',
    category: 'Survey',
    location: 'Ward 5',
    geo: { lat: 18.5169, lng: 73.8697 },
    distanceKm: 3.7,
    timeWindow: 'Completed',
    ngo: 'Data4Good',
  },
]

export const mockAdmin = {
  kpis: [
    { label: 'Reports ingested', value: '1,248', delta: '+12%' },
    { label: 'Open needs', value: '78', delta: '+4%' },
    { label: 'Volunteers active', value: '312', delta: '+9%' },
  ],
  chart: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [12, 18, 14, 22, 19, 27, 24],
  },
}

export const mockDonations = {
  stats: [
    { label: 'Total Collected', value: '$4,500', delta: '+18%', icon: 'dollar' },
    { label: 'Monthly Recurring', value: '$2,750', delta: '+5', icon: 'trending' },
    { label: 'Active Donors', value: '5', delta: '+12', icon: 'users' },
  ],
  history: [
    {
      id: 'd_1',
      donor: 'Sarah Johnson',
      ngo: 'Food Drive',
      amount: 500,
      status: 'completed',
      type: 'one-time',
      date: '4/28/2026',
    },
    {
      id: 'd_2',
      donor: 'Tech Corp Inc',
      ngo: 'Education',
      amount: 2000,
      status: 'recurring',
      type: 'monthly',
      date: '4/27/2026',
    },
    {
      id: 'd_3',
      donor: 'Emily Davis',
      ngo: 'Healthcare',
      amount: 250,
      status: 'completed',
      type: 'one-time',
      date: '4/26/2026',
    },
  ],
}

export const mockNgos = [
  { id: 'ngo_1', name: 'Food Drive', category: 'Food Relief' },
  { id: 'ngo_2', name: 'Education', category: 'Education' },
  { id: 'ngo_3', name: 'Healthcare', category: 'Health' },
]


