// src/routes/api/get.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
module.exports = (req, res) => {
  fetchFragmentbyId(req.user, req.query?.expand)
    .then((fragments) => {
      res.status(200).json(
        response.createSuccessResponse({
          status: 'ok',
          fragments: fragments,
        })
      );
    })
    .catch((e) => {
      res.status(400).json(
        response.createErrorResponse({
          message: `Error occured during fetching of fragment by Id: ${e}`,
          code: 400,
        })
      );
    });
};
async function fetchFragmentbyId(user, expand) {
  let fragments = await Fragment.byUser(user, expand);
  return fragments;
}
