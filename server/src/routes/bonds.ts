import express from 'express';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import Bond from '../models/Bond';

const bondsRouter = express.Router();

// GET /api/bonds/my - Get all bonds for the authenticated user
bondsRouter.get('/my', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const bonds = await Bond.find({ assignedTo: req.user._id }).sort({ expiresDate: 1 });
        res.json({ bonds });
    } catch (error) {
        console.error('Error fetching bonds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/bonds - Create a new bond
bondsRouter.post('/', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const { name, bondNumber, state, amount, issuedDate, expiresDate, assignedTo, documentUrl } = req.body;
        
        // Determine who the bond is for
        const targetUserId = assignedTo || req.user._id;
        
        // Set status based on who is creating and for whom
        let status;
        if (req.user.role === 'admin') {
            // Admin creating bond - approved by default
            status = 'approved';
        } else if (targetUserId.toString() === req.user._id.toString()) {
            // User creating bond for themselves - pending approval
            status = 'pending';
        } else {
            // User trying to create bond for someone else - not allowed
            return res.status(403).json({ error: 'Cannot create bonds for other users' });
        }
        
        const newBond = new Bond({
            assignedTo: targetUserId,
            createdBy: req.user._id,
            name,
            bondNumber,
            state,
            amount,
            issuedDate,
            expiresDate,
            status,
            submittedAt: new Date(),
            documentUrl
        });
        await newBond.save();
        res.status(201).json({ bond: newBond, message: 'Bond submitted for approval.' });
    } catch (error) {
        console.error('Error creating bond:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/bonds/:id - Update bond
bondsRouter.put('/:id', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const bond = await Bond.findById(req.params.id);
        
        if (!bond) {
            return res.status(404).json({ error: 'Bond not found' });
        }
        
        // Users can only update their own bonds unless they are admin
        if (bond.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const { name, bondNumber, state, amount, issuedDate, expiresDate, documentUrl } = req.body;
        
        // Update bond fields
        if (name) bond.name = name;
        if (bondNumber) bond.bondNumber = bondNumber;
        if (state) bond.state = state;
        if (amount) bond.amount = amount;
        if (issuedDate) bond.issuedDate = issuedDate;
        if (expiresDate) bond.expiresDate = expiresDate;
        if (documentUrl !== undefined) bond.documentUrl = documentUrl;
        
        await bond.save();
        
        res.json({
            bond,
            message: 'Bond updated successfully'
        });
    } catch (error) {
        console.error('Error updating bond:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/bonds/:id - Delete bond
bondsRouter.delete('/:id', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const bond = await Bond.findById(req.params.id);
        
        if (!bond) {
            return res.status(404).json({ error: 'Bond not found' });
        }
        
        // Users can only delete their own bonds unless they are admin
        if (bond.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        await Bond.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Bond deleted successfully' });
    } catch (error) {
        console.error('Error deleting bond:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/bonds/:id/approve - Approve bond (admin only)
bondsRouter.put('/:id/approve', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const bond = await Bond.findById(req.params.id);
        
        if (!bond) {
            return res.status(404).json({ error: 'Bond not found' });
        }
        
        bond.status = 'approved';
        bond.reviewedAt = new Date();
        bond.reviewedBy = req.user._id;
        
        await bond.save();
        
        res.json({
            bond,
            message: 'Bond approved successfully'
        });
    } catch (error) {
        console.error('Error approving bond:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/bonds/:id/reject - Reject bond (admin only)
bondsRouter.put('/:id/reject', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const bond = await Bond.findById(req.params.id);
        
        if (!bond) {
            return res.status(404).json({ error: 'Bond not found' });
        }
        
        const { reviewNotes } = req.body || {};
        
        bond.status = 'rejected';
        bond.reviewedAt = new Date();
        bond.reviewedBy = req.user._id;
        if (reviewNotes) bond.reviewNotes = reviewNotes;
        
        await bond.save();
        
        res.json({
            bond,
            message: 'Bond rejected successfully'
        });
    } catch (error) {
        console.error('Error rejecting bond:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default bondsRouter; 