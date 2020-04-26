import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import axios, { AxiosError } from 'axios';
import { Band } from '../band/band.entity';
import { Album } from '../album/album.entity';
import { Song } from '../song/song.entity';

@Injectable()
export class ScrapeService {
  private readonly BASE_URL = `https://www.metal-archives.com`;
  private readonly DISCOGRAPHY_URL = `/band/discography/id/`;
  private readonly LYRICS_URL = `/release/ajax-view-lyrics/id/`;
  private readonly MA_ID_PATTERN = new RegExp(`([^\/]+$)`);
  private readonly client = axios.create({
    baseURL: this.BASE_URL
  });

  public constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>
  ) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    let retryCount = 0;
    this.client.interceptors.response.use(null, async (error: AxiosError) => {
      console.log({
        message: error.message,
        url: error.config.url
      });
      retryCount++;
      await sleep(1000 * retryCount);
      return this.client.request({
        method: error.config.method,
        url: error.config.url,
        params: error.config.params,
        withCredentials: true
      });
    });
  }

  public async updates() {
    const day = moment().format('MMMM DD');
    const URls = await this.getBandURls(day, 'modified');
    const updatedCount = await this.updateDB([...URls]);
    return updatedCount;
  }

  public async additions() {
    const day = moment().format('MMMM DD');
    const URls = await this.getBandURls(day, 'created');
    const updatedCount = await this.updateDB([...URls]);
    return updatedCount;
  }

  public async fullScrape() {
    const selectionPath = '/archives/ajax-band-list/selection/';
    const pathFragment = moment().format('YYYY-MM');
    const params = `sEcho=1&sSortDir_0=desc`;
    const url = `${selectionPath}${pathFragment}/by/created/json/1?${params}`;
    const res = await this.client.get(url);
    const $ = cheerio.load(res.data.aaData[0][1]);
    const newestBandURL = $('a').attr().href;
    const highestID = parseInt(this.MA_ID_PATTERN.exec(newestBandURL)[0], 10);
  }

  private async getBandURls(day: string, type: string, page = 0) {
    const selectionPath = '/archives/ajax-band-list/selection/';
    const pathFragment = moment().format('YYYY-MM');
    const params = `sEcho=${page + 1}&sSortDir_0=desc&iDisplayStart=${
      page * 200
    }`;
    const url = `${selectionPath}${pathFragment}/by/${type}/json/1?${params}`;
    const res = await this.client.get(url);
    const URLs: Set<string> = new Set();
    for (const dataSet of res.data.aaData) {
      // Skip irrelevant updates/additions.
      if (dataSet[0] !== day) continue;
      const $ = cheerio.load(dataSet[1]);
      const url = $('a').attr().href;
      URLs.add(url);
    }
    const lastEl = res.data.aaData[res.data.aaData.length - 1];
    if (lastEl[0] === day) {
      // There's a chance there were more than 200 updates/additions that day. So we skip first 200
      // and look for more bands updated that day.
      const moreURLs = await this.getBandURls(day, type, page + 1);
      for (const u of moreURLs) {
        URLs.add(u);
      }
    }
    return URLs;
  }

  private async updateDB(URLs: string[]) {
    for (const url of URLs) {
      const band = await this.getBandData(url);
      const existing = await this.bandRepository.findOne(band.id);
      if (existing) {
        getManager().transaction(async transactionalEntityManager => {
          await transactionalEntityManager.remove(existing);
          await transactionalEntityManager.save(band);
        });
      } else {
        this.bandRepository.save(band);
      }
    }

    return URLs.length;
  }

  private normalize(s: string): string | null {
    s = s.trim();
    s = s.replace(/<\/?[^>]+>/gi, '');
    s = s.replace(/\s{2,}/g, ' ');
    if (s === 'N/A') return null;
    if (s === '(lyrics not available)') return null;
    if (s === '(Instrumental)') return null;
    return s;
  }

  private async getBandData(url: string) {
    const res = await this.client.get(url);
    const $ = cheerio.load(res.data);
    const band = new Band();
    band.id = this.MA_ID_PATTERN.exec(url)[0];
    band.name = this.normalize($('.band_name').text());
    $('dd').each((i, el) => {
      if (i === 0) band.country = this.normalize($(el).text());
      else if (i === 1) band.location = this.normalize($(el).text());
      else if (i === 2) band.status = this.normalize($(el).text());
      else if (i === 3) band.formed = this.normalize($(el).text());
      else if (i === 4) band.genre = this.normalize($(el).text());
      else if (i === 5) band.themes = this.normalize($(el).text());
      else if (i === 7) band.active = this.normalize($(el).text());
    });

    const URLs = await this.getBandDiscography(band.id);

    const promises: Promise<Album>[] = [];
    for (url of URLs) {
      promises.push(this.getAlbumData(url));
    }

    const albums = await Promise.all(promises);
    band.albums = albums;
    return band;
  }

  private async getBandDiscography(bandID: string): Promise<string[]> {
    const url = `${this.DISCOGRAPHY_URL}${bandID}/tab/all`;
    const res = await this.client.get(url);
    const $ = cheerio.load(res.data);
    const albumLinks = [];
    $('a').each((_, el) => {
      const url = el.attribs.href;
      if (!url.includes(`${this.BASE_URL}/albums`)) return;
      albumLinks.push(el.attribs.href);
    });
    return albumLinks;
  }

  private async getAlbumData(url: string) {
    const res = await this.client.get(url);
    const $ = cheerio.load(res.data);
    const album = new Album();
    album.id = this.MA_ID_PATTERN.exec(url)[0];
    album.title = this.normalize($('h1.album_name a').text());
    $('dd').each((i, el) => {
      if (i === 0) album.type = this.normalize($(el).text());
      else if (i === 1) album.release = this.normalize($(el).text());
      else if (i === 2) album.catalog = this.normalize($(el).text());
    });

    const songsCount =
      $('table.table_lyrics tr.odd, table.table_lyrics tr.even')
        .not('.displayNone')
        .not('.sideRow')
        .not('.discRow').length - 1;

    const promises: Promise<Song>[] = [];
    $('table.table_lyrics tr.odd, table.table_lyrics tr.even')
      .not('.displayNone')
      .not('.sideRow')
      .not('.discRow')
      .each((i, el) => {
        if (i >= songsCount) return;
        promises.push(this.getSongData(el));
      });

    const songs = await Promise.all(promises);
    album.songs = songs;
    return album;
  }

  private async getSongData(el: CheerioElement) {
    const $ = cheerio.load(el);
    const song = new Song();
    $('td').each((i, el) => {
      if (i === 0) song.id = cheerio.load(el)('a').attr().name;
      else if (i === 1) song.title = this.normalize($(el).text());
      else if (i === 2) song.length = this.normalize($(el).text());
    });
    const res = await this.client.get(`${this.LYRICS_URL}${song.id}`);
    song.lyrics = this.normalize(res.data);
    return song;
  }
}
