//src/routes/api/get-dataBy-Id

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug(`The Owner id, id: ${req.user}, ${req.params.id}`);
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const fragmentData = await fragment.getData();
    logger.debug('fragmentdata: ' + fragmentData);
    res.set('Content-Type', fragment.type);
    res.status(200).send(fragmentData);
  } catch (error) {
    logger.warn(error.message, 'Error:No fragment found with this id');
    res
      .status(404)
      .json(createErrorResponse(404, 'request not completed due to wrong fragment id'));
  }
};
