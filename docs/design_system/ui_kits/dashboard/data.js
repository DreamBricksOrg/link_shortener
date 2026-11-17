(function () {
const PROJECTS = [
  { id: 'p1', name: 'Q3 Rebrand', client: 'Internal', status: 'active', progress: 62, due: 'Aug 14, 2026', team: ['AL', 'RM', 'JT'], description: 'Refresh the DreamBricks visual identity across web, deck, and product surfaces.' },
  { id: 'p2', name: 'Mobile Onboarding Revamp', client: 'Internal', status: 'active', progress: 30, due: 'Sep 2, 2026', team: ['KP', 'AL'], description: 'Redesign first-run flow to reduce signup drop-off.' },
  { id: 'p3', name: 'Bricko Retail — Storefront', client: 'Bricko Retail', status: 'active', progress: 81, due: 'Jul 22, 2026', team: ['JT', 'MS', 'RM', 'KP'], description: 'E-commerce storefront rebuild on the new component library.' },
  { id: 'p4', name: 'Nimbus Health — Patient Portal', client: 'Nimbus Health', status: 'at_risk', progress: 45, due: 'Jul 18, 2026', team: ['AL', 'MS'], description: 'Patient-facing portal for appointment scheduling and records.' },
  { id: 'p5', name: 'Atlas Freight — Ops Dashboard', client: 'Atlas Freight', status: 'completed', progress: 100, due: 'Jun 30, 2026', team: ['RM', 'JT'], description: 'Fleet tracking dashboard delivered and handed off.' },
  { id: 'p6', name: 'Coral Bank — Statement Redesign', client: 'Coral Bank', status: 'completed', progress: 100, due: 'Jun 12, 2026', team: ['KP', 'AL', 'MS'], description: 'Monthly statement PDF + in-app equivalent redesign.' },
  { id: 'p7', name: 'Internal — Design System v2', client: 'Internal', status: 'completed', progress: 100, due: 'May 28, 2026', team: ['JT'], description: 'Migrated component library to the new token architecture.' },
];

const ACTIVITY = [
  { who: 'Ana L.', what: 'marked "Wireframe review" complete', project: 'Q3 Rebrand', when: '2h ago' },
  { who: 'Rafa M.', what: 'uploaded 4 new assets', project: 'Bricko Retail — Storefront', when: '5h ago' },
  { who: 'Marina S.', what: 'flagged a blocker', project: 'Nimbus Health — Patient Portal', when: 'Yesterday' },
  { who: 'Kaio P.', what: 'closed the project', project: 'Coral Bank — Statement Redesign', when: '2 days ago' },
];

window.DASHBOARD_DATA = { PROJECTS, ACTIVITY };
})();
