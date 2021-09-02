/** @format */

'use strict';
import User from '../models/UserModel.js';

const searchAll = async (req, res) => {
  try {
    const { q, _limit } = req.query;

    const listUser = await User.find(
      { fullname: { $regex: q, $options: 'i' } },
      { __v: 0 },
    )
      .limit(+_limit)
      .populate([
        {
          model: 'Image',
          path: 'avatar',
        },
        {
          model: 'Image',
          path: 'cover',
        },
      ]);

    res.status(200).json({ listUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { searchAll };
