const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch(err) {
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__V');

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err);
    }
  },
  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err);
    }
  },
  // Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { new: true }
      );
      
      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err);
    }
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.status(200).json({ message: 'User and associated thoughts deleted' });
    } catch(err) {
      res.status(500).json(err);
    }
  },
  // Add a new friend to user's friend list
  async addUserFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body } },
        { new: true }
      );

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err);
    }
  },
  // Remove a friend from a user's friend list
  async removeUserFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { _id: req.params.userId } } },
        { new: true }
      );

      if(!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.status(200).json(user);
    } catch(err) {
      res.status(500).json(err);
    }
  }
};