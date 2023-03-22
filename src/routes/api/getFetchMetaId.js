// src/routes/api/getFetchMetaId.js

module.exports = async function getFetchMetaId(req, res) {
  const { Fragment } = require('../../model/fragment');
  const { createErrorResponse, createSuccessResponse } = require('../../response');
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
