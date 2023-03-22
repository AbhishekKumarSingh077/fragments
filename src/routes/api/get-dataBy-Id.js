// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
var markdownMD = require('markdown-it')();
const path = require('path');
module.exports = async (req, res) => {
  try {
    let id = req.params.id;
    if (req.params.id.includes('html')) {
      const ext = path.extname(req.params.id);
      id = req.params.id.replace(ext, '');
    }
    const frag = await Fragment.byId(req.user, id);
    const fragData = await frag.getData();
    if (req.params.id.includes('html') && frag.type === 'text/markdown') {
      res.set('Content-Type', 'text/html');
      res.status(200).send(markdownMD.render(fragData.toString()));
    } else {
      res.set('Content-Type', frag.type);
      res.status(200).send(fragData);
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
