require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const urlArray = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  console.log(req.body);
  let hostname = req.body.url.split("//")[1];
  hostname = hostname.split('/')[0];
  console.log(hostname);
  dns.lookup(hostname, (error, address, family) => {
    if (error) {
      console.log("Invalid url")
      res.json({ error: 'invalid url' });
    } else {
      if (!address) {
        res.json({ error: 'invalid url' });
      } else {
        console.log(`Ip is ${address} and version is ${family}`);
        if (urlArray.indexOf(req.body.url) == -1) {
          urlArray.push(req.body.url);
        }
        res.json({ original_url: req.body.url, short_url: urlArray.indexOf(req.body.url) })

      }
    }
  })

})

app.get('/api/shorturl/:urlId', (req,resp) => {
  let urlId = req.params.urlId;
  console.log(urlId);
  if(urlArray.length > urlId) {
    resp.redirect(urlArray[urlId]);
  }else 
  {
    resp.json({ error: 'invalid url' });
  }
})


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
