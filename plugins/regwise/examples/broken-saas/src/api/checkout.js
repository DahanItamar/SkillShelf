export function checkout(req, res) {
  const { cardNumber, cvv } = req.body;
  db.insert('payments', { cardNumber, cvv });
  res.send('ok');
}
