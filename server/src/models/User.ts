import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    // Personal Information
    firstName: string;
    lastName: string;
    employeeID?: string;
    position?: string;
    location?: string;
    timeZone: string;
    hireDate?: Date;
    manager?: mongoose.Types.ObjectId;
    
    // Authentication & System
    email: string; // Login email (equals workEmail)
    password: string;
    role: 'admin' | 'manager' | 'user' | 'external_partner';
    status: 'active' | 'inactive' | 'pending_review' | 'rejected';
    rejectionReason?: string;
    onboardingStatus: 'signup' | 'onboarding' | 'completed' | 'approved';
    profilePicture?: string;
    
    // Personal Contact
    primaryEmail: string;
    workEmail?: string;
    primaryPhone: string;
    workPhone?: string;
    
    // Addresses
    homeAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode?: string;
    };
    mailingAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode?: string;
    };
    
    // Emergency Contact
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
        email: string;
    };
    
    // Social Media
    socialMedia: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
    
    // System Relations
    departments: mongoose.Types.ObjectId[];
    profile: {
        bio?: string;
    };
    licenses: mongoose.Types.ObjectId[];
    bonds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    // Personal Information
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    employeeID: {
        type: String,
        trim: true,
    },
    position: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    timeZone: {
        type: String,
        required: true,
        default: 'America/New_York'
    },
    hireDate: {
        type: Date
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
    // Authentication & System
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'user', 'external_partner'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending_review', 'rejected'],
        default: 'pending_review'
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    onboardingStatus: {
        type: String,
        enum: ['signup', 'onboarding', 'completed', 'approved'],
        default: 'signup'
    },
    profilePicture: {
        type: String,
        default: ''
    },
    
    // Personal Contact
    primaryEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    workEmail: {
        type: String,
        lowercase: true,
        trim: true
    },
    primaryPhone: {
        type: String,
        required: true,
        trim: true
    },
    workPhone: {
        type: String,
        trim: true
    },
    
    // Addresses
    homeAddress: {
        street: {
            type: String,
            trim: true,
            default: ''
        },
        city: {
            type: String,
            trim: true,
            default: ''
        },
        state: {
            type: String,
            trim: true,
            default: ''
        },
        country: {
            type: String,
            trim: true,
            default: 'United States'
        },
        zipCode: {
            type: String,
            trim: true,
            default: ''
        }
    },
    mailingAddress: {
        street: {
            type: String,
            trim: true,
            default: ''
        },
        city: {
            type: String,
            trim: true,
            default: ''
        },
        state: {
            type: String,
            trim: true,
            default: ''
        },
        country: {
            type: String,
            trim: true,
            default: 'United States'
        },
        zipCode: {
            type: String,
            trim: true,
            default: ''
        }
    },
    
    // Emergency Contact
    emergencyContact: {
        name: {
            type: String,
            trim: true,
            default: ''
        },
        relationship: {
            type: String,
            trim: true,
            default: ''
        },
        phone: {
            type: String,
            trim: true,
            default: ''
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: ''
        }
    },
    
    // Social Media
    socialMedia: {
        linkedin: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        },
        facebook: {
            type: String,
            trim: true
        }
    },
    
    // System Relations
    departments: [{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }],
    profile: {
        bio: String
    },
    licenses: [{
        type: Schema.Types.ObjectId,
        ref: 'License'
    }],
    bonds: [{
        type: Schema.Types.ObjectId,
        ref: 'Bond'
    }]
}, {
    timestamps: true
});

// Virtual field to populate experiences from Experience collection
userSchema.virtual('experiences', {
    ref: 'Experience',
    localField: '_id',
    foreignField: 'userId'
});

// Ensure virtual fields are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ primaryEmail: 1 });
userSchema.index({ employeeID: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ manager: 1 });
userSchema.index({ 'firstName': 'text', 'lastName': 'text' });

// This will ensure that a compound index is created for frequently queried fields
userSchema.index({ status: 1, onboardingStatus: 1 });
userSchema.index({ "departments": 1 });
userSchema.index(
    { employeeID: 1 }, 
    { unique: true, partialFilterExpression: { employeeID: { $type: 'string' } } }
);

export default mongoose.model<IUser>('User', userSchema); 