const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

//const url = process.env.API_URL;

module.exports = async (req, res) => {
  logger.debug('Post: ' + req.body);
  if (!Fragment.isSupportedType(req.get('Content-Type'))) {
    return res.status(415).json(response.createErrorResponse(415, 'Unsupported Media Type'));
  }
  try {
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('content-type'),
    });
    await fragment.save();
    await fragment.setData(req.body);

    logger.debug('A New Fragment has been created: ' + JSON.stringify(fragment));
    res.set('Content-Type', fragment.type);
    res.setHeader('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);

    res.status(201).json(
      response.createSuccessResponse({
        status: 'ok',
        fragment: fragment,
      })
    );
  } catch (err) {
    res.status(500).json(response.createErrorResponse(500, err));
  }
};
