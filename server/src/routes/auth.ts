import express from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import { emailService } from '../utils/emailService';

const router = express.Router();

// Register new user (initial signup - just name, email, phone, password)
router.post('/signup', async (req: any, res: any) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ error: 'Name, email, password, and phone number are required' });
        }

        // Split name into first and last
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || firstName;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { primaryEmail: email.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with minimal data
        const newUser = new User({
            firstName,
            lastName,
            primaryEmail: email.toLowerCase(),
            email: email.toLowerCase(), // Initially use personal email as login email
            primaryPhone: phoneNumber,
            password: hashedPassword,
            role: 'staff',
            status: 'pending_review',
            onboardingStatus: 'signup',
            timeZone: 'America/New_York',
            homeAddress: {
                street: '',
                city: '',
                state: '',
                country: 'United States',
                zipCode: ''
            },
            mailingAddress: {
                street: '',
                city: '',
                state: '',
                country: 'United States',
                zipCode: ''
            },
            emergencyContact: {
                name: '',
                relationship: '',
                phone: '',
                email: ''
            },
            socialMedia: {
                linkedin: '',
                twitter: '',
                facebook: ''
            },
            departments: [],
            profile: {}
        });

        await newUser.save();

        // Generate JWT token
        const jwtSecret: string = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
        const expiresInSeconds = process.env.JWT_EXPIRES_IN_SECONDS ? parseInt(process.env.JWT_EXPIRES_IN_SECONDS, 10) : 604800;
        const signOptions: SignOptions = {
            expiresIn: expiresInSeconds,
        };
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.primaryEmail, role: newUser.role },
            jwtSecret,
            signOptions
        );

        // Return user data without password
        const userResponse = {
            id: newUser._id,
            name: `${newUser.firstName} ${newUser.lastName}`,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.primaryEmail,
            primaryEmail: newUser.primaryEmail,
            phone: newUser.primaryPhone,
            primaryPhone: newUser.primaryPhone,
            role: newUser.role,
            status: newUser.status,
            onboardingStatus: newUser.onboardingStatus
        };

        res.status(201).json({
            user: userResponse,
            token,
            message: 'Account created successfully! Please complete your onboarding.'
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Complete onboarding (called when user submits onboarding form)
router.post('/complete-onboarding', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const { 
            profilePicture,
            homeAddress,
            mailingAddress,
            emergencyContact,
            socialMedia,
            bio,
            experiences = [],
            licenses = [],
            bonds = []
        } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.onboardingStatus !== 'signup' && user.onboardingStatus !== 'onboarding') {
            return res.status(400).json({ error: 'Onboarding already completed' });
        }

        // Update user with onboarding data
        user.profilePicture = profilePicture || user.profilePicture;
        user.homeAddress = { ...user.homeAddress, ...homeAddress };
        user.mailingAddress = { ...user.mailingAddress, ...mailingAddress };
        user.emergencyContact = { ...user.emergencyContact, ...emergencyContact };
        user.socialMedia = { ...user.socialMedia, ...socialMedia };
        user.profile = { bio: bio || '' };
        user.onboardingStatus = 'completed';

        await user.save();

        // Handle experiences, licenses, bonds if provided
        if (experiences.length > 0) {
            // Create experiences (they will be in pending status)
            const Experience = require('../models/Experience').default;
            for (const exp of experiences) {
                await Experience.create({
                    ...exp,
                    userId: user._id,
                    status: 'pending'
                });
            }
        }

        if (licenses.length > 0) {
            // Create licenses (they will be in pending status)
            const License = require('../models/License').default;
            for (const lic of licenses) {
                await License.create({
                    ...lic,
                    userId: user._id,
                    status: 'pending'
                });
            }
        }

        if (bonds.length > 0) {
            // Create bonds (they will be in pending status)
            const Bond = require('../models/Bond').default;
            for (const bond of bonds) {
                await Bond.create({
                    ...bond,
                    userId: user._id,
                    status: 'pending'
                });
            }
        }

        const userResponse = {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmail,
            primaryEmail: user.primaryEmail,
            phone: user.primaryPhone,
            role: user.role,
            status: user.status,
            onboardingStatus: user.onboardingStatus
        };

        res.json({
            user: userResponse,
            message: 'Onboarding completed successfully! Your application is now under review.'
        });
    } catch (error) {
        console.error('Complete onboarding error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin route to get pending users
router.get('/pending-users', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const pendingUsers = await User.find({ 
            onboardingStatus: 'completed',
            status: 'pending_review' 
        })
        .populate('experiences')
        .populate('licenses') 
        .populate('bonds')
        .select('-password')
        .sort({ createdAt: -1 });

        res.json({ pendingUsers });
    } catch (error) {
        console.error('Get pending users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin route to approve user
router.post('/approve-user/:userId', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const { userId } = req.params;
        const { 
            workEmail, 
            position, 
            hireDate, 
            manager, 
            departments,
            employeeID,
            location
        } = req.body;

        if (!workEmail || !position || !hireDate || !employeeID) {
            return res.status(400).json({ error: 'Work email, position, hire date, and employee ID are required' });
        }

        // Check if work email already exists
        const existingWorkEmail = await User.findOne({ 
            workEmail: workEmail.toLowerCase(),
            _id: { $ne: userId }
        });
        if (existingWorkEmail) {
            return res.status(400).json({ error: 'Work email already exists' });
        }

        // Check if employee ID already exists
        const existingEmployeeID = await User.findOne({ 
            employeeID,
            _id: { $ne: userId }
        });
        if (existingEmployeeID) {
            return res.status(400).json({ error: 'Employee ID already exists' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.onboardingStatus !== 'completed') {
            return res.status(400).json({ error: 'User has not completed onboarding' });
        }

        // Update user with admin-provided data
        user.workEmail = workEmail.toLowerCase();
        user.email = workEmail.toLowerCase(); // Update login email to work email
        user.position = position;
        user.hireDate = new Date(hireDate);
        user.employeeID = employeeID;
        user.location = location;
        user.manager = manager || undefined;
        user.departments = departments || [];
        user.status = 'active';
        user.onboardingStatus = 'approved';

        await user.save();

        // Approve all associated experiences, licenses, and bonds
        const Experience = require('../models/Experience').default;
        const License = require('../models/License').default;
        const Bond = require('../models/Bond').default;

        await Experience.updateMany(
            { userId: user._id, status: 'pending' },
            { status: 'approved' }
        );

        await License.updateMany(
            { userId: user._id, status: 'pending' },
            { status: 'approved' }
        );

        await Bond.updateMany(
            { userId: user._id, status: 'pending' },
            { status: 'approved' }
        );

        res.json({ 
            message: 'User approved successfully',
            user: {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.workEmail,
                status: user.status,
                onboardingStatus: user.onboardingStatus
            }
        });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin-created user (existing functionality)
router.post('/admin-create-user', async (req: any, res: any) => {
    authenticateToken(req, res, async () => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        try {
            const { 
                firstName, 
                lastName, 
                primaryEmail, 
                workEmail,
                primaryPhone, 
                workPhone,
                password, 
                position,
                location,
                timeZone,
                hireDate,
                employeeID,
                homeAddress,
                mailingAddress,
                emergencyContact,
                socialMedia,
                role 
            } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ primaryEmail: primaryEmail.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            // Check if employee ID already exists
            const existingEmployeeID = await User.findOne({ employeeID });
            if (existingEmployeeID) {
                return res.status(400).json({ error: 'Employee ID already exists' });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user with comprehensive data
            const newUser = new User({
                firstName,
                lastName,
                primaryEmail: primaryEmail.toLowerCase(),
                workEmail: workEmail?.toLowerCase(),
                email: workEmail?.toLowerCase() || primaryEmail.toLowerCase(),
                primaryPhone,
                workPhone,
                password: hashedPassword,
                position,
                location,
                timeZone: timeZone || 'America/New_York',
                hireDate: hireDate || new Date(),
                employeeID,
                homeAddress: {
                    street: homeAddress?.street || '',
                    city: homeAddress?.city || '',
                    state: homeAddress?.state || '',
                    country: homeAddress?.country || 'United States',
                    zipCode: homeAddress?.zipCode || ''
                },
                mailingAddress: {
                    street: mailingAddress?.street || homeAddress?.street || '',
                    city: mailingAddress?.city || homeAddress?.city || '',
                    state: mailingAddress?.state || homeAddress?.state || '',
                    country: mailingAddress?.country || homeAddress?.country || 'United States',
                    zipCode: mailingAddress?.zipCode || homeAddress?.zipCode || ''
                },
                emergencyContact: {
                    name: emergencyContact?.name || '',
                    relationship: emergencyContact?.relationship || '',
                    phone: emergencyContact?.phone || '',
                    email: emergencyContact?.email || ''
                },
                socialMedia: {
                    linkedin: socialMedia?.linkedin || '',
                    twitter: socialMedia?.twitter || '',
                    facebook: socialMedia?.facebook || ''
                },
                role: role || 'staff',
                status: 'active',
                onboardingStatus: 'approved'
            });

            await newUser.save();

            // Generate JWT token
            const jwtSecret: string = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
            const expiresInSeconds = process.env.JWT_EXPIRES_IN_SECONDS ? parseInt(process.env.JWT_EXPIRES_IN_SECONDS, 10) : 604800;
            const signOptions: SignOptions = {
                expiresIn: expiresInSeconds,
            };
            const token = jwt.sign(
                { userId: newUser._id, email: newUser.primaryEmail, role: newUser.role },
                jwtSecret,
                signOptions
            );

            // Return user data without password
            const userResponse = {
                id: newUser._id,
                name: `${newUser.firstName} ${newUser.lastName}`,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.primaryEmail,
                primaryEmail: newUser.primaryEmail,
                workEmail: newUser.workEmail,
                phone: newUser.primaryPhone,
                primaryPhone: newUser.primaryPhone,
                workPhone: newUser.workPhone,
                role: newUser.role,
                status: newUser.status,
                position: newUser.position,
                location: newUser.location,
                employeeID: newUser.employeeID
            };

            res.status(201).json({
                user: userResponse,
                token,
                message: 'User created successfully'
            });
        } catch (error) {
            console.error('Admin create user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// Admin route to reject user
router.post('/reject-user/:userId', authenticateToken, requireAdmin, async (req: AuthRequest, res: any) => {
    try {
        const { userId } = req.params;
        const { rejectionReason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.status = 'rejected';
        user.rejectionReason = rejectionReason || 'No reason provided';
        await user.save();

        res.json({ message: 'User has been rejected' });
    } catch (error) {
        console.error('Reject user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by either work or primary email
        const user = await User.findOne({
            $or: [
                { workEmail: email.toLowerCase() },
                { primaryEmail: email.toLowerCase() }
            ]
        }).select('+password');
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check user status
        // if (user.status === 'pending_review' && user.onboardingStatus === 'completed') {
        //     return res.status(403).json({ 
        //         error: 'Your account is pending review. Please wait for an administrator to approve your application.' 
        //     });
        // }
        if (user.status === 'inactive') {
            return res.status(403).json({ 
                error: 'Your account is inactive. Please contact an administrator.' 
            });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ 
                error: `Your application has been rejected. Reason: ${user.rejectionReason || 'Not specified'}` 
            });
        }
        
        // Populate necessary fields
        await user.populate('departments licenses bonds');

        // Generate JWT token
        const jwtSecret: string = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
        const expiresInSeconds = process.env.JWT_EXPIRES_IN_SECONDS ? parseInt(process.env.JWT_EXPIRES_IN_SECONDS, 10) : 604800;
        const signOptions: SignOptions = {
            expiresIn: expiresInSeconds,
        };
        const token = jwt.sign(
            { userId: user._id, email: user.workEmail || user.primaryEmail, role: user.role },
            jwtSecret,
            signOptions
        );

        res.json({
            user,
            token,
            expiresIn: expiresInSeconds
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile
router.get('/profile', async (req: any, res: any, next: any) => {
    authenticateToken(req, res, async () => {
        if (!req.user) {
            return;
        }
        try {
            const user = await User.findById(req.user._id)
                .populate('departments')
                .populate('licenses')
                .populate('bonds')
                .populate('manager', 'firstName lastName primaryEmail position')
                .populate('experiences')
                .select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found after auth' });
            }
            
            // Determine access level based on onboarding status
            let accessLevel = 'full';
            if (user.onboardingStatus === 'signup') {
                accessLevel = 'onboarding';
            } else if (user.onboardingStatus === 'completed' && user.status === 'pending_review') {
                accessLevel = 'pending';
            }
            
            // Format user response with all fields
            const userResponse = {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.primaryEmail,
                primaryEmail: user.primaryEmail,
                workEmail: user.workEmail,
                phone: user.primaryPhone,
                primaryPhone: user.primaryPhone,
                workPhone: user.workPhone,
                role: user.role,
                status: user.status,
                onboardingStatus: user.onboardingStatus,
                position: user.position,
                location: user.location,
                timeZone: user.timeZone,
                hireDate: user.hireDate,
                employeeID: user.employeeID,
                profilePicture: user.profilePicture,
                homeAddress: user.homeAddress,
                mailingAddress: user.mailingAddress,
                emergencyContact: user.emergencyContact,
                socialMedia: user.socialMedia,
                departments: user.departments,
                manager: user.manager,
                profile: user.profile,
                experiences: (user as any).experiences,
                licenses: user.licenses,
                bonds: user.bonds,
                accessLevel
            };
            
            res.json({ user: userResponse });
        } catch (error) {
            console.error('Profile error after auth:', error);
            res.status(500).json({ error: 'Internal server error in profile' });
        }
    });
});

// Logout (can be handled client-side by deleting token, but a server route is good practice)
router.post('/logout', (req: any, res: any) => {
    res.json({ message: 'Logout successful' });
});

// Change Password
router.post('/change-password', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }

        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Hash new password
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req: any, res: any) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ 
             $or: [
                { workEmail: email.toLowerCase() },
                { primaryEmail: email.toLowerCase() }
            ]
        });

        if (!user) {
            // Still return success to prevent user enumeration
            return res.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        // Generate a temporary reset token
        const resetToken = jwt.sign(
            { userId: user._id, email: user.workEmail || user.primaryEmail },
            process.env.JWT_RESET_SECRET || 'your_reset_secret',
            { expiresIn: '1h' }
        );

        try {
            // Send password reset email
            const userName = `${user.firstName} ${user.lastName}`;
            const userEmail = user.workEmail || user.primaryEmail;
            
            await emailService.sendPasswordResetEmail(userEmail, resetToken, userName);
            
            console.log(`Password reset email sent to: ${userEmail}`);
            
            res.json({ 
                message: 'If a user with that email exists, a password reset link has been sent.',
                success: true
            });
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            // Still return success to prevent user enumeration, but log the error
            res.json({ 
                message: 'If a user with that email exists, a password reset link has been sent.',
                success: true
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset Password
router.post('/reset-password', async (req: any, res: any) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        // Verify the reset token
        const decoded: any = jwt.verify(token, process.env.JWT_RESET_SECRET || 'your_reset_secret');

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ error: 'Invalid token or user does not exist' });
        }

        // Hash new password
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        if (error && typeof error === 'object' && 'name' in error) {
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                return res.status(400).json({ error: 'Invalid or expired password reset token' });
            }
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify JWT Token (e.g., on app load)
router.get('/verify-token', authenticateToken, async (req: AuthRequest, res: any) => {
    // If authenticateToken middleware passes, the token is valid.
    // We send back the user object which now includes populated fields from the middleware.
    res.json({
        user: req.user,
        message: 'Token is valid'
    });
});

export default router; 