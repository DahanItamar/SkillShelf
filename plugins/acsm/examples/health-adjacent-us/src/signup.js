export function signup(req, db) {
  db.insert('users', { email: req.body.email, conditions: req.body.conditions, lat: req.body.lat, lng: req.body.lng, acceptedPolicy: true });
}
