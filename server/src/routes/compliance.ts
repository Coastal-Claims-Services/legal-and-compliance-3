import express from 'express';
import ComplianceRule from '../models/ComplianceRule';
import ComplianceTemplate from '../models/ComplianceTemplate';
import ComplianceAlert from '../models/ComplianceAlert';
import ComplianceState from '../models/ComplianceState';
import ComplianceChatHistory from '../models/ComplianceChatHistory';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// ============================================
// STATES ROUTES
// ============================================

// Get all states
router.get('/states', authenticateToken, async (req: any, res: any) => {
  try {
    const states = await ComplianceState.find().sort({ stateName: 1 });
    res.json(states);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single state
router.get('/states/:stateCode', authenticateToken, async (req: any, res: any) => {
  try {
    const state = await ComplianceState.findOne({ stateCode: req.params.stateCode.toUpperCase() });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json(state);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============================================
// RULES ROUTES
// ============================================

// Get all rules
router.get('/rules', authenticateToken, async (req: any, res: any) => {
  try {
    const { state, silo, confidence } = req.query;
    const filter: any = {};

    if (state) filter.state = state;
    if (silo) filter.silo = silo;
    if (confidence) filter.confidence = confidence;

    const rules = await ComplianceRule.find(filter).sort({ createdAt: -1 });
    res.json(rules);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get rules by state and silo
router.get('/states/:stateCode/silo/:siloId', authenticateToken, async (req: any, res: any) => {
  try {
    const { stateCode, siloId } = req.params;
    const rules = await ComplianceRule.find({
      state: stateCode.toUpperCase(),
      silo: siloId
    });
    res.json(rules);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new rule
router.post('/rules', authenticateToken, async (req: any, res: any) => {
  try {
    const rule = new ComplianceRule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (error: any) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// Update rule
router.put('/rules/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const rule = await ComplianceRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    res.json(rule);
  } catch (error: any) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

// Delete rule
router.delete('/rules/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const rule = await ComplianceRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    res.json({ message: 'Rule deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============================================
// TEMPLATES ROUTES
// ============================================

// Get all templates
router.get('/templates', authenticateToken, async (req: any, res: any) => {
  try {
    const templates = await ComplianceTemplate.find().sort({ category: 1 });
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create template
router.post('/templates', authenticateToken, async (req: any, res: any) => {
  try {
    const template = new ComplianceTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error: any) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// ============================================
// ALERTS ROUTES
// ============================================

// Get alerts
router.get('/alerts', authenticateToken, async (req: any, res: any) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const alerts = await ComplianceAlert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update alert status
router.put('/alerts/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const alert = await ComplianceAlert.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error: any) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

// ============================================
// CHAT ROUTES
// ============================================

// Create chat session
router.post('/chat', authenticateToken, async (req: any, res: any) => {
  try {
    const { state, silo, question, response } = req.body;
    const userId = (req as any).user.userId;

    const chat = new ComplianceChatHistory({
      userId,
      state,
      silo,
      question,
      response,
      relatedRules: []
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating chat', error: error.message });
  }
});

// Get chat history
router.get('/chat/history', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = (req as any).user.userId;
    const history = await ComplianceChatHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============================================
// STATS ROUTES
// ============================================

// Get compliance stats
router.get('/stats', authenticateToken, async (req: any, res: any) => {
  try {
    const totalRules = await ComplianceRule.countDocuments();
    const highConfidence = await ComplianceRule.countDocuments({ confidence: 'HIGH' });
    const totalStates = await ComplianceState.countDocuments();
    const pendingAlerts = await ComplianceAlert.countDocuments({ status: 'pending' });

    res.json({
      totalRules,
      highConfidence,
      totalStates,
      pendingAlerts
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
 
