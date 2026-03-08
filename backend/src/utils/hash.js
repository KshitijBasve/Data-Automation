const crypto = require('crypto');

const hashRow = (row) => {
  const stable = Object.keys(row)
    .sort()
    .reduce((acc, key) => {
      acc[key] = row[key];
      return acc;
    }, {});

  return crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex');
};

module.exports = { hashRow };
