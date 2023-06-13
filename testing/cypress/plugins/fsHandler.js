const fs = require('fs');

module.exports = {
  readFile(filePath) {
    try{
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content
      }
      return '[]';
    }catch(err){
      return err;
    }
  },

  writeFile(filePath, content) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
};