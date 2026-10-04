const SavedPost = require('../models/SavedPost');
const Collection = require('../models/Collection');

// @desc Get saved posts & collections for current user
// @route GET /api/saved
const getSavedContent = async (req, res) => {
  try {
    const savedItems = await SavedPost.find({ user: req.user._id })
      .populate({
        path: 'post',
        populate: { path: 'author', select: 'name username avatar' }
      })
      .populate({
        path: 'reel',
        populate: { path: 'author', select: 'name username avatar' }
      })
      .sort({ createdAt: -1 });

    const collections = await Collection.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({ savedItems, collections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new collection
// @route POST /api/saved/collections
const createCollection = async (req, res) => {
  try {
    const { name, coverImage } = req.body;
    if (!name) return res.status(400).json({ message: 'Collection name required' });

    const collection = await Collection.create({
      user: req.user._id,
      name,
      coverImage: coverImage || ''
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete collection
// @route DELETE /api/saved/collections/:id
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SavedPost.deleteMany({ user: req.user._id, collectionName: collection.name });
    await Collection.deleteOne({ _id: collection._id });

    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSavedContent, createCollection, deleteCollection };
