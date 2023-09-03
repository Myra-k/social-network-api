const { thought, User } = require('../models');

const thoughtsController = {

  get_all_thoughts(req, res) {
    Thought.find({})
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(error => {
        console.log(error);
        res.status(500).json(error);
      });
  },


  get_thought_by_id({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Error no thoughts found with chosen id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },


  add_thought({ body }, res) {
    Thought.create(body)
      .then(dbThoughtData => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then(db_user_data => {
        if (!db_user_data) {
          res.status(404).json({ message: 'Error no user with this id' });
          return;
        }
        res.json(db_user_data);
      })
      .catch(error => res.json(error));
  },

  update_thought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Error no thoughts found with chosen id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(error => res.status(400).json(error));
  },


  remove_thought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Error no thoughts found with chosen id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(error => res.status(400).json(error));
  },


  add_reaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Error no thoughts found with chosen id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(error => res.json(error));
  },


  remove_reaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Error no thoughts found with chosen id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(error => res.json(error));
  }
};

module.exports = thoughtsController;