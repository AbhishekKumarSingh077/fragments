// src/routes/api/get-dataBy-Id.js

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const mime = require('mime-types');
const logger = require('../../logger');
module.exports = async (req, res) => {
  var id = req.params.id;
  var extension = mime.lookup(id);
  if (req.params.id.includes('.')) {
    id = req.params.id.split('.').slice(0, -1).join('.');
  }
  try {
    logger.info('It start here');
    const fragment = await Fragment.byId(req.user, id);
    logger.info('After getting fragment');
    var fragmentData = await fragment.getData();
    var type;
    try {
      if (fragment.formats.includes(extension)) {
        logger.info(extension);
        type = extension;
      } else if (extension == false) {
        logger.info('NO EXTENSION');

        type = fragment.mimeType;
      }
      var data = fragment.convertDataType(fragmentData, type);
      res.setHeader('Content-type', type);
      logger.info('Stage just before sending data');
      res.status(200).send(data);
    } catch (error) {
      res.status(415).json(createErrorResponse(415, 'The requested format is not supported'));
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
