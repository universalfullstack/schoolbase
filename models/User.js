import mongoose from 'mongoose';

// Base user schema
const baseUserSchema = {
  firstName: { type: String, trim: true, required: true },
  middleName: { type: String, trim: true, required: false },
  lastName: { type: String, trim: true, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Suspended', 'Exited'], default: 'Active' },
  profileImage: { type: String, default: null }
};

// Authentication fields
const authUserSchema = {
  phone: { type: String, set: value => value.replace(/\s+/g, ''), required: true },  // removes all whitespace
  email: { type: String, trim: true, lowercase: true, required: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  lastLoggedInAt: { type: Date, default: null },
  loginEnabled: { type: Boolean, default: true }
};

// -------------------- Super Admin --------------------
const superAdminSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  role: { type: String, default: 'Super Admin', immutable: true }
}, { timestamps: true });

// Unique indexes globally
superAdminSchema.index({ email: 1 }, { unique: true });
superAdminSchema.index({ phone: 1 }, { unique: true });

// -------------------- School Admin --------------------
const schoolAdminSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  schools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
  role: { type: String, default: 'School Admin', immutable: true }
}, { timestamps: true });

// Unique indexes globally
schoolAdminSchema.index({ email: 1 }, { unique: true });
schoolAdminSchema.index({ phone: 1 }, { unique: true });

// -------------------- Staff --------------------
const staffSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null }, // NEW: optional section
  role: { type: String, default: 'Staff', immutable: true },
  staffRoles: { type: [String], enum: ['Super Admin', 'Principal', 'Teacher', 'Cashier'], default: ['Teacher'], required: true }
}, { timestamps: true });

// Unique email/phone per school
staffSchema.index({ school: 1, email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } } });
staffSchema.index({ school: 1, phone: 1 }, { unique: true, partialFilterExpression: { phone: { $exists: true } } });

// -------------------- Guardian --------------------
const guardianSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  role: { type: String, default: 'Guardian', immutable: true },
  wards: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    relationship: { type: String, enum: ['Father', 'Mother', 'Uncle', 'Aunt', 'Brother', 'Sister', 'Cousin', 'Sponsor'], required: true }
  }]
}, { timestamps: true });

// Unique email/phone per school
guardianSchema.index({ school: 1, email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } } });
guardianSchema.index({ school: 1, phone: 1 }, { unique: true, partialFilterExpression: { phone: { $exists: true } } });

// -------------------- Student --------------------
const studentSchema = new mongoose.Schema({
  ...baseUserSchema,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  currentSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true }, // NEW: current section
  role: { type: String, default: 'Student', immutable: true },
  guardians: [{
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian', required: true },
    relationship: { type: String, enum: ['Father','Mother','Uncle','Aunt','Brother','Sister','Cousin','Sponsor'], required: true }
  }],
  currentAcademicSession: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicSession" },
  currentTerm: { type: mongoose.Schema.Types.ObjectId, ref: "Term" },
  currentClassLevel: { type: mongoose.Schema.Types.ObjectId, ref: "ClassLevel" },
  currentClassArm: { type: mongoose.Schema.Types.ObjectId, ref: "ClassArm" }
}, { timestamps: true });

// Unique email/phone per school
studentSchema.index({ school: 1, email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } } });
studentSchema.index({ school: 1, phone: 1 }, { unique: true, partialFilterExpression: { phone: { $exists: true } } });

// -------------------- Export Models --------------------
export const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
export const SchoolAdmin = mongoose.model('SchoolAdmin', schoolAdminSchema);
export const Staff = mongoose.model('Staff', staffSchema);
export const Guardian = mongoose.model('Guardian', guardianSchema);
export const Student = mongoose.model('Student', studentSchema);
