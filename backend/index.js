const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const SECRET = "supersecretkey";

app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

/////////// MongoDB connection with Mongoose ///////////
async function connectDB() {
  try {
    await mongoose.connect(
      'mongodb+srv://daniaszumski:Shumadan10@tablica.wawdlxx.mongodb.net/tablica?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Połączono z MongoDB!");
  } catch (err) {
    console.error("Błąd połączenia:", err);
  }
}
connectDB();

/////////// MODELE ///////////
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true, unique: true }, // kod grupy
  createdAt: { type: Date, default: Date.now }
});
const Group = mongoose.model('Group', groupSchema);

const membershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
});
const Membership = mongoose.model('Membership', membershipSchema);

/////////// FUNKCJA GENERUJĄCA KOD GRUPY ///////////
async function generateUniqueGroupCode() {
  while (true) {
    const code = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const exists = await Group.findOne({ code });
    if (!exists) return code;
    // jeśli kod już istnieje — losujemy ponownie
  }
}

/////////// ROUTES ///////////
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/create_group', authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ message: 'Name and description are required' });

  try {
    const code = await generateUniqueGroupCode();
    const group = new Group({ name, description, code });
    await group.save();

    const membership = new Membership({ user: req.user.id, group: group._id, role: 'admin' });
    await membership.save();

    res.status(201).json({ 
      message: 'Group created successfully', 
      group, 
      membership 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/join_group', authenticateToken, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: 'Group code is required' });

  try {
    // const group = await Group.findOne({ code });
    const codeNormalized = code.toUpperCase().trim();
    const group = await Group.findOne({ code: codeNormalized });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    const alreadyMember = await Membership.findOne({ user: req.user.id, group: group._id });
    if (alreadyMember) return res.status(400).json({ message: 'You are already a member of this group' });

    const membership = new Membership({ user: req.user.id, group: group._id, role: 'member' });
    await membership.save();

    res.status(200).json({ message: 'Joined group successfully', group, membership });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/my_groups', authenticateToken, async (req, res) => {
  try {
    const memberships = await Membership.find({ user: req.user.id }).populate('group');
    res.json(memberships.map(m => m.group));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));
