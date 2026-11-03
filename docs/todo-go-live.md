# Checklist go-live

Attività da completare prima della pubblicazione del sito sul dominio
definitivo. La build di produzione passa e Netlify pubblica automaticamente
ogni push su `main`.

## Bloccanti

- [ ] Creare il progetto Resend per l'invio delle richieste dal form Contatti.
- [ ] Verificare in Resend il dominio del mittente e aggiungere i record DNS
  richiesti (SPF e DKIM).
- [ ] Configurare nelle variabili d'ambiente di Netlify:
  - `RESEND_API_KEY`
  - `CONTATTI_MITTENTE` — per esempio `sito@delsigel.it`, su dominio verificato
  - `CONTATTI_DESTINATARIO` — solo se diverso da `info@delsigel.it`
- [ ] Pubblicare un deploy dopo la configurazione delle variabili.
- [ ] Inviare una richiesta di prova dal form `/contatti` e verificare:
  - recapito alla casella commerciale;
  - risposta al mittente tramite `Reply-To`;
  - messaggio di conferma sul sito;
  - comportamento di errore se il provider non risponde.
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
- [ ] Testare il configuratore; oggi prepara la richiesta nel client email
  (`mailto:`), non la invia dal server. Decidere se è sufficiente oppure se
  deve usare lo stesso canale Resend del form Contatti.
- [ ] Verificare telefono, email, PEC, Instagram e mappa nel footer.
- [ ] Eseguire una revisione finale dei contenuti e delle traduzioni prima del
  deploy definitivo.

## Dopo il go-live

- [ ] Ricontrollare Netlify per build, log della funzione Contatti ed eventuali
  errori Resend nelle prime 24 ore.
- [ ] Confermare in Search Console che sitemap e pagine principali sono state
  acquisite.
