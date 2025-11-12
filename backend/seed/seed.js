const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/Product');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@autosphere.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1234567890',
      address: {
        street: '123 Admin St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    });

    // Create Vendors
    const vendor1 = await User.create({
      name: 'John Vendor',
      email: 'vendor1@autosphere.com',
      password: 'Vendor@123',
      role: 'vendor',
      phone: '+1234567891',
      address: {
        street: '456 Vendor Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
      },
    });

    const vendor2 = await User.create({
      name: 'Sarah Seller',
      email: 'vendor2@autosphere.com',
      password: 'Vendor@123',
      role: 'vendor',
      phone: '+1234567892',
      address: {
        street: '789 Market St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      },
    });

    // Create Customers
    const customer1 = await User.create({
      name: 'Alice Customer',
      email: 'customer1@autosphere.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '+1234567893',
      address: {
        street: '321 Buyer Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'USA',
      },
    });

    const customer2 = await User.create({
      name: 'Bob Buyer',
      email: 'customer2@autosphere.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '+1234567894',
      address: {
        street: '654 Consumer Ln',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'USA',
      },
    });

    console.log('✅ Created users');

    // Create Sample Products
    const products = [
      {
        name: 'Premium Carbon Fiber Spoiler',
        description:
          'High-quality carbon fiber spoiler with sleek aerodynamic design. Universal fit for most sedans and coupes.',
        price: 299.99,
        category: 'Spoilers',
        stock: 15,
        vendor: vendor1._id,
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: '18" Chrome Racing Rims (Set of 4)',
        description:
          'Premium chrome-plated racing rims, 18-inch diameter. Lightweight alloy construction for enhanced performance.',
        price: 899.99,
        category: 'Rims & Wheels',
        stock: 10,
        vendor: vendor1._id,
        images: ['https://images.unsplash.com/photo-1513267048331-5611cad62e41?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: 'LED Underglow Light Kit - RGB',
        description:
          'Waterproof RGB LED underglow kit with wireless remote control. 16 million color options and multiple light modes.',
        price: 149.99,
        category: 'LED Lights',
        stock: 30,
        vendor: vendor2._id,
        images: ['https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: 'Matte Black Hood with Air Vents',
        description:
          'Lightweight carbon fiber hood with functional air vents. Reduces engine heat and adds aggressive styling.',
        price: 749.99,
        category: 'Hoods',
        stock: 8,
        vendor: vendor1._id,
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: 'Full Body Kit - Sport Package',
        description:
          'Complete aerodynamic body kit including front/rear bumpers, side skirts, and diffuser. Premium ABS plastic construction.',
        price: 1299.99,
        category: 'Body Kits',
        stock: 5,
        vendor: vendor2._id,
        images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: 'Matte Red Chrome Vehicle Wrap',
        description:
          'Professional-grade vinyl wrap, matte red chrome finish. Full car coverage (60ft x 5ft roll).',
        price: 599.99,
        category: 'Body Wraps / Skins',
        stock: 20,
        vendor: vendor1._id,
        images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: 'Performance Titanium Exhaust System',
        description:
          'Cat-back titanium exhaust system with dual tips. Increases horsepower and delivers deep, aggressive sound.',
        price: 1499.99,
        category: 'Exhaust Systems',
        stock: 12,
        vendor: vendor2._id,
        images: ['https://images.unsplash.com/photo-1486006920555-c77dcf18193b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: 'Racing Seat Covers - Alcantara',
        description:
          'Premium Alcantara racing-style seat covers with red stitching. Universal fit for bucket and sport seats.',
        price: 249.99,
        category: 'Interior Accessories',
        stock: 25,
        vendor: vendor1._id,
        images: ['https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1449130015084-2fe954b75e5f?w=400&h=300&fit=crop'],
        isApproved: true,
        approvalStatus: 'Approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
      },
      {
        name: 'LED Halo Headlights - Angel Eyes',
        description:
          'Premium LED halo headlights with angel eye design. Bright white illumination with customizable RGB halo rings.',
        price: 449.99,
        category: 'LED Lights',
        stock: 18,
        vendor: vendor2._id,
        images: ['https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400&h=300&fit=crop'],
        isApproved: false,
        approvalStatus: 'Pending',
      },
      {
        name: '20" Forged Alloy Wheels - Black Edition',
        description:
          'Lightweight forged alloy wheels in matte black finish. 20-inch diameter, perfect for SUVs and trucks.',
        price: 1899.99,
        category: 'Rims & Wheels',
        stock: 6,
        vendor: vendor1._id,
        images: ['https://images.unsplash.com/photo-1513267048331-5611cad62e41?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=400&h=300&fit=crop'],
        isApproved: false,
        approvalStatus: 'Pending',
      },
    ];

    await Product.insertMany(products);
    console.log('✅ Created sample products');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📧 Test Accounts:');
    console.log('─────────────────────────────────────');
    console.log('Admin:');
    console.log('  Email: admin@autosphere.com');
    console.log('  Password: Admin@123\n');
    console.log('Vendors:');
    console.log('  Email: vendor1@autosphere.com | Password: Vendor@123');
    console.log('  Email: vendor2@autosphere.com | Password: Vendor@123\n');
    console.log('Customers:');
    console.log('  Email: customer1@autosphere.com | Password: Customer@123');
    console.log('  Email: customer2@autosphere.com | Password: Customer@123');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => seedData());