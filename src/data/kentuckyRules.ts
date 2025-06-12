
import { StateRule } from '../types/admin';

export const KENTUCKY_RULES: StateRule[] = [
  {
    id: '1',
    state: 'Kentucky',
    rule_id: 'KY-PUBADJ-LIC-001',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'License Requirements',
    text: 'A person may not act as a public adjuster in Kentucky without a license issued under KRS 304.9-430. Each licensee shall maintain a $50,000 surety bond or irrevocable letter of credit for the life of the license.',
    sources: ['KRS 304.9-430'],
    tests: [
      { given: { licensed: false }, expect: 'FAIL' },
      { given: { bond_amount: 30000 }, expect: 'FAIL' },
      { given: { licensed: true, bond_amount: 50000 }, expect: 'PASS' }
    ]
  },
  {
    id: '2',
    state: 'Kentucky',
    rule_id: 'KY-PUBADJ-FEES-003',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'Fee Caps & Structures',
    text: 'Non-cat claims – fee ≤ 15% of total recovery. Cat claims – fee ≤ 10%. If the insurer pays or commits in writing to pay policy limits within seventy-two (72) hours of the first notice of loss, charge only a reasonable time-based fee.',
    sources: ['2023 HB 232 § 1(4)(c)'],
    tests: [
      { given: { cat: false, fee_pct: 18 }, expect: 'FAIL' },
      { given: { cat: true, fee_pct: 9 }, expect: 'PASS' },
      { given: { policy_limits_paid_hrs: 48, fee_type: 'percent' }, expect: 'FAIL' }
    ]
  },
  {
    id: '3',
    state: 'Kentucky',
    rule_id: 'KY-CARRIER-PAY-005',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Insurance Carrier Obligations',
    subcategory: 'Payment Deadlines',
    text: 'The insurer must pay all undisputed amounts no later than thirty (30) days after receiving notice and proof of claim. Failure triggers 12% interest and, if the delay was without reasonable foundation, reasonable attorney fees.',
    sources: ['KRS 304.12-235(1)-(3)'],
    tests: [
      { given: { days_since_proof: 35, disputed: false }, expect: 'FAIL' },
      { given: { days_since_proof: 20, disputed: true }, expect: 'PASS' }
    ]
  },
  {
    id: '4',
    state: 'Kentucky',
    rule_id: 'KY-PROP-MATCH-007',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'REG',
    confidence: 'HIGH',
    sunset: '2028-11-30',
    category: 'Construction Standards',
    subcategory: 'Matching Requirements',
    text: 'If replacement items do not reasonably match in quality, color, and size, the insurer must replace all items in the area to achieve a reasonably uniform appearance. Applies to interior and exterior losses. No "line-of-sight" limitation is allowed.',
    sources: [
      '806 KAR 12:095 § 9(1)(b)',
      'DOI Advisory Opinion 2023-08'
    ],
    tests: [
      { given: { match: false }, expect: 'FULL_AREA_REPLACE' },
      { given: { match: true }, expect: 'PATCH_OK' }
    ]
  },
  {
    id: '5',
    state: 'Kentucky',
    rule_id: 'KY-LAW-FEESHIFT-008',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'CASE',
    confidence: 'HIGH',
    category: 'Legal Framework',
    subcategory: 'Fee-Shifting Statutes',
    text: 'When § 235 interest attaches, Kentucky courts may also award attorney fees if the delay was without reasonable foundation. *Motorists Mut. v. Glass* confirms the combination is permissible.',
    sources: ['Motorists Mut. v. Glass, 996 S.W.2d 437 (Ky. 1997)'],
    tests: [
      { given: { delay_without_foundation: true }, expect: 'FEES_YES' },
      { given: { delay_without_foundation: false }, expect: 'FEES_NO' }
    ]
  }
];
