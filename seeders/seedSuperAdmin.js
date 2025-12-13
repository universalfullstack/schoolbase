// seedSuperAdminInteractive.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import DotenvFlow from 'dotenv-flow';
import inquirer from 'inquirer';
import { SuperAdmin } from '../models/User.js'

DotenvFlow.config();
import connectDB from '../config/db.js';


async function seedSuperAdmin() {
  try {
    // Connect to MongoDB
    connectDB();
    
    // Prompt for Super Admin details
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'First Name:',
        validate: input => input ? true : 'First Name is required'
      },
      {
        type: 'input',
        name: 'middleName',
        message: 'Middle Name (optional):'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Last Name:',
        validate: input => input ? true : 'Last Name is required'
      },
      {
        type: 'list',
        name: 'gender',
        message: 'Gender:',
        choices: ['Male', 'Female']
      },
      {
        type: 'input',
        name: 'email',
        message: 'Email:',
        validate: input => /\S+@\S+\.\S+/.test(input) ? true : 'Enter a valid email'
      },
      {
        type: 'input',
        name: 'phone',
        message: 'Phone:',
        validate: input => input ? true : 'Phone is required'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
        mask: '*',
        validate: input => input.length >= 6 ? true : 'Password must be at least 6 characters'
      },
      {
        type: 'input',
        name: 'address',
        message: 'Address (optional):'
      }
    ]);

    // Check if Super Admin already exists
    const existingAdmin = await SuperAdmin.findOne({ email: answers.email });
    if (existingAdmin) {
      console.log(`⚠ Super Admin with email ${answers.email} already exists.`);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(answers.password, salt);

    // Create Super Admin
    const superAdmin = new SuperAdmin({
      ...answers,
      password: hashedPassword
    });

    await superAdmin.save();
    console.log(`✅ Super Admin created successfully: ${superAdmin.email}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating Super Admin:', err);
    process.exit(1);
  }
}

seedSuperAdmin();
