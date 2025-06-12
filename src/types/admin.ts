
export interface StateRule {
  id: string;
  state: string;
  category: 'Public Adjuster Compliance' | 'Insurance Carrier Obligations' | 'Legal Framework' | 'Construction Standards' | 'Professional Resources';
  subcategory: string;
  rule: string;
  description: string;
  confidence: 'Statutory' | 'Regulatory' | 'Advisory';
  sourceUrl?: string;
  effectiveDate: string;
  expirationDate?: string;
  version: string;
  lastUpdated: string;
}

export interface ResponseTemplate {
  id: string;
  category: string;
  template: string;
  variables: string[];
  confidence: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
}

export interface ComplianceAlert {
  id: string;
  state: string;
  type: 'Bond Expiration' | 'Rule Change' | 'Version Update' | 'Conflict Detected';
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  resolved: boolean;
}
