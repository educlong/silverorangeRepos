/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import { Router, Request, Response } from 'express';
import fakeRepos from '../data/repos.json';
import axios from 'axios';
import { Repo } from '../models/Repo';
export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  axios
    .get<Repo[]>('https://api.github.com/users/silverorange/repos')
    .then((response) => {
      const realRepos = response.data;
      fakeRepos.forEach((fakeRepo) => {
        realRepos.push(fakeRepo);
      });
      res.set({ 'Content-Type': 'application/json; charset=utf-8' });
      res.send({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: realRepos,
      });
    })
    .then((err) => res.send([]));
  // TODO: See README.md Task (A). Return repo data here. You’ve got this!
  // res.send({
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: fakeRepos,
  // });
});
