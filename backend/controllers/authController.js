const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { userId, password } = req.body; // Frontend still sends 'userId'

  console.log('\n----- Login Request Received -----');
  console.log(`Input Data: { userId: '${userId}', password: '${password ? '******' : '(none)'}' }`);

  try {
    // Search using the DB field 'user_id'
    const user = await User.findOne({ user_id: userId });

    if (user) {
        console.log(`> User found in DB: ${user.full_name} (${user.role})`);
    } else {
        console.log(`> User NOT found in DB for ID: ${userId}`);
    }

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      
      console.log('> Password verification: SUCCESS');
      console.log(`> Generated Token: ${token}`);
      console.log('----- Login Successful -----\n');
      
      res.json({
        _id: user._id,
        name: user.full_name, // Map DB 'full_name' to Frontend 'name'
        email: user.email,
        role: user.role,
        userId: user.user_id, // Map DB 'user_id' to Frontend 'userId'
        initials: user.initials,
        token: token,
      });
    } else {
      console.log('> Password verification: FAILED');
      console.log('----- Login Failed -----\n');
      res.status(401).json({ message: 'Invalid User ID or password' });
    }
  } catch (error) {
    console.error('----- Login Error -----');
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser };
