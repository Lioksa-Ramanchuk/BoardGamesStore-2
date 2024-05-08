import * as cartItemService from '../services/cartItemService.js';
import * as itemService from '../services/itemService.js';

import { StatusCodes } from 'http-status-codes';
import path from 'path';

export async function handleUpdateItem(req, res, next) {
  const { title, description, rules, price, quantity, category, publisher, year, min_players, max_players, avg_play_time, player_min_age, is_available } = req.body;
  const image = req.file ? path.join(process.env.UPLOADED_ITEM_IMAGE_DIR, req.file?.filename) : null;
  const item = await itemService.updateById(+req.params.item_id, title, description, rules, price, quantity, category, image, publisher, year, min_players, max_players, avg_play_time, player_min_age, is_available === 'on');
  if (!item) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Не атрымалася змяніць тавар.');
  }
  if (!item.is_available) {
    await cartItemService.deleteFromAllCartsByItemId(item.id);
  }
  return res.status(StatusCodes.OK).send('Тавар паспяхова зменены!');
}