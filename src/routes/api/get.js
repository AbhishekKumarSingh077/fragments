// src/routes/api/get.js

// src/routes/api/get.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragments = await fetchFragmentbyId(req.user, req.query?.expand);
    res.status(200).json(
      response.createSuccessResponse({
        status: 'ok',
        fragments: fragments,
      })
    );
  } catch (e) {
    res.status(400).json(
      response.createErrorResponse({
        message: `Error occurred during fetching of fragment by Id: ${e}`,
        code: 400,
      })
    );
  }
};

async function fetchFragmentbyId(user, expand) {
  const fragments = await Fragment.byUser(user, expand);
  return fragments;
}
