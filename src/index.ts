import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Backend API!' });
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the data.' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title }
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the data.' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
  
    try {
      const updatedTask = await prisma.task.update({
        where: { 
          id: Number(id)
        },
        data: { 
          title, 
          completed 
        }
      });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the data.' });
    }
  });

app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.task.delete({
        where: { 
          id: Number(id) 
        }
      });
      res.json({ message: 'Data deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the data.' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});