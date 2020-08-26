const monk = require("monk");

module.exports.getConnection = () => {
  return monk("localhost:27017/video-locadora");
};
