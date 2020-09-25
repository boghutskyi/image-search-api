"use strict";

const express = require("express");
let app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Bing = require("node-bing-api")( {accKey: "3cdee4f96a0e49ab887068fe329e30db"} );
const searchTerm = require("./models/searchTerm")

app.use(bodyParser.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/searchTerms")

app.get("/api/recentsearchs", (req, res, next) => {
  searchTerm.find({}, (err, data) => {
    res.json(data);
  } )
})

app.get("/api/imagesearch/:searchVal*", (req, res, next) => {
  let { searchVal } = req.params;
  let { offset } = req.query;

  let data = new searchTerm({
    searchVal,
    searchDate: new Date()
  });

  data.save(err => {
    if (err) {
      res.send("Error Saving to database")
    }
  })
  let searchOffset;
  if (offset) {
    if (offset == 1) {
      offset = 0;
      searchOffset = 1;
    } else if (offset > 1) {
      searchOffset = offset + 1;
    }
  }
  Bing.images(searchVal, {
    top: (10 * searchOffset),
    skip: (10 * offset)
  }, (error, rez, body) => {
    let bingData = [];
    
    for(let i = 0; i < 10; i++) {
      bingData.push({
        url: body.value[i].webSearchUrl,
        snippet: body.value[i].name,
        thumbnail: body.value[i].thumbnailUrl,
        context: body.value[i].hostPageDisplayUrl
      });
    }
    res.json(bingData);
  });
  
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`)
  })