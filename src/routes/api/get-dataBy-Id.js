//src/routes/api/get-dataBy-Id

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const fragmentData = await fragment.getData();
    res.set('Content-Type', fragment.type);
    res.status(200).send(fragmentData);
  } catch (error) {
    res
      .status(404)
      .json(createErrorResponse(404, 'request not completed due to wrong fragment id'));
  }
};
