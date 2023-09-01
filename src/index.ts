import axios from 'axios';
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/get-track', async (req: Request, res: Response) => {
  const name = req.body.name;

  const artist = await axios.post('http://localhost:3001/get-by-artist', {
    artist: name,
  }) as any;

  const songs = artist.data.songs.map((song: any) => ({ song: song.song, lyrics: song.lyrics }))

  /* const songs = songsName.map(async (song: any) => {
      const track = await axios.post('http://localhost:3002/get-track', {
        name: song,
      }) as any;

      console.log({track: track.data})

      return track.data;
    }) */

  const infoBySong = await Promise.all(
    songs.map(async (song: any) => {
      const {data: track} = await axios.post('http://localhost:3002/get-track', {
        name: song.song,
      }) as any;

      console.log({ track })

      if (track[0]) {
        return {
          name: track[0].name,
          lyrics: song.lyrics,
          duration: track[0].duration_ms,
        };
      }

      return {
        name: undefined,
        lyrics: song.lyrics,
        duration: undefined,
      };

      /* console.log({
        name: track.data.name,
        lyrics: song.lyrics,
        duration: track.data.duration_ms,
      }); */

    }));

  const songsResp: Record<string, any> = {}

  infoBySong.map((info: any) => {
    songsResp[info.name] = {
      lyrics: info.lyrics,
      duration: info.duration,
    }
  })

  const response = {
    artist: artist.data.artist,
    songs: songsResp,
  }

  return res.status(200).json(response);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
