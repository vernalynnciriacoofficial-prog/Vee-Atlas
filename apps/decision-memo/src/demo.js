export const DEMO_EXTRACT = {
  title: 'EA Support: Full-Time Hire vs Virtual Assistant Service',
  context:
    'As the company enters a growth phase, the CEO needs dedicated executive support. Administrative burden — calendar management, travel coordination, board prep, and stakeholder comms — is consuming roughly 20% of the CEO\'s weekly hours.',
  constraints: [
    '$80k–$120k annual budget for a full-time hire',
    'Need support in place within 6 weeks',
    'Team is remote-first',
  ],
  stakeholders: ['CEO', 'Head of People', 'CFO'],
  options: [
    {
      name: 'Hire Full-Time EA',
      description: 'Recruit and onboard a dedicated full-time executive assistant embedded in the company.',
    },
    {
      name: 'Virtual Assistant Service',
      description: 'Contract with a premium VA service (e.g. Belay or Time Etc.) on a flexible monthly plan.',
    },
  ],
};

export const DEMO_MEMO = {
  context:
    'The company is entering a growth phase requiring the CEO to focus on strategic priorities. Current administrative load is consuming roughly 20% of the CEO\'s weekly hours across calendar management, travel coordination, board prep, and stakeholder communications. A dedicated executive support solution is needed within six weeks to sustain momentum ahead of a Series B process.',
  options: [
    {
      name: 'Hire Full-Time EA',
      description:
        'Recruit and onboard a dedicated full-time executive assistant who works exclusively for the CEO and is embedded in company culture, attending key meetings and developing deep institutional context over time.',
      pros: [
        'Builds deep institutional knowledge and context over time',
        'Full availability during business hours with no shared attention',
        'Stronger alignment with company culture and confidential priorities',
      ],
      cons: [
        'All-in cost of $90k–$120k/year including benefits',
        '4–8 week hiring cycle delays relief',
        'Severance exposure and management overhead if fit is poor',
      ],
      risk: 'Medium',
    },
    {
      name: 'Virtual Assistant Service',
      description:
        'Contract with a premium VA service such as Belay or Time Etc., providing a vetted remote assistant on a flexible monthly plan that can be scaled or cancelled with 30 days\' notice.',
      pros: [
        'Operational in 1–2 weeks — immediate relief',
        'No benefits, payroll overhead, or severance risk',
        'Flexible — scale hours up or down as needs evolve',
      ],
      cons: [
        'Assistant may be shared or rotated, reducing continuity',
        'Limited context on internal culture and sensitive priorities',
        'Ceiling on task complexity — strategic projects may need a FT hire eventually',
      ],
      risk: 'Low',
    },
  ],
  recommendation:
    'We recommend starting with a premium virtual assistant service for the first 90 days. This provides immediate relief while the team defines the full scope of the role. If the CEO\'s support needs exceed what a VA can handle — particularly around strategic projects and sensitive communications — transition to a full-time hire with a clearer job brief informed by the trial period.',
  nextSteps: [
    'Shortlist and interview two VA services (Belay, Time Etc.) by end of week',
    'Define a 30-day onboarding scope and communication norms with the chosen VA',
    'Schedule a 60-day review with CEO and Head of People to assess fit and FT hire timeline',
  ],
};
