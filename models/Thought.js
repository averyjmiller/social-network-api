const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        if(date) return date.toISOString().split('T')[0];
      }
    }
  },
  {
    toJSON: {
      getters: true,
    },
    id: false
  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        if(date) return date.toISOString().split('T')[0];
      }
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function() {
    return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;