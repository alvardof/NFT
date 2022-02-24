const Token721 = artifacts.require("Token721");

module.exports = function (deployer) {
  deployer.deploy(Token721);
};
