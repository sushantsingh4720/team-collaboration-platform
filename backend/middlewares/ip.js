const ip = (req, res, next) => {
  req.ip_address = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  next();
};

module.exports = ip;
