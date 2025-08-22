const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;
const jwt = require('jsonwebtoken');

const SECRET = "supersecretkey";

// Middleware
app.use(cors());
app.use(express.json());

/////////// MongoDB connection with Mongoose ///////////
async function connectDB() {
  try {
    await mongoose.connect(
      'mongodb+srv://daniaszumski:Shumadan10@tablica.wawdlxx.mongodb.net/tablica?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Połączono z MongoDB!");
  } catch (err) {
    console.error("Błąd połączenia:", err);
  }
}

connectDB();

/////////// Mongoose model ///////////
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

/////////// Routes ///////////
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);


  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Sprawdzamy, czy użytkownik istnieje
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Tworzymy nowego użytkownika
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Generujemy token
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));
