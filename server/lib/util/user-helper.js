"use strict";

const md5 = require('md5');

module.exports = {

  generateUserAvatar: (userHandle) => {

    const avatarUrlPrefix = `https://vanillicon.com/${md5(userHandle)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    }

    return avatars;
  }
};
