const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
app.use(express.json());
dotenv.config();

// Connecting to mongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB:', error));


// Define the Todo schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);




//API for adding new Todo.

app.get('/',(req,res)=>{
  res.send("Server Working");
})

app.post('/api/todos', async (req, res) => {
    try {
      const { title, description } = req.body;
      const todo = new Todo({
        title,
        description,
        completed: false,
      });
      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create a todo' });
    }
  });


//API to get all Todo at once


app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);                                //Sending Todo in response as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});




//API to get Single Todo


app.get('/api/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await Todo.findById(id);                     //finding the Todo based on ID
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Given Todo does not exists' });
    }
  });




//API for Updating particular Todo item

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, {                                    //finding updating the Todo based on ID
      title,
      description,
      completed,
    }, { new: true });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the todo' });
  }
});


//API for deleting the Todo item

app.delete('/api/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTodo = await Todo.findByIdAndDelete(id);             //finding and deleting the Todo based on ID
      if (!deletedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the todo' });
    }
  });

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
