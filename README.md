# boravisual

Hace rato queria hacer una app sencilla con algo de data science. Termine haciendo esto en ~2 dias con un poco de scraping, google colab, pandas y vercel.

Deployado aca [boravisual.vercel.app](https://boravisual.vercel.app/)

Inspirado en el trabajo del capo Jaime Gómez-Obregón, mas info aca https://twitter.com/JaimeObregon/status/1301099873094205441

## Develop

```
git clone git@github.com:jperelli/boravisual.git
cd boravisual
npm i
npm run local
```

## Data

Hice un scraper sencillo y meti todo en una base de datos sqlite. El codigo del scraper esta en la carpeta scraper. El html inicial lo consegui visitando la pagina de busqueda del BORA y scrolleando hasta tener todo lo que queria, y termine guardando el resultado en un html. Luego lo parsee con scraper/index.ts y finalmente le pase scraper/clean.ts.

## License

MIT
