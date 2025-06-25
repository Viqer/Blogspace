const bcryptjs = require('bcryptjs');

const encryptAdminPassword = async (req, res, next) => {
  try {
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error encrypting password' });
  }
};

const encryptUserPassword = async (req, res, next) => {
  try {
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error encrypting password' });
  }
};

module.exports = { encryptAdminPassword, encryptUserPassword };