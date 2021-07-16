const express = require('express');
const router = express.Router();
const config = require('config');
const dirTree = require("directory-tree");
const path = require('path');
const fs = require('fs'); // .promises;

const filesTotalSize = function (files) {
  if (Array.isArray(files)) {
    return files.reduce((a, b) => a + b.size, 0);
  } else {
    return files.size;
  }
}

const isSizeOk = function (files) {
  if (Array.isArray(files)) {
    let isOk = true;
    files.map((file) => {
      isOk &= file.size <= config.server.limits.fileSize;
    });
    return isOk;
  } else {
    return files.size <= config.server.limits.fileSize;
  }
}

router.post('/uploadfiles', function(req, res, next) {
  const home = path.normalize(
    path.join(__dirname,
        '..', config.server.repoDir, req.session.uuid)
  )
  .toString().replace(/\\/g, '/');

  if (!req.files) {
    res.status(400);
    res.send(JSON.stringify(
      {
        code: 400,
        msg: 'Bad Requested'
      }
    ));
    return;
  }

  if (!isSizeOk(req.files['files[]'])) {
    res.status(413);
    res.send(JSON.stringify(
      {
        code: 413,
        msg: 'Payload Too Large'
      }
    ));
    return;
  }

  // limit user's storage space
  const size = filesTotalSize(req.files['files[]']);
  const folderSize = dirTree(home, {normalizePath: true}).size;
  if (folderSize + size > config.server.limits.storageSpaceSize) {
    res.status(507);
    res.send(JSON.stringify(
      {
        code: 507,
        msg: 'Insufficient Storage'
      }
    ));
    return;
  }

  const uploadDir = path.normalize(
    path.join(home, req.body.directory.replace('~', ''))
  )
  .toString().replace(/\\/g, '/');

  try {
    try {
      fs.mkdirSync(uploadDir);
    } catch (e) {
      //
    }

    if (Array.isArray(req.files['files[]'])) {
      console.log(req.files['files[]']);
      req.files['files[]'].map((file) => {
        const fullPath = path.normalize(path.join(uploadDir, file.name));
        file.mv(fullPath);
      });
    } else {
        const file = req.files['files[]'];
        const fullPath = 
            path.normalize(path.join(uploadDir, file.name));
        file.mv(fullPath);
    }

    res.status(200);
    res.send(JSON.stringify(
      {
        code: 200,
        msg: 'success'
      }
    ));
    return;    
  } catch (err) {
    console.log(err);

    res.status(500);
    res.send(JSON.stringify(
      {
        code: 500,
        msg: 'Internal Server Error'
      }
    ));
    return;
  }
});

router.post('/mkdir', function(req, res, next) {
  console.log(req.body);

  const home = path.normalize(
    path.join(__dirname,
        '..', config.server.repoDir, req.session.uuid)
  )
  .toString().replace(/\\/g, '/');

  const fullPath = path.normalize(
    path.join(home, req.body.directory.replace('~', ''))
  )
  .toString().replace(/\\/g, '/');

  try {
    fs.mkdirSync(fullPath);

    res.status(200);
    res.send(JSON.stringify(
      {
        code: 200,
        msg: 'success'
      }
    ));
    return;    
  } catch (err) {
    console.log(err);

    if ('EEXIST' === err.code) {
      res.status(409);
      res.send(JSON.stringify(
        {
          code: 409,
          msg: 'Conflict'
        }
      ));
      return;
    }

    res.status(500);
    res.send(JSON.stringify(
      {
        code: 500,
        msg: 'Internal Server Error'
      }
    ));
    return;
  }
});

router.post('/mv', function(req, res, next) {
  const home = path.normalize(
    path.join(__dirname,
        '..', config.server.repoDir, req.session.uuid)
  )
  .toString().replace(/\\/g, '/');

  const oldFullPath = path.normalize(
    path.join(home, req.body.source.replace('~', ''))
  )
  .toString().replace(/\\/g, '/');

  const newFullPath = path.normalize(
    path.join(home, req.body.dest.replace('~', ''))
  )
  .toString().replace(/\\/g, '/');

  try {
    fs.renameSync(oldFullPath, newFullPath);

    res.status(200);
    res.send(JSON.stringify(
      {
        code: 200,
        msg: 'success'
      }
    ));
    return;    
  } catch (err) {
    console.log(err);

    res.status(500);
    res.send(JSON.stringify(
      {
        code: 500,
        msg: 'Internal Server Error'
      }
    ));
    return;
  }
});

router.post('/rm', function(req, res, next) {
  const home = path.normalize(
    path.join(__dirname,
        '..', config.server.repoDir, req.session.uuid)
  )
  .toString().replace(/\\/g, '/');

  const fullPath = path.normalize(
    path.join(home, req.body.path.replace('~', ''))
  )
  .toString().replace(/\\/g, '/');

  try {
    let stat = fs.lstatSync(fullPath);
    if (stat.isDirectory) {
      fs.rmdirSync(fullPath, {recursive: true});
    } else {
      fs.unlinkSync(fullPath);
    }

    res.status(200);
    res.send(JSON.stringify(
      {
        code: 200,
        msg: 'success'
      }
    ));
    return;    
  } catch (err) {
    res.status(500);
    res.send(JSON.stringify(
      {
        code: 500,
        msg: 'Internal Server Error'
      }
    ));
    return;
  }
});

router.get('/read/*', function(req, res, next) {
  const home = path.normalize(
    path.join(__dirname,
        '..', config.server.repoDir, req.session.uuid)
  ).toString().replace(/\\/g, '/');

  const fullPath = path.normalize(
  path.join(home, req.params['0'].replace('~', ''))
  ).toString().replace(/\\/g, '/');

  res.sendFile(fullPath);
});

router.get('/tree/*', function(req, res, next) {
  const home = path.normalize(
        path.join(__dirname,
            '..', config.server.repoDir, req.session.uuid)
  )
  .toString().replace(/\\/g, '/');

  const fullPath = path.normalize(
    path.join(home, req.params['0'].replace('~', ''))
  )
  .toString().replace(/\\/g, '/');

  let msg = JSON.stringify(
    {
      code: 200,
      msg: 'success',
      data: {
        tree: dirTree(fullPath, {normalizePath: true})
      }
    })
    .replace(new RegExp(home, 'g'), '~')
    .replace(new RegExp(req.session.uuid, 'g'), '~');
  
  res.status(200);
  res.send(
    msg
  );
  return;
});

module.exports = router;
