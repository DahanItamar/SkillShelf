// Reads request headers for locale only. No privacy signal is read here.
export function headers(req, res, next) {
  req.locale = req.headers['accept-language'];
  next();
}
