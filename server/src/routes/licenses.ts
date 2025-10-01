import express from 'express';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import License from '../models/License';
import User from '../models/User';

const licensesRouter = express.Router();

// GET /api/licenses/my - Get all licenses for the authenticated user
licensesRouter.get('/my', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const licenses = await License.find({ assignedTo: req.user._id }).sort({ expiresDate: 1 });
        res.json({ licenses });
    } catch (error) {
        console.error('Error fetching licenses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/licenses - Create a new license
licensesRouter.post('/', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const { name, type, licenseNumber, state, issuedDate, expiresDate, assignedTo } = req.body;
        
        // Determine who the license is for
        const targetUserId = assignedTo || req.user._id;
        
        // Set status based on who is creating and for whom
        let status;
        if (req.user.role === 'admin') {
            // Admin creating license - approved by default
            status = 'approved';
        } else if (targetUserId.toString() === req.user._id.toString()) {
            // User creating license for themselves - pending approval
            status = 'pending';
        } else {
            // User trying to create license for someone else - not allowed
            return res.status(403).json({ error: 'Cannot create license for another user' });
        }
        
        const newLicense = new License({
            assignedTo: targetUserId,
            createdBy: req.user._id,
            name,
            type,
            licenseNumber,
            state,
            issuedDate,
            expiresDate,
            status,
            submittedAt: new Date()
        });
        await newLicense.save();
        res.status(201).json({ license: newLicense, message: 'License submitted for approval.' });
    } catch (error) {
        console.error('Error creating license:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/licenses/:id - Update license
licensesRouter.put('/:id', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const license = await License.findById(req.params.id);
        
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }
        
        // Users can only update their own licenses unless they are admin
        if (license.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const { name, type, licenseNumber, state, issuedDate, expiresDate } = req.body;
        
        // Update license fields
        if (name) license.name = name;
        if (type) license.type = type;
        if (licenseNumber) license.licenseNumber = licenseNumber;
        if (state) license.state = state;
        if (issuedDate) license.issuedDate = issuedDate;
        if (expiresDate) license.expiresDate = expiresDate;
        
        await license.save();
        
        res.json({
            license,
            message: 'License updated successfully'
        });
    } catch (error) {
        console.error('Error updating license:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/licenses/:id - Delete license
licensesRouter.delete('/:id', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const license = await License.findById(req.params.id);
        
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }
        
        // Users can only delete their own licenses unless they are admin
        if (license.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        await License.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'License deleted successfully' });
    } catch (error) {
        console.error('Error deleting license:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/licenses/:id/approve - Approve license (admin only)
licensesRouter.put('/:id/approve', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const license = await License.findById(req.params.id);
        
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }
        
        license.status = 'approved';
        license.reviewedAt = new Date();
        license.reviewedBy = req.user._id;
        
        await license.save();
        
        res.json({
            license,
            message: 'License approved successfully'
        });
    } catch (error) {
        console.error('Error approving license:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/licenses/:id/reject - Reject license (admin only)
licensesRouter.put('/:id/reject', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const license = await License.findById(req.params.id);
        
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }
        
        const { reviewNotes } = req.body || {};
        
        license.status = 'rejected';
        license.reviewedAt = new Date();
        license.reviewedBy = req.user._id;
        if (reviewNotes) license.reviewNotes = reviewNotes;
        
        await license.save();
        
        res.json({
            license,
            message: 'License rejected successfully'
        });
    } catch (error) {
        console.error('Error rejecting license:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/licenses/by-state/:state - Get all approved licenses for a specific state with user info
licensesRouter.get('/by-state/:state', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const { state } = req.params;
        console.log('🏛️ Admin fetching talent by state:', state, 'User:', req.user?.email);
        
        // State abbreviation to full name mapping
        const stateAbbrevToName: Record<string, string> = {
            'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
            'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
            'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
            'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
            'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
            'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
            'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
            'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
            'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
            'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
            'DC': 'District of Columbia'
        };
        
        // Determine search terms - check if it's an abbreviation or full name
        const searchTerms: string[] = [];
        const upperState = state.toUpperCase();
        
        // If it's a 2-letter abbreviation, add both abbreviation and full name
        if (upperState.length === 2 && stateAbbrevToName[upperState]) {
            searchTerms.push(upperState); // Add abbreviation (e.g., "CA")
            searchTerms.push(stateAbbrevToName[upperState]); // Add full name (e.g., "California")
        } else {
            // If it's not a 2-letter abbreviation, treat as full name
            searchTerms.push(state); // Add as-is
            // Also add title case version
            searchTerms.push(state.charAt(0).toUpperCase() + state.slice(1).toLowerCase());
        }
        
        console.log('🏛️ Searching for licenses with state terms:', searchTerms);
        
        // Use case-insensitive regex search for any of the search terms
        // Handle both new records (with status) and legacy records (with isActive only)
        const licenses = await License.find({ 
            state: { $in: searchTerms.map(term => new RegExp(`^${term}$`, 'i')) },
            $or: [
                { status: 'approved' }, // New records with explicit approval status
                { 
                    $and: [
                        { isActive: true }, // Legacy records that are active
                        { status: { $exists: false } } // And don't have status field set
                    ]
                }
            ]
        })
        .populate('assignedTo', 'firstName lastName primaryEmail primaryPhone position location employeeID profilePicture')
        .sort({ expiresDate: 1 });

        // Group licenses by user to avoid duplicates
        const talentMap = new Map();
        
        licenses.forEach(license => {
            // Cast the populated license to avoid TypeScript issues
            const populatedLicense = license as any;
            const user = populatedLicense.assignedTo;
            if (!user?._id) return;
            
            const userId = String((user as any)._id);
            
            if (!talentMap.has(userId)) {
                talentMap.set(userId, {
                    id: userId,
                    name: `${user.firstName} ${user.lastName}`,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.primaryEmail,
                    phone: user.primaryPhone,
                    position: user.position,
                    location: user.location,
                    employeeID: user.employeeID,
                    profilePicture: user.profilePicture,
                    licenses: []
                });
            }
            
            talentMap.get(userId).licenses.push({
                id: license._id,
                name: license.name,
                type: license.type,
                licenseNumber: license.licenseNumber,
                state: license.state,
                issuedDate: license.issuedDate,
                expiresDate: license.expiresDate,
                status: license.status
            });
        });

        const talent = Array.from(talentMap.values());
        
        console.log('🏛️ Found', talent.length, 'talent records for state:', searchTerms.join(' | '));
        console.log('🏛️ Talent summary:', talent.map(t => ({ name: t.name, licenseCount: t.licenses.length })));
        
        // Return the full state name for display if we have it
        const displayStateName = stateAbbrevToName[upperState] || state;
        
        res.json({ 
            talent, 
            count: talent.length,
            state: displayStateName 
        });
    } catch (error) {
        console.error('❌ Error fetching licenses by state:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/licenses/search-talent - Search talent by name
licensesRouter.get('/search-talent', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const { q } = req.query;
        console.log('🔍 Admin searching talent:', q, 'User:', req.user?.email);
        
        if (!q || typeof q !== 'string' || q.trim().length < 2) {
            console.log('🔍 Search query too short or invalid:', q);
            return res.json({ talent: [], count: 0 });
        }

        const searchTerm = q.trim();
        
        // Search users by name using text index
        const users = await User.find({
            $text: { $search: searchTerm },
            status: 'active'
        })
        .select('firstName lastName primaryEmail primaryPhone position location employeeID profilePicture')
        .limit(50);

        if (users.length === 0) {
            return res.json({ talent: [], count: 0 });
        }

        const userIds = users.map(user => user._id);
        
        // Get all approved licenses for these users
        const licenses = await License.find({
            assignedTo: { $in: userIds },
            status: 'approved'
        }).sort({ expiresDate: 1 });

        // Group licenses by user
        const talentMap = new Map();
        
        users.forEach(user => {
            const userId = String(user._id);
            talentMap.set(userId, {
                id: userId,
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.primaryEmail,
                phone: user.primaryPhone,
                position: user.position,
                location: user.location,
                employeeID: user.employeeID,
                profilePicture: user.profilePicture,
                licenses: []
            });
        });

        licenses.forEach(license => {
            const userId = license.assignedTo.toString();
            if (talentMap.has(userId)) {
                talentMap.get(userId).licenses.push({
                    id: license._id,
                    name: license.name,
                    type: license.type,
                    licenseNumber: license.licenseNumber,
                    state: license.state,
                    issuedDate: license.issuedDate,
                    expiresDate: license.expiresDate,
                    status: license.status
                });
            }
        });

        const talent = Array.from(talentMap.values());
        
        console.log('🔍 Search found', talent.length, 'talent records for term:', searchTerm);
        console.log('🔍 Search results summary:', talent.map(t => ({ name: t.name, licenseCount: t.licenses.length })));
        
        res.json({ 
            talent, 
            count: talent.length,
            searchTerm 
        });
    } catch (error) {
        console.error('❌ Error searching talent:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default licensesRouter; 