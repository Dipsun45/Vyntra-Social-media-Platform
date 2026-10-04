const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Admin = require('../models/Admin');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const Story = require('../models/Story');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Follow = require('../models/Follow');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Notification = require('../models/Notification');
const Hashtag = require('../models/Hashtag');
const Settings = require('../models/Settings');

const seedUsersData = [
  { name: 'Aarav Shah', username: 'aarav_shah', email: 'aarav@vyntra.com', bio: 'Tech enthusiast & UI architect 🚀', location: 'Mumbai, India', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', isVerified: true },
  { name: 'Riya Patel', username: 'riya_patel', email: 'riya@vyntra.com', bio: 'Visual artist | Exploring code & design ✨', location: 'Ahmedabad, India', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', isVerified: true },
  { name: 'Krish Mehta', username: 'krish_mehta', email: 'krish@vyntra.com', bio: 'Full-stack developer 💻 | Coffee enthusiast', location: 'Bengaluru, India', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Anaya Desai', username: 'anaya_desai', email: 'anaya@vyntra.com', bio: 'Travel enthusiast ✈️ | Photography lover', location: 'Goa, India', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', isVerified: true },
  { name: 'Vivaan Joshi', username: 'vivaan_joshi', email: 'vivaan@vyntra.com', bio: 'Building the future of social apps 🌐', location: 'Pune, India', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Diya Shah', username: 'diya_shah', email: 'diya@vyntra.com', bio: 'Digital creator & aesthetic lover 🎨', location: 'Delhi, India', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { name: 'Reyansh Patel', username: 'reyansh_patel', email: 'reyansh@vyntra.com', bio: 'Fitness junkie 🏋️‍♂️ | Healthy living', location: 'Surat, India', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Myra Mehta', username: 'myra_mehta', email: 'myra@vyntra.com', bio: 'Singer & music producer 🎵', location: 'Mumbai, India', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80', isVerified: true },
  { name: 'Arjun Desai', username: 'arjun_desai', email: 'arjun@vyntra.com', bio: 'Cybersecurity researcher 🛡️', location: 'Hyderabad, India', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { name: 'Kiara Shah', username: 'kiara_shah', email: 'kiara@vyntra.com', bio: 'Fashion blogger & trendsetter 💄', location: 'Mumbai, India', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Dev Patel', username: 'dev_patel', email: 'dev@vyntra.com', bio: 'Game developer 🎮 | Unity 3D & Unreal', location: 'Bengaluru, India', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80' },
  { name: 'Siya Joshi', username: 'siya_joshi', email: 'siya@vyntra.com', bio: 'Foodie & recipe creator 🍲', location: 'Kolkata, India', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { name: 'Rudra Mehta', username: 'rudra_mehta', email: 'rudra@vyntra.com', bio: 'Drone photographer 📷 Sky high perspective', location: 'Manali, India', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80' },
  { name: 'Avni Patel', username: 'avni_patel', email: 'avni@vyntra.com', bio: 'UX/UI designer 📐 Figma enthusiast', location: 'Chennai, India', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80' },
  { name: 'Kabir Shah', username: 'kabir_shah', email: 'kabir@vyntra.com', bio: 'Cricket fanatic 🏏 Sports lover', location: 'Chandigarh, India', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80' },
  { name: 'Anvi Desai', username: 'anvi_desai', email: 'anvi@vyntra.com', bio: 'Bookworm 📚 & creative writer', location: 'Jaipur, India', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
  { name: 'Yuvan Patel', username: 'yuvan_patel', email: 'yuvan@vyntra.com', bio: 'Startup founder 💡 AI & Machine Learning', location: 'Bengaluru, India', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Tara Mehta', username: 'tara_mehta', email: 'tara@vyntra.com', bio: 'Yoga instructor 🧘‍♀️ Mindful living', location: 'Rishikesh, India', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { name: 'Dhruv Shah', username: 'dhruv_shah', email: 'dhruv@vyntra.com', bio: 'Automobile lover 🏎️ Speed & gearhead', location: 'Delhi, India', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { name: 'Aisha Patel', username: 'aisha_patel', email: 'aisha@vyntra.com', bio: 'Architect & Interior designer 🏙️', location: 'Mumbai, India', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', isVerified: true }
];

const samplePosts = [
  { caption: 'Exploring the breathtaking peaks of Manali! Pure crisp air and endless views. 🏔️✨ #travel #nature #coding #mountains', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Building next generation web experiences with React, Node & Tailwind CSS! 💻🚀 #coding #technology #developer #vyntra', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Evening coffee setup with clean minimalist workspace vibes ☕📚 #coding #tech #minimalism', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Sunset hues over the coastline. Nature never fails to amaze. 🌅🌊 #travel #photography #beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Match day under the stadium floodlights! Electrifying atmosphere 🏏🔥 #cricket #sports #stadium', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Late night jam session in the studio! New tracks coming soon 🎵🎧 #music #studio #beats', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Modern minimalist architecture design in heart of Mumbai 🏙️📐 #architecture #design #city', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Fresh morning yoga flow to energize the soul 🧘‍♀️✨ #health #yoga #mindfulness', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Delicious home-made ramen bowl with garlic oil chili oil toppings 🍜🌶️ #foodie #cooking #ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80' },
  { caption: 'Tested out the new electric supercar on track today! 0-100 in 2.1s 🏎️⚡ #cars #speed #automobile', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80' }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vyntra_db';
    await mongoose.connect(mongoUri);
    console.log(`Seed script connected to MongoDB: ${mongoUri}`);

    // Clear existing collections
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Post.deleteMany({});
    await Reel.deleteMany({});
    await Story.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
    await Follow.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Group.deleteMany({});
    await GroupMember.deleteMany({});
    await Notification.deleteMany({});
    await Hashtag.deleteMany({});
    await Settings.deleteMany({});

    console.log('Cleared existing collections.');

    // Seed Admin default account
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPass = await bcrypt.hash('admin', salt);
    await Admin.create({
      email: 'admin@gmail.com',
      password: hashedAdminPass,
      name: 'Vyntra System Administrator',
      role: 'superadmin'
    });
    console.log('Seeded Admin account (admin@gmail.com / admin)');

    // Seed Settings
    await Settings.create({
      siteName: 'Vyntra',
      description: 'Connect. Create. Share.',
      maintenanceMode: false,
      registrationEnabled: true,
      commentSystemEnabled: true,
      adminEmail: 'admin@gmail.com'
    });

    // Seed 20 Users
    const hashedUserPass = await bcrypt.hash('password123', salt);
    const createdUsers = [];

    for (const u of seedUsersData) {
      const newUser = await User.create({
        ...u,
        password: hashedUserPass
      });
      createdUsers.push(newUser);
    }
    console.log(`Seeded ${createdUsers.length} demo users`);

    // Create follow connections
    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = 0; j < createdUsers.length; j++) {
        if (i !== j && (i + j) % 3 === 0) {
          await Follow.create({
            follower: createdUsers[i]._id,
            following: createdUsers[j]._id,
            status: 'accepted'
          });
          createdUsers[i].followingCount += 1;
          createdUsers[j].followersCount += 1;
        }
      }
      await createdUsers[i].save();
    }
    console.log('Seeded Follow connections');

    // Seed Posts
    const createdPosts = [];
    const hashtagsMap = new Map();

    for (let i = 0; i < 30; i++) {
      const author = createdUsers[i % createdUsers.length];
      const sample = samplePosts[i % samplePosts.length];
      const hashtags = sample.caption.match(/#[a-zA-Z0-9_]+/g)?.map(t => t.substring(1).toLowerCase()) || ['vyntra'];

      const post = await Post.create({
        author: author._id,
        images: [sample.image],
        caption: `${sample.caption} (Post #${i + 1})`,
        hashtags,
        location: author.location,
        likesCount: Math.floor(Math.random() * 85) + 12,
        commentsCount: Math.floor(Math.random() * 15) + 3,
        viewsCount: Math.floor(Math.random() * 400) + 100
      });

      author.postsCount += 1;
      await author.save();
      createdPosts.push(post);

      for (const tag of hashtags) {
        hashtagsMap.set(tag, (hashtagsMap.get(tag) || 0) + 1);
      }
    }
    console.log(`Seeded ${createdPosts.length} posts`);

    // Seed Hashtags
    for (const [tag, count] of hashtagsMap.entries()) {
      await Hashtag.create({ name: tag, postsCount: count, reelsCount: Math.floor(count / 2) });
    }

    // Seed Reels (15 Reels)
    const reelItems = [
      {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        music: 'Vyntra Synthwave Neon - Cyber Pulse'
      },
      {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        music: 'Lo-Fi Study Chill Beats - Aesthetic Mind'
      },
      {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        music: 'Energetic Trap Bass - Beatmaster X'
      },
      {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
        music: 'Sunset Acoustic Chill - Horizon Waves'
      },
      {
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        poster: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
        music: 'Summer Dance House - Tropical Vibes'
      }
    ];

    for (let i = 0; i < 15; i++) {
      const author = createdUsers[i % createdUsers.length];
      const item = reelItems[i % reelItems.length];
      await Reel.create({
        author: author._id,
        videoUrl: item.video,
        thumbnailUrl: item.poster,
        caption: `Amazing reel vibes ✨ Reel #${i + 1} #reels #vyntra #trending`,
        hashtags: ['reels', 'vyntra', 'trending'],
        music: item.music,
        likesCount: Math.floor(Math.random() * 120) + 20,
        commentsCount: Math.floor(Math.random() * 25) + 5,
        viewsCount: Math.floor(Math.random() * 1200) + 300
      });
    }
    console.log('Seeded 15 Reels');

    // Seed Stories (10 Active Stories)
    const storyImages = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
    ];

    for (let i = 0; i < 10; i++) {
      const author = createdUsers[i];
      await Story.create({
        author: author._id,
        mediaUrl: storyImages[i % storyImages.length],
        mediaType: 'image',
        textOverlay: `Chilling out today! ☀️`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    }
    console.log('Seeded 10 Active Stories');

    // Seed Comments for Posts
    for (let i = 0; i < 15; i++) {
      const post = createdPosts[i];
      const author = createdUsers[(i + 1) % createdUsers.length];
      await Comment.create({
        post: post._id,
        author: author._id,
        text: `Awesome shot! Love the colors and energy here 🔥`
      });
    }

    // Seed Conversations & Direct Messages
    const user1 = createdUsers[0];
    const user2 = createdUsers[1];

    const conv = await Conversation.create({
      type: 'direct',
      participants: [user1._id, user2._id]
    });

    const msg1 = await Message.create({
      conversation: conv._id,
      sender: user1._id,
      text: 'Hey Riya! Welcome to Vyntra. Loving the new interface 🚀'
    });

    const msg2 = await Message.create({
      conversation: conv._id,
      sender: user2._id,
      text: 'Hey Aarav! Thanks! The smooth glassmorphism design looks stunning.'
    });

    conv.lastMessage = msg2._id;
    await conv.save();

    // Seed Group Chat
    const group = await Group.create({
      name: 'Vyntra Tech & Creators 🌐',
      description: 'Official developer & designer community on Vyntra',
      creator: user1._id,
      admins: [user1._id],
      members: [user1._id, user2._id, createdUsers[2]._id, createdUsers[3]._id]
    });

    const groupConv = await Conversation.create({
      type: 'group',
      participants: [user1._id, user2._id, createdUsers[2]._id, createdUsers[3]._id],
      group: group._id
    });

    group.conversation = groupConv._id;
    await group.save();

    await Message.create({
      conversation: groupConv._id,
      sender: user1._id,
      text: 'Welcome everybody to the Vyntra Tech Creators group!'
    });

    console.log('Database Seeding Completed Successfully! All collections created.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
