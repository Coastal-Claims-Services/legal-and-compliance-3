import { StateRule } from '../types/admin';

// Alabama Public Adjuster Rules v0.9
// IMPORTANT: Alabama does NOT license public adjusters - PA activity is ILLEGAL
export const alabamaRules: StateRule[] = [
  {
    id: 'AL-PUBADJ-STATUS-001',
    state: 'Alabama',
    rule_id: 'AL-PUBADJ-STATUS-001',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'AGENCY',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'License Requirements',
    text: 'Alabama **does not license or recognize public adjusters.** The Department of Insurance FAQ states that anyone acting for a policy‑holder on a claim must do so as an attorney or be in danger of unlicensed activity penalties and the unauthorized practice of law. No bond, fee cap, or contract form is available because the role itself is not recognized.',
    sources: ['ALDOI Licensing FAQ (public‑adjuster answer)'],
    tests: [
      { given: { acts_as_pa: true }, expect: 'ILLEGAL' },
      { given: { advertises_pa: true }, expect: 'ILLEGAL' }
    ]
  },
  {
    id: 'AL-CARRIER-ACK-002',
    state: 'Alabama',
    rule_id: 'AL-CARRIER-ACK-002',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'REG',
    confidence: 'HIGH',
    category: 'Insurance Carrier Obligations',
    subcategory: 'Response Timeframes',
    text: 'Insurer must acknowledge notice of a first‑party claim **within 15 days** and send any required claim forms or assistance. (Ala. Admin. Code 482‑1‑125‑.06(1)‑(4)).',
    sources: ['482‑1‑125‑.06 Ala. Admin. Code'],
    tests: [
      { given: { ack_days: 17 }, expect: 'FAIL' },
      { given: { ack_days: 10 }, expect: 'PASS' }
    ]
  },
  {
    id: 'AL-CARRIER-STATUS-003',
    state: 'Alabama',
    rule_id: 'AL-CARRIER-STATUS-003',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'REG',
    confidence: 'HIGH',
    category: 'Insurance Carrier Obligations',
    subcategory: 'Response Timeframes',
    text: '• Within **30 days** after a properly‑executed proof‑of‑loss, insurer must accept or deny and give reasons. • If more time is needed, insurer must so notify and give written updates **every 45 days**. (Ala. Admin. Code 482‑1‑125‑.07(1)‑(2)).',
    sources: ['482‑1‑125‑.07 Ala. Admin. Code'],
    tests: [
      { given: { days_since_pol: 35, no_update: true }, expect: 'FAIL' },
      { given: { days_since_pol: 20 }, expect: 'PASS' },
      { given: { days_since_last_update: 50 }, expect: 'FAIL' }
    ]
  },
  {
    id: 'AL-CARRIER-PAY-004',
    state: 'Alabama',
    rule_id: 'AL-CARRIER-PAY-004',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'REG',
    confidence: 'HIGH',
    category: 'Insurance Carrier Obligations',
    subcategory: 'Payment Deadlines',
    text: 'After liability is accepted and amount agreed, the insurer shall tender payment **within 30 days** (or sooner if the policy says). (Ala. Admin. Code 482‑1‑125‑.07(6)).',
    sources: ['482‑1‑125‑.07(6) Ala. Admin. Code'],
    tests: [
      { given: { days_since_agree: 32 }, expect: 'FAIL' },
      { given: { days_since_agree: 10 }, expect: 'PASS' }
    ]
  },
  {
    id: 'AL-LAW-BADFAITH-005',
    state: 'Alabama',
    rule_id: 'AL-LAW-BADFAITH-005',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'CASE',
    confidence: 'HIGH',
    category: 'Legal Framework',
    subcategory: 'Bad Faith Standards',
    text: '*Chavers v. Nat\'l Sec. Fire* (1981) created Alabama\'s first‑party bad‑faith tort. *Nat\'l Sec. Fire v. Bowen* (1982) set the test: 1️⃣ Policy breach plus 2️⃣ No reasonable basis to deny plus 3️⃣ Insurer\'s knowledge of that fact. Punitive damages are available on proof of "intentional or reckless" misconduct.',
    sources: [
      '*Chavers v. Nat\'l Sec. Fire*, 405 So.2d 1 (Ala. 1981)',
      '*Nat\'l Sec. Fire v. Bowen*, 417 So.2d 179 (Ala. 1982)'
    ],
    tests: [
      { given: { breach: true, no_reasonable_basis: true, knowledge: true }, expect: 'BAD_FAITH_OK' },
      { given: { breach: false }, expect: 'BAD_FAITH_BAR' }
    ]
  },
  {
    id: 'AL-LAW-SOL-006',
    state: 'Alabama',
    rule_id: 'AL-LAW-SOL-006',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'STATUTE',
    confidence: 'MEDIUM',
    category: 'Legal Framework',
    subcategory: 'Statute of Limitations',
    text: 'Written‑contract actions (including property policies) must be filed **within 6 years** unless the policy validly shortens the period. (Ala. Code § 6‑2‑34). Most HO policies in Alabama shorten to **2 years**; courts enforce if clear and not contrary to statute.',
    sources: ['Ala. Code § 6‑2‑34(9)'],
    tests: [
      { given: { years_since_dol: 7 }, expect: 'FAIL' },
      { given: { years_since_dol: 3, policy_sol_years: 2 }, expect: 'FAIL' }
    ]
  },
  {
    id: 'AL-PROP-MATCH-007',
    state: 'Alabama',
    rule_id: 'AL-PROP-MATCH-007',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'ADVISORY',
    confidence: 'LOW',
    sunset: '2027-06-30',
    category: 'Construction Standards',
    subcategory: 'Matching Requirements',
    text: 'Alabama has **no matching statute, regulation, or published case** on roof/siding uniformity. Scope disputes default to policy wording (RCV vs. ACV, "like kind & quality") and expert aesthetics testimony.',
    sources: ['MWL 50‑State Matching Survey (2019)'],
    tests: [
      { given: { match: false }, expect: 'POLICY_GOVERNS' }
    ]
  },
  {
    id: 'AL-RES-DOI-008',
    state: 'Alabama',
    rule_id: 'AL-RES-DOI-008',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'AGENCY',
    confidence: 'HIGH',
    category: 'Professional Resources',
    subcategory: 'Regulatory Contacts',
    text: 'Alabama Department of Insurance 201 Monroe St., Suite 502, Montgomery AL 36104 Phone (334) 269‑3550 | Consumer Hotline (800) 433‑3966 Email Insdept@insurance.alabama.gov',
    sources: ['ALDOI Contact page'],
    tests: []
  }
];