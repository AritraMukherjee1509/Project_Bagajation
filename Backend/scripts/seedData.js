const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Admin = require('../src/models/Admin');
const Provider = require('../src/models/Provider');
const Service = require('../src/models/Service');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!existingAdmin) {
      const admin = await Admin.create({
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'super_admin',
        status: 'active',
        personalInfo: {
          department: 'Administration',
          employeeId: 'ADM001'
        }
      });
      
      console.log('✅ Super Admin created:', admin.email);
    } else {
      console.log('ℹ️  Super Admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

const seedSampleData = async () => {
  try {
    // Create sample users
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        password: 'password123',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+919876543211',
        password: 'password123',
        address: {
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        isVerified: true,
        status: 'active'
      }
    ];

    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Sample user created: ${userData.email}`);
      }
    }

    // Create sample providers
    const sampleProviders = [
      {
        name: 'Subhajit Dey',
        email: 'subhajit@example.com',
        phone: '+919876543220',
        password: 'password123',
        businessInfo: {
          businessName: 'Cool Air Services',
          businessType: 'individual'
        },
        specializations: ['AC Installation', 'AC Repair', 'AC Maintenance'],
                experience: {
          years: 5,
          description: 'Experienced AC technician with 5+ years in the field'
        },
        serviceArea: {
          cities: ['Kolkata', 'Howrah'],
          radius: 25,
          coordinates: {
            type: 'Point',
            coordinates: [88.3639, 22.5726] // Kolkata coordinates
          }
        },
        verification: {
          status: 'verified',
          verifiedAt: new Date()
        },
        status: 'active'
      },
      {
        name: 'Ravi Kumar',
        email: 'ravi@example.com',
        phone: '+919876543221',
        password: 'password123',
        businessInfo: {
          businessName: 'ElectroFix Solutions',
          businessType: 'individual'
        },
        specializations: ['Electrical Repair', 'Wiring', 'Electrical Installation'],
        experience: {
          years: 7,
          description: 'Licensed electrician with extensive experience'
        },
        serviceArea: {
          cities: ['Mumbai', 'Pune'],
          radius: 30,
          coordinates: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // Mumbai coordinates
          }
        },
        verification: {
          status: 'verified',
          verifiedAt: new Date()
        },
        status: 'active'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+919876543222',
        password: 'password123',
        businessInfo: {
          businessName: 'PlumbPro Services',
          businessType: 'individual'
        },
        specializations: ['Plumbing Repair', 'Pipe Installation', 'Bathroom Fitting'],
        experience: {
          years: 4,
          description: 'Professional plumber specializing in residential services'
        },
        serviceArea: {
          cities: ['Delhi', 'Gurgaon'],
          radius: 20,
          coordinates: {
            type: 'Point',
            coordinates: [77.1025, 28.7041] // Delhi coordinates
          }
        },
        verification: {
          status: 'verified',
          verifiedAt: new Date()
        },
        status: 'active'
      }
    ];

    for (const providerData of sampleProviders) {
      const existingProvider = await Provider.findOne({ email: providerData.email });
      if (!existingProvider) {
        await Provider.create(providerData);
        console.log(`✅ Sample provider created: ${providerData.email}`);
      }
    }

    console.log('✅ Sample data seeding completed');
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
  }
};

const seedServices = async () => {
  try {
    // Get providers
    const providers = await Provider.find({ status: 'active' });
    
    if (providers.length === 0) {
      console.log('⚠️  No providers found. Skipping service seeding.');
      return;
    }

    const sampleServices = [
      {
        name: 'Professional AC Installation Service',
        description: 'Complete AC installation service with warranty. Our certified technicians ensure proper installation for optimal performance and energy efficiency.',
        category: 'AC Services',
        pricing: {
          basePrice: 1050,
          currency: 'INR',
          priceType: 'fixed'
        },
        duration: {
          estimated: '2-3 hours',
          unit: 'hours'
        },
        features: [
          'Professional installation',
          'Quality testing',
          '1 year warranty',
          'Free consultation'
        ],
        inclusions: [
          'Installation charges',
          'Basic accessories',
          'Testing and commissioning'
        ],
        exclusions: [
          'AC unit cost',
          'Additional electrical work',
          'Structural modifications'
        ],
        provider: providers[0]._id,
        serviceArea: {
          cities: ['Kolkata', 'Howrah'],
          radius: 25
        },
        availability: {
          isAvailable: true
        },
        status: 'active',
        featured: true
      },
      {
        name: 'Electrical Wiring and Repair Service',
        description: 'Complete electrical solutions for homes and offices. Licensed electricians providing safe and reliable electrical services.',
        category: 'Electrical',
        pricing: {
          basePrice: 850,
          currency: 'INR',
          priceType: 'hourly'
        },
        duration: {
          estimated: '1-4 hours',
          unit: 'hours'
        },
        features: [
          'Licensed electrician',
          'Safety certified',
          'Quality materials',
          'Emergency service'
        ],
        inclusions: [
          'Labor charges',
          'Basic materials',
          'Safety inspection'
        ],
        exclusions: [
          'Premium materials',
          'Major rewiring',
          'Electrical appliances'
        ],
        provider: providers[1]._id,
        serviceArea: {
          cities: ['Mumbai', 'Pune'],
          radius: 30
        },
        availability: {
          isAvailable: true
        },
        status: 'active',
        popular: true
      },
      {
        name: 'Plumbing Repair and Maintenance',
        description: 'Expert plumbing services for all your water and drainage needs. Quick response and reliable solutions.',
        category: 'Plumbing',
        pricing: {
          basePrice: 750,
          currency: 'INR',
          priceType: 'fixed'
        },
        duration: {
          estimated: '1-2 hours',
          unit: 'hours'
        },
        features: [
          'Quick response',
          'Quality parts',
          'Clean work',
          '24/7 emergency'
        ],
        inclusions: [
          'Service charges',
          'Basic fittings',
          'Leak testing'
        ],
        exclusions: [
          'Premium fittings',
          'Major pipe replacement',
          'Bathroom renovation'
        ],
        provider: providers[2]._id,
        serviceArea: {
          cities: ['Delhi', 'Gurgaon'],
          radius: 20
        },
        availability: {
          isAvailable: true
        },
        status: 'active'
      },
      {
        name: 'Home Deep Cleaning Service',
        description: 'Comprehensive home cleaning service with eco-friendly products. Professional cleaners for a spotless home.',
        category: 'Cleaning',
        pricing: {
          basePrice: 1200,
          currency: 'INR',
          priceType: 'fixed'
        },
        duration: {
          estimated: '3-5 hours',
          unit: 'hours'
        },
        features: [
          'Eco-friendly products',
          'Trained professionals',
          'Insured service',
          'Satisfaction guarantee'
        ],
        inclusions: [
          'All cleaning supplies',
          'Deep cleaning',
          'Sanitization'
        ],
        exclusions: [
          'Carpet cleaning',
          'Window exterior',
          'Heavy furniture moving'
        ],
        provider: providers[0]._id,
        serviceArea: {
          cities: ['Kolkata'],
          radius: 15
        },
        availability: {
          isAvailable: true
        },
        status: 'active',
        featured: true
      }
    ];

    for (const serviceData of sampleServices) {
      const existingService = await Service.findOne({ 
        name: serviceData.name,
        provider: serviceData.provider 
      });
      
      if (!existingService) {
        await Service.create(serviceData);
        console.log(`✅ Sample service created: ${serviceData.name}`);
      }
    }

    console.log('✅ Services seeding completed');
  } catch (error) {
    console.error('❌ Error seeding services:', error);
  }
};

const runSeeder = async () => {
  console.log('🌱 Starting database seeding...');
  
  await connectDB();
  
  await seedAdmin();
  await seedSampleData();
  await seedServices();
  
  console.log('🎉 Database seeding completed successfully!');
  process.exit(0);
};

// Run seeder if called directly
if (require.main === module) {
  runSeeder().catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { runSeeder };