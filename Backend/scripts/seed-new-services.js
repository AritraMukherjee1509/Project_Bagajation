const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Service = require('../src/models/Service');
const Provider = require('../src/models/Provider');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const newServicesData = [
  // 1. AC Services
  {
    name: 'P.C.B Borad Repair & Replacement',
    description: 'Expert installation, repair, and maintenance for all types of Air Conditioners including Split, Window, Cassette, Ductile, Tower, Floor stand, and VRF systems. Our certified technicians ensure optimal performance and longevity.',
    category: 'AC Services', // OK: This category exists in the schema
    pricing: { basePrice: 1600, currency: 'INR', priceType: 'variable', note: 'Price varies by AC type and service required.' },
    duration: { estimated: '2-4 hours', unit: 'hours' },
    features: ['Supports all AC types', 'Certified technicians', 'Installation & Repair', 'Gas refilling', 'Annual Maintenance Contracts (AMC) available'],
    images: [{ url: 'https://cdn.dotpe.in/longtail/store-items/7396470/m2mA0htT.webp', alt: 'Air conditioner unit being serviced' }],
    serviceArea: { cities: ['Kolkata', 'Howrah', 'South 24 Parganas'], radius: 40 },
    status: 'active',
    featured: true
  },
  {
    name: 'Water Cooler Repair',
    description: 'Professional repair services for all types of water coolers including direct cool and storage type models. Our skilled technicians diagnose and fix issues efficiently to ensure your water cooler functions optimally.',
    category: 'Appliances', // OK: This category exists in the schema
    pricing: { basePrice: 399, currency: 'INR', priceType: 'variable', note: 'Price varies by AC type and service required.' },
    duration: { estimated: '2-4 hours', unit: 'hours' },
    features: ['Supports all AC types', 'Certified technicians', 'Installation & Repair', 'Gas refilling', 'Annual Maintenance Contracts (AMC) available'],
    images: [{ url: 'https://5.imimg.com/data5/SELLER/Default/2024/6/427818496/KC/NF/UW/224016099/water-cooler-maintenance-service-500x500.jpg', alt: 'Air conditioner unit being serviced' }],
    serviceArea: { cities: ['Kolkata', 'Howrah', 'South 24 Parganas'], radius: 40 },
    status: 'active',
    featured: true
  },
  {
    name: 'Microwave Repair',
    description: 'Expert repair and maintenance for all microwave oven types (solo, grill, convection, and built-in). We diagnose heating issues, door/hinge problems, control panel faults, and replace components like magnetrons, capacitors, diodes, and door switches with genuine parts.',
    category: 'Appliances', // OK: This category exists in the schema
    pricing: { basePrice: 399, currency: 'INR', priceType: 'variable', note: 'Price varies by AC type and service required.' },
    duration: { estimated: '2-4 hours', unit: 'hours' },
    features: ['Supports all AC types', 'Certified technicians', 'Installation & Repair', 'Gas refilling', 'Annual Maintenance Contracts (AMC) available'],
    images: [{ url: 'https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_400,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1744364251339-ec8fdc.jpeg', alt: 'Air conditioner unit being serviced' }],
    serviceArea: { cities: ['Kolkata', 'Howrah', 'South 24 Parganas'], radius: 40 },
    status: 'active',
    featured: true
  },
  {
    name: 'Refrigerator Repair',
    description: 'Comprehensive repair services for all refrigerator types including single door, double door, side-by-side, and French door models. Our experienced technicians handle cooling issues, compressor problems, thermostat malfunctions, and more to restore your refrigerator\'s performance.',
    category: 'Appliances', // OK: This category exists in the schema
    pricing: { basePrice: 399, currency: 'INR', priceType: 'variable', note: 'Price varies by AC type and service required.' },
    duration: { estimated: '2-4 hours', unit: 'hours' },
    features: ['Supports all AC types', 'Certified technicians', 'Installation & Repair', 'Gas refilling', 'Annual Maintenance Contracts (AMC) available'],
    images: [{ url: 'https://www.dialhome.in/assets/img/Triple-Door-Fridge-Repair-Services.jpg', alt: 'Air conditioner unit being serviced' }],
    serviceArea: { cities: ['Kolkata', 'Howrah', 'South 24 Parganas'], radius: 40 },
    status: 'active',
    featured: true
  },
];


const seedNewServices = async () => {
  console.log('🌱 Starting to seed new services...');

  try {
    const provider = await Provider.findOne({ status: 'active' });

    if (!provider) {
      console.error('❌ No active provider found. Please seed providers first.');
      console.log('💡 Run `npm run seed` to create sample providers.');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`ℹ️  Assigning new services to provider: ${provider.name} (${provider.email})`);

    for (const serviceData of newServicesData) {
      const existingService = await Service.findOne({
        name: serviceData.name,
        provider: provider._id,
      });

      if (!existingService) {
        await Service.create({
          ...serviceData,
          provider: provider._id,
        });
        console.log(`✅ New service created: ${serviceData.name}`);
      } else {
        console.log(`ℹ️  Service already exists, skipping: ${serviceData.name}`);
      }
    }

    console.log('🎉 New services seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding new services:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

connectDB().then(() => {
  seedNewServices();
});