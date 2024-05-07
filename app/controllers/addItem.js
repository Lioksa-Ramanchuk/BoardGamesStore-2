import * as itemService from '../services/itemService.js';

import { StatusCodes } from 'http-status-codes';
import path from 'path';

export async function handleAddItem(req, res, next) {
  const { title, description, rules, price, quantity, category, publisher, year, min_players, max_players, avg_play_time, player_min_age, is_available } = req.body;
  const image = path.join(process.env.UPLOADED_ITEM_IMAGE_DIR, req.file?.filename || process.env.DEFAULT_ITEM_IMAGE_FILENAME);
  const item = await itemService.create(title, description ?? '', rules ?? '', price, quantity, category ?? '', image, publisher, year, min_players, max_players, avg_play_time, player_min_age, is_available);
  if (!item) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Не атрымалася дадаць тавар.');
  }
  return res.status(StatusCodes.OK).send('Тавар паспяхова дададзены!');
}