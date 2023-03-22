// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
var md = require('markdown-it')();
const path = require('path');
module.exports = async (req, res) => {
  try {
    let id = req.params.id;
    if (req.params.id.includes('html')) {
      const ext = path.extname(req.params.id);
      id = req.params.id.replace(ext, '');
    }
    const fragment = await Fragment.byId(req.user, id);
    const fragmentData = await fragment.getData();
    if (req.params.id.includes('html') && fragment.type === 'text/markdown') {
      res.set('Content-Type', 'text/html');
      res.status(200).send(md.render(fragmentData.toString()));
    } else {
      res.set('Content-Type', fragment.type);
      res.status(200).send(fragmentData);
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
