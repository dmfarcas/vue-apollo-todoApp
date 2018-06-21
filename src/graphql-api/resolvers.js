const GraphQLJSON = require('graphql-type-json')
const shortid = require('shortid')


module.exports = {
  JSON: GraphQLJSON,

  Counter: {
    countStr: counter => `Current count: ${counter.count}`,
  },


  Query: {
    // hello: (root, { name }) => `Hello ${name || 'World'}!`,
    // messages: (root, args, { db }) => db.get('messages').value(),
    todos: (root, args, { db }) => db.get('todos').value(),

  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = 'My mutation completed!'
      context.pubsub.publish('hey', { mySub: message })
      return message
    },
    messageAdd: (root, { input }, { pubsub, db }) => {
      const message = {
        id: shortid.generate(),
        text: input.text,
      }

      db
        .get('messages')
        .push(message)
        .last()
        .write()

      pubsub.publish('messages', { messageAdded: message })

      return message
    },

      addTodo: (root, { input: { content } }, { pubsub, db }) => {
          const todo = {
              id: shortid.generate(),
              content
          };

          db
              .get('todos')
              .push(todo)
              .last()
              .write()

          // pubsub.publish('todos', { messageAdded: message })

          return todo
      },

      todoDrag: (root, { input: { id, xAxis, yAxis } }, { pubsub, db }) => {
          // const todo = {
          //     id: shortid.generate(),
          //     content
          // };

          const todo = { id, coords: { xAxis, yAxis } };
          db
              .get('todos')
              .find({ id })
              .set('coords', { xAxis, yAxis })
              .write()

          console.log(id, xAxis, yAxis)
          // db
          //     .get('todos')
          //     .push(todo)
          //     .last()
          //     .write()

          pubsub.publish('todos', { todoDragging: todo })

          // return todo

          return
      }

      // singleUpload: (root, { file }, { processUpload }) => processUpload(file),
    // multipleUpload: (root, { files }, { processUpload }) => Promise.all(files.map(processUpload)),

  },

  Subscription: {
    mySub: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('hey'),
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).substring(2, 15) // random channel name
        let count = 0
        setInterval(() => pubsub.publish(
          channel,
          {
            // eslint-disable-next-line no-plusplus
            counter: { count: count++ },
          }
        ), 2000)
        return pubsub.asyncIterator(channel)
      },
    },

    messageAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('messages'),
    },

    todoDragging: {
        subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('todos'),
    },
  },
}
