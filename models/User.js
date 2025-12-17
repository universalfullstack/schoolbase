import mongoose from 'mongoose';

// Base user schema
const baseUserSchema = {
  firstName: { type: String, trim: true, required: true },
  middleName: { type: String, trim: true, required: false },
  lastName: { type: String, trim: true, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Pending', 'Suspended', 'Exited'], default: 'Pending' },
  profileImage: { type: String, default: null }
};

// Authentication fields
const authUserSchema = {
  phone: {
    type: String,
    set: value => value.replace(/\s+/g, ''),
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true
  },
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

// -------------------- School Admin --------------------
const schoolAdminSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  schools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
  role: { type: String, default: 'School Admin', immutable: true }
}, { timestamps: true });

// -------------------- Staff --------------------
const staffSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
  role: { type: String, default: 'Staff', immutable: true },
  staffRoles: {
    type: [String],
    enum: ['Super Admin', 'Principal', 'Teacher', 'Cashier'],
    default: ['Teacher'],
    required: true
  }
}, { timestamps: true });

// Global unique indexes
staffSchema.index({ email: 1 }, { unique: true });
staffSchema.index({ phone: 1 }, { unique: true });

// -------------------- Guardian --------------------
const guardianSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  role: { type: String, default: 'Guardian', immutable: true },
  wards: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    relationship: {
      type: String,
      enum: ['Father', 'Mother', 'Uncle', 'Aunt', 'Brother', 'Sister', 'Cousin', 'Sponsor'],
      required: true
    }
  }]
}, { timestamps: true });

// Global unique indexes
guardianSchema.index({ email: 1 }, { unique: true });
guardianSchema.index({ phone: 1 }, { unique: true });

// -------------------- Student --------------------
const studentSchema = new mongoose.Schema({
  ...baseUserSchema,
  ...authUserSchema,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  role: { type: String, default: 'Student', immutable: true },
  guardians: [{
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian', required: true },
    relationship: {
      type: String,
      enum: ['Father','Mother','Uncle','Aunt','Brother','Sister','Cousin','Sponsor'],
      required: true
    }
  }],
  currentClassLevel: { type: mongoose.Schema.Types.ObjectId, ref: "ClassLevel" },
  currentClassArm: { type: mongoose.Schema.Types.ObjectId, ref: "ClassArm" }
}, { timestamps: true });

// Global unique indexes
studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ phone: 1 }, { unique: true });

// -------------------- Export Models --------------------
export const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
export const SchoolAdmin = mongoose.model('SchoolAdmin', schoolAdminSchema);
export const Staff = mongoose.model('Staff', staffSchema);
export const Guardian = mongoose.model('Guardian', guardianSchema);
export const Student = mongoose.model('Student', studentSchema);