
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import { ComplianceAlert } from '../types/admin';

interface AlertSourceModalProps {
  alert: ComplianceAlert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlertSourceModal: React.FC<AlertSourceModalProps> = ({
  alert,
  isOpen,
  onClose
}) => {
  if (!alert) return null;

  const isExternal = alert.type === 'Rule Change' || alert.type === 'Version Update';
  
  // Mock source data - in real app this would come from the alert object
  const getSources = () => {
    if (alert.state === 'Kentucky' && alert.rule_id === 'KY-PUBADJ-FEES-003') {
      return {
        type: 'external',
        sources: [
          {
            title: 'Kentucky Department of Insurance - Fee Cap Legislation',
            url: 'https://insurance.ky.gov/policyholders/Pages/public-adjusters.aspx',
            authority: 'KY DOI',
            effective: '2024-01-01'
          },
          {
            title: 'KRS 304.12-235 - Public Adjuster Fees',
            url: 'https://legislature.ky.gov/Statutes/statute.aspx?id=38830',
            authority: 'Kentucky Legislature',
            effective: '2024-01-01'
          }
        ]
      };
    } else if (alert.state === 'Kentucky' && alert.rule_id === 'KY-PROP-MATCH-007') {
      return {
        type: 'external',
        sources: [
          {
            title: '806 KAR 12:095 - Property Matching Requirements',
            url: 'https://apps.legislature.ky.gov/law/kar/806/012/095.pdf',
            authority: 'KY Administrative Regulations',
            expires: '2028-11-30'
          }
        ]
      };
    } else {
      return {
        type: 'internal',
        sources: [
          {
            title: 'Internal Bond Tracking System',
            description: 'System-generated alert based on bond expiration dates',
            lastChecked: new Date().toLocaleDateString()
          }
        ]
      };
    }
  };

  const sourceData = getSources();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isExternal ? (
              <ExternalLink className="h-5 w-5 text-blue-600" />
            ) : (
              <FileText className="h-5 w-5 text-purple-600" />
            )}
            Alert Sources - {alert.state}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{alert.state}</Badge>
            <Badge variant={alert.priority === 'High' ? 'destructive' : 'secondary'}>
              {alert.priority}
            </Badge>
            <Badge variant="secondary">{alert.type}</Badge>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Alert Details</h4>
            <p className="text-sm mb-2">{alert.message}</p>
            {alert.rule_id && (
              <p className="text-xs text-muted-foreground">Rule ID: {alert.rule_id}</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {sourceData.type === 'external' ? (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Official Sources
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Internal References
                </>
              )}
            </h4>
            
            <div className="space-y-3">
              {sourceData.sources.map((source: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  {sourceData.type === 'external' ? (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">{source.title}</h5>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(source.url, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Authority: {source.authority}
                      </p>
                      {source.effective && (
                        <p className="text-xs text-green-600">
                          Effective: {source.effective}
                        </p>
                      )}
                      {source.expires && (
                        <p className="text-xs text-orange-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expires: {source.expires}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <h5 className="font-medium mb-2">{source.title}</h5>
                      <p className="text-sm text-muted-foreground mb-1">
                        {source.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last checked: {source.lastChecked}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              State-specific compliance information for {alert.state} only. 
              Do not apply to other jurisdictions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
