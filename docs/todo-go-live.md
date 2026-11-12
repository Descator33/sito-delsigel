# Checklist go-live

Attività da completare prima della pubblicazione del sito sul dominio
definitivo. La build di produzione passa e Netlify pubblica automaticamente
ogni push su `main`.

## Bloccanti

- [ ] Verificare con il proprietario di `info@delsigel.it` che i messaggi
  preparati dai moduli Contatti e Configuratore arrivino correttamente dopo
  l'invio dal programma di posta del visitatore.
- [ ] Fornire e pubblicare le pagine o gli URL definitivi per Termini, Privacy
  e Cookie. I tre link nel footer sono ancora segnaposto (`#`).

## Indicizzazione

- [ ] Aggiungere `robots.txt` con il riferimento alla sitemap del dominio
  definitivo.
- [ ] Aggiungere una sitemap XML per le pagine localizzate: home, Chi siamo,
  Contatti e Configuratore.
- [ ] Collegare il dominio definitivo a Google Search Console e verificarne la
  proprietà tramite DNS.
- [ ] Inviare la sitemap a Google Search Console dopo il deploy finale.
- [ ] Controllare che titolo, descrizione, canonical e alternates siano corretti
  sulle cinque lingue pubblicate.

## Verifiche prima del lancio

- [ ] Collegare il dominio definitivo a Netlify e verificare HTTPS, incluso il
  redirect tra `www` e dominio senza `www` secondo la scelta aziendale.
- [ ] Testare navigazione, cambio lingua e ancore su desktop e smartphone.
- [ ] Testare il configuratore e il messaggio preparato nel client email.
- [ ] Verificare telefono, email, PEC, Instagram e mappa nel footer.
- [ ] Eseguire una revisione finale dei contenuti e delle traduzioni prima del
  deploy definitivo.

## Dopo il go-live

- [ ] Ricontrollare Netlify per build, log della funzione Contatti ed eventuali
  errori delle funzioni nelle prime 24 ore.
- [ ] Confermare in Search Console che sitemap e pagine principali sono state
  acquisite.
