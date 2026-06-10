const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Hardcode MONGO_URI directly (temporary fix)
const MONGO_URI = 'mongodb+srv://sillahyusif22_db_user:y39UYOnEHYBuzmVy@cluster0.a9p8z43.mongodb.net/Edushare?appName=Cluster0';
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected!');

    const existingAdmin = await User.findOne({ 
      email: 'admin@edushare.com' 
    });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists!');
      console.log('📧 Email: admin@edushare.com');
      console.log('🔑 Password: Admin@2026');
      await mongoose.disconnect();
      process.exit();
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Admin@2026', salt);

    await User.create({
      name: 'EduShare Admin',
      email: 'admin@edushare.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('');
    console.log('✅ Admin created successfully!');
    console.log('📧 Email:    admin@edushare.com');
    console.log('🔑 Password: Admin@2026');
    console.log('👑 Role:     admin');
    console.log('');
    await mongoose.disconnect();
    process.exit();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();