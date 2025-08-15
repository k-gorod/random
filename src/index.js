const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;
const FILE_PATH = path.join(__dirname, 'data.txt');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.post('/add', (req, res) => {
    const { string } = req.query;
    if (!string) {
        return res.status(400).send('String is required.');
    }
    
    fs.appendFile(FILE_PATH, string + '\n', (err) => {
        if (err) {
            return res.status(500).send('Error writing to file.');
        }
        res.send('String added to file.');
    });
});

app.get('/list', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }
        const lines = data.split('\n').filter(line => line)

        res.send(lines);
    });
});



app.get('/admin/delete', async (req, res) => {
  const { title } = req.query;

  if (!title) {
      return res.status(400).send('String is required.');
  }

  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).send('Error reading file.');
      }

      const lines = data.split('\n').filter(line => line);
      const newLines = lines.filter(line => line !== title);

      if (lines.length === newLines.length) {
          return res.status(404).send('String not found.');
      }

      fs.writeFile(FILE_PATH, newLines.join('\n'), (err) => {
          if (err) {
              return res.status(500).send('Error writing to file.');
          }
          res.send('Line removed successfully.');
      });
  });

})

app.get('/admin/clear', async (req, res) => {
  fs.writeFile(FILE_PATH, '', (error) => {
    if(error) {
      res.send(`Error: ${error}`);
    }

    res.send('Success');
  });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});