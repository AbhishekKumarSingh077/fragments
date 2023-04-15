const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.info('It is here');
    if (fragment.type === req.get('Content-Type')) {
      logger.info('Type is working');
      await fragment.setData(req.body);
      logger.info('Data is being set!');
      res.status(200).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } else {
      logger.info('Error Found');
      res
        .status(400)
        .json(createErrorResponse(400, 'The fragment type cannot be changed after it is created.'));
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
